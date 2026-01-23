import { cameraConfig } from '../data/camera-data.js';

export class CameraGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.stream = null;
        this.isProcessing = false;
        this.lastDetectedObject = null;
        this.audioElement = null;
    }

    init() {
        this.setupElements();
        this.setupControls();
        this.showStartScreen();
    }

    setupElements() {
        this.video = document.getElementById('cameraVideo');
        this.canvas = document.getElementById('captureCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
    }

    setupControls() {
        const startBtn = document.getElementById('startCameraBtn');
        const captureBtn = document.getElementById('capturePhotoBtn');
        const retryBtn = document.getElementById('retryCameraBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startCamera());
        }

        if (captureBtn) {
            captureBtn.addEventListener('click', () => this.capturePhoto());
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.resetCamera());
        }
    }

    showStartScreen() {
        document.getElementById('cameraStartScreen').style.display = 'flex';
        document.getElementById('cameraActiveScreen').style.display = 'none';
        document.getElementById('cameraResultScreen').style.display = 'none';
    }

    async startCamera() {
        try {
            // Request back camera access
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' }, // Back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (this.video) {
                this.video.srcObject = this.stream;
                this.video.play();
            }

            // Show camera screen
            document.getElementById('cameraStartScreen').style.display = 'none';
            document.getElementById('cameraActiveScreen').style.display = 'flex';
            document.getElementById('cameraResultScreen').style.display = 'none';

        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Kunne ikke tilgå kameraet. Giv venligst tilladelse.');
        }
    }

    capturePhoto() {
        if (!this.video || !this.canvas || this.isProcessing) return;

        // Set canvas size to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0);

        // Convert canvas to base64 image
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);

        // Show processing state
        this.showProcessing();

        // Send to Google Vision API
        this.detectObject(imageData);
    }

    showProcessing() {
        const resultScreen = document.getElementById('cameraResultScreen');
        const objectName = document.getElementById('detectedObjectName');
        const objectEmoji = document.getElementById('detectedObjectEmoji');
        const loadingSpinner = document.getElementById('loadingSpinner');

        if (objectName) objectName.textContent = 'Analyserer...';
        if (objectEmoji) objectEmoji.textContent = '🔍';
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        document.getElementById('cameraActiveScreen').style.display = 'none';
        resultScreen.style.display = 'flex';
    }

    async detectObject(imageDataUrl) {
        this.isProcessing = true;

        try {
            // Get API key from environment
            const apiKey = this.getApiKey();

            if (!apiKey) {
                throw new Error('API key not found');
            }

            // Remove data URL prefix to get base64 content
            const base64Image = imageDataUrl.split(',')[1];

            // Prepare request for Google Vision API
            const requestBody = {
                requests: [{
                    image: {
                        content: base64Image
                    },
                    features: [{
                        type: 'LABEL_DETECTION',
                        maxResults: cameraConfig.maxLabels
                    }]
                }]
            };

            // Call Google Vision API
            const response = await fetch(`${cameraConfig.visionApiUrl}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();

            // Process the results
            this.processDetectionResults(data);

        } catch (error) {
            console.error('Error detecting object:', error);
            this.showError('Kunne ikke genkende objektet. Prøv igen!');
        } finally {
            this.isProcessing = false;
        }
    }

    processDetectionResults(data) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        if (!data.responses || !data.responses[0].labelAnnotations) {
            this.showError('Ingen objekter fundet. Prøv igen!');
            return;
        }

        const labels = data.responses[0].labelAnnotations;

        // Find the best matching label that we have a translation for
        let bestMatch = null;
        let highestScore = 0;

        for (const label of labels) {
            const englishLabel = label.description.toLowerCase();
            const score = label.score;

            // Check if we have a translation for this label
            if (cameraConfig.translations[englishLabel] && score > highestScore) {
                bestMatch = {
                    english: englishLabel,
                    danish: cameraConfig.translations[englishLabel],
                    score: score
                };
                highestScore = score;
            }
        }

        if (!bestMatch) {
            // Try to find a partial match or use the first label
            const firstLabel = labels[0].description.toLowerCase();
            const danishWord = this.findBestTranslation(firstLabel);

            if (danishWord) {
                bestMatch = {
                    english: firstLabel,
                    danish: danishWord,
                    score: labels[0].score
                };
            } else {
                this.showError('Jeg kender ikke dette ord endnu. Prøv noget andet!');
                return;
            }
        }

        // Show the result
        this.showResult(bestMatch.danish, bestMatch.score);
    }

    findBestTranslation(englishWord) {
        // Try exact match first
        if (cameraConfig.translations[englishWord]) {
            return cameraConfig.translations[englishWord];
        }

        // Try to find partial matches
        for (const [eng, dan] of Object.entries(cameraConfig.translations)) {
            if (englishWord.includes(eng) || eng.includes(englishWord)) {
                return dan;
            }
        }

        return null;
    }

    showResult(danishWord, confidence) {
        const objectName = document.getElementById('detectedObjectName');
        const objectEmoji = document.getElementById('detectedObjectEmoji');
        const confidenceEl = document.getElementById('confidenceLevel');

        if (objectName) {
            objectName.textContent = danishWord;
        }

        if (objectEmoji) {
            const emoji = cameraConfig.emojis[danishWord] || '📦';
            objectEmoji.textContent = emoji;
        }

        if (confidenceEl) {
            const percentage = Math.round(confidence * 100);
            confidenceEl.textContent = `${percentage}% sikker`;
        }

        this.lastDetectedObject = danishWord;

        // Speak the Danish word
        this.speakWord(danishWord);

        // Add celebration animation
        this.celebrate();
    }

    speakWord(word) {
        // Try to use browser's Web Speech API with Danish voice
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'da-DK';
            utterance.rate = 0.8; // Slower for toddlers
            utterance.pitch = 1.2; // Higher pitch for children
            window.speechSynthesis.speak(utterance);
        }

        // Also play audio if available (fallback or enhancement)
        // You can add recorded Danish audio files later
    }

    celebrate() {
        const emoji = document.getElementById('detectedObjectEmoji');
        if (emoji) {
            emoji.classList.add('celebrate');
            setTimeout(() => {
                emoji.classList.remove('celebrate');
            }, 1000);
        }
    }

    showError(message) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        const objectName = document.getElementById('detectedObjectName');
        const objectEmoji = document.getElementById('detectedObjectEmoji');

        if (objectName) objectName.textContent = message;
        if (objectEmoji) objectEmoji.textContent = '❌';
    }

    resetCamera() {
        // Go back to camera view
        document.getElementById('cameraResultScreen').style.display = 'none';
        document.getElementById('cameraActiveScreen').style.display = 'flex';
    }

    getApiKey() {
        // In development, try to get from global config or window
        if (window.GOOGLE_VISION_API_KEY) {
            return window.GOOGLE_VISION_API_KEY;
        }

        // For production, you should fetch this from your backend
        // to keep the API key secure
        console.warn('Google Vision API key not found. Please set window.GOOGLE_VISION_API_KEY');
        return null;
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.video) {
            this.video.srcObject = null;
        }
    }

    destroy() {
        this.stopCamera();

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}
