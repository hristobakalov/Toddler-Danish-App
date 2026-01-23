import { cameraConfig } from '../data/camera-data.js';
import { CacheManager } from '../utils/cache-manager.js';

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
        this.cacheManager = new CacheManager();
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

    async processDetectionResults(data) {
        const loadingSpinner = document.getElementById('loadingSpinner');

        if (!data.responses || !data.responses[0].labelAnnotations) {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            this.showError('Ingen objekter fundet. Prøv igen!');
            return;
        }

        const labels = data.responses[0].labelAnnotations;

        // Get the best label (highest confidence)
        const bestLabel = labels[0];
        const englishWord = bestLabel.description.toLowerCase();
        const confidence = bestLabel.score;

        console.log(`🔍 Detected: ${englishWord} (${Math.round(confidence * 100)}% confidence)`);

        // Step 1: Try to get Danish translation
        let danishWord = await this.translateToDanish(englishWord);

        if (!danishWord) {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            this.showError('Kunne ikke oversætte ordet. Prøv igen!');
            return;
        }

        if (loadingSpinner) loadingSpinner.style.display = 'none';

        // Step 2: Show the result
        await this.showResult(danishWord, confidence, englishWord);
    }

    async translateToDanish(englishWord) {
        // Step 1: Check cache first
        let danishWord = this.cacheManager.getTranslation(englishWord);

        if (danishWord) {
            console.log(`✅ Translation from cache: ${englishWord} → ${danishWord}`);
            return danishWord;
        }

        // Step 2: Check predefined translations
        danishWord = this.findBestTranslation(englishWord);

        if (danishWord) {
            // Cache the predefined translation
            this.cacheManager.cacheTranslation(englishWord, danishWord);
            console.log(`✅ Translation from predefined: ${englishWord} → ${danishWord}`);
            return danishWord;
        }

        // Step 3: Use Google Translate API
        try {
            danishWord = await this.callGoogleTranslate(englishWord);

            if (danishWord) {
                // Cache the API translation
                this.cacheManager.cacheTranslation(englishWord, danishWord);
                console.log(`✅ Translation from API: ${englishWord} → ${danishWord}`);
                return danishWord;
            }
        } catch (error) {
            console.error('Translation API error:', error);
        }

        return null;
    }

    async callGoogleTranslate(text) {
        const apiKey = window.GOOGLE_TRANSLATION_API_KEY;

        if (!apiKey) {
            console.warn('Google Translate API key not found');
            return null;
        }

        try {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: 'en',
                    target: 'da',
                    format: 'text'
                })
            });

            if (!response.ok) {
                throw new Error(`Translation API failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.data && data.data.translations && data.data.translations[0]) {
                return data.data.translations[0].translatedText;
            }

            return null;

        } catch (error) {
            console.error('Error calling Google Translate:', error);
            return null;
        }
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

    async showResult(danishWord, confidence, englishWord) {
        const objectName = document.getElementById('detectedObjectName');
        const objectEmoji = document.getElementById('detectedObjectEmoji');
        const confidenceEl = document.getElementById('confidenceLevel');

        if (objectName) {
            objectName.textContent = danishWord;
        }

        if (objectEmoji) {
            const emoji = cameraConfig.emojis[danishWord] || this.getEmojiForEnglish(englishWord) || '📦';
            objectEmoji.textContent = emoji;
        }

        if (confidenceEl) {
            const percentage = Math.round(confidence * 100);
            confidenceEl.textContent = `${percentage}% sikker`;
        }

        this.lastDetectedObject = danishWord;

        // Speak the Danish word using ElevenLabs
        await this.speakWord(danishWord);

        // Add celebration animation
        this.celebrate();
    }

    getEmojiForEnglish(englishWord) {
        // Try to find emoji from English word mapping
        const commonEmojis = {
            'dog': '🐕', 'cat': '🐱', 'bird': '🐦', 'fish': '🐟',
            'apple': '🍎', 'banana': '🍌', 'orange': '🍊',
            'car': '🚗', 'bus': '🚌', 'bicycle': '🚲',
            'book': '📖', 'phone': '📱', 'computer': '💻',
            'tree': '🌳', 'flower': '🌸', 'sun': '☀️',
            'person': '👤', 'baby': '👶', 'child': '👶',
            'food': '🍽️', 'drink': '🥤', 'bottle': '🍼'
        };

        return commonEmojis[englishWord.toLowerCase()] || null;
    }

    async speakWord(word) {
        try {
            // Check cache first
            const cachedAudio = this.cacheManager.getAudio(word);

            if (cachedAudio && cachedAudio.data) {
                console.log(`🔊 Playing audio from cache: ${word}`);
                await this.playAudioData(cachedAudio.data);
                return;
            }

            // Generate audio using ElevenLabs
            console.log(`🎙️ Generating audio for: ${word}`);
            const audioData = await this.generateElevenLabsAudio(word);

            if (audioData) {
                // Cache the audio
                this.cacheManager.cacheAudio(word, audioData);

                // Play the audio
                await this.playAudioData(audioData);
            } else {
                // Fallback to browser TTS
                this.fallbackToWebSpeech(word);
            }

        } catch (error) {
            console.error('Error speaking word:', error);
            // Fallback to browser TTS
            this.fallbackToWebSpeech(word);
        }
    }

    async generateElevenLabsAudio(text) {
        const apiKey = window.ELEVENLABS_API_KEY;
        const voiceId = window.ELEVENLABS_VOICE_ID;
        const modelId = window.ELEVENLABS_MODEL_ID;

        if (!apiKey || !voiceId) {
            console.warn('ElevenLabs API credentials not found');
            return null;
        }

        try {
            const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey
                },
                body: JSON.stringify({
                    text: text,
                    model_id: modelId,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                        style: 0.0,
                        use_speaker_boost: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API failed: ${response.status}`);
            }

            // Get audio as blob
            const audioBlob = await response.blob();

            // Convert to base64 for caching
            const base64Audio = await this.blobToBase64(audioBlob);

            return base64Audio;

        } catch (error) {
            console.error('Error generating ElevenLabs audio:', error);
            return null;
        }
    }

    async blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    async playAudioData(base64Data) {
        return new Promise((resolve, reject) => {
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement = null;
            }

            this.audioElement = new Audio(base64Data);
            this.audioElement.onended = () => resolve();
            this.audioElement.onerror = (error) => reject(error);

            this.audioElement.play().catch(error => {
                console.error('Audio playback error:', error);
                reject(error);
            });
        });
    }

    fallbackToWebSpeech(word) {
        // Fallback to browser's Web Speech API with Danish voice
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'da-DK';
            utterance.rate = 0.8; // Slower for toddlers
            utterance.pitch = 1.2; // Higher pitch for children
            window.speechSynthesis.speak(utterance);
        }
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
