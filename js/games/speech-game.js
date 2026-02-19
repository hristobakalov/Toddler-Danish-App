import { speechConfig } from '../data/speech-data.js';
import { CacheManager } from '../utils/cache-manager.js';

export class SpeechGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.currentBulgarianText = '';
        this.currentDanishText = '';
        this.audioElement = null;
        this.cacheManager = new CacheManager();
        this.savedPhrases = this.loadSavedPhrases();
        this.stream = null;
    }

    init() {
        console.log('✅ Using ElevenLabs Speech-to-Text API');
        console.log('✅ Works on all devices including iOS!');

        this.setupControls();
        this.showMainScreen();
        this.renderHistory();
    }

    async setupMediaRecorder() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('✅ Microphone access granted');

            // Create MediaRecorder with compatible format
            const mimeType = this.getSupportedMimeType();
            console.log('Using MIME type:', mimeType);

            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = async () => {
                console.log('🎤 Recording stopped, processing audio...');
                await this.processRecording();
            };

            return true;
        } catch (error) {
            console.error('❌ Error accessing microphone:', error);
            alert('Kunne ikke få adgang til mikrofon. Giv venligst tilladelse.');
            return false;
        }
    }

    getSupportedMimeType() {
        // Check supported formats in order of preference
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4',
            'audio/mpeg'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return ''; // Use default
    }

    setupControls() {
        const listenBtn = document.getElementById('startListeningBtn');
        const playDanishBtn = document.getElementById('playDanishBtn');
        const saveBtn = document.getElementById('savePhraseBtn');
        const newBtn = document.getElementById('newPhraseBtn');
        const historyBtn = document.getElementById('viewHistoryBtn');
        const backFromHistoryBtn = document.getElementById('backFromHistoryBtn');

        if (listenBtn) {
            // Hold to speak functionality
            listenBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startListening();
            });

            listenBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.stopListening();
            });

            listenBtn.addEventListener('mouseleave', (e) => {
                if (this.isListening) {
                    this.stopListening();
                }
            });

            // Touch events for mobile
            listenBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startListening();
            });

            listenBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopListening();
            });

            listenBtn.addEventListener('touchcancel', (e) => {
                if (this.isListening) {
                    this.stopListening();
                }
            });
        }

        if (playDanishBtn) {
            playDanishBtn.addEventListener('click', () => this.playDanishAudio());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentPhrase());
        }

        if (newBtn) {
            newBtn.addEventListener('click', () => this.resetToMain());
        }

        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.showHistoryScreen());
        }

        if (backFromHistoryBtn) {
            backFromHistoryBtn.addEventListener('click', () => this.showMainScreen());
        }
    }

    showMainScreen() {
        document.getElementById('speechMainScreen').style.display = 'flex';
        document.getElementById('speechResultScreen').style.display = 'none';
        document.getElementById('speechHistoryScreen').style.display = 'none';
        this.resetCurrentPhrase();
    }

    showResultScreen() {
        document.getElementById('speechMainScreen').style.display = 'none';
        document.getElementById('speechResultScreen').style.display = 'flex';
        document.getElementById('speechHistoryScreen').style.display = 'none';
    }

    showHistoryScreen() {
        document.getElementById('speechMainScreen').style.display = 'none';
        document.getElementById('speechResultScreen').style.display = 'none';
        document.getElementById('speechHistoryScreen').style.display = 'flex';
        this.renderHistory();
    }

    async startListening() {
        if (this.isRecording) {
            console.log('⚠️ Already recording, ignoring start request');
            return;
        }

        // Setup MediaRecorder if not already set up
        if (!this.mediaRecorder) {
            const success = await this.setupMediaRecorder();
            if (!success) return;
        }

        try {
            this.audioChunks = [];
            this.isRecording = true;
            console.log('🎤 Starting recording...');

            this.mediaRecorder.start();
            this.showListeningState();

        } catch (error) {
            console.error('❌ Error starting recording:', error);
            this.isRecording = false;
            this.hideListeningState();
            alert('Kunne ikke starte optagelse. Prøv igen.');
        }
    }

    stopListening() {
        if (!this.isRecording || !this.mediaRecorder) {
            console.log('⚠️ Not recording, ignoring stop request');
            return;
        }

        try {
            console.log('🛑 Stopping recording...');
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.hideListeningState();

        } catch (error) {
            console.error('❌ Error stopping recording:', error);
            this.isRecording = false;
            this.hideListeningState();
        }
    }

    async processRecording() {
        if (this.audioChunks.length === 0) {
            console.error('❌ No audio data recorded');
            this.showError('Ingen lyd blev optaget. Prøv igen.');
            return;
        }

        // Show processing state
        this.showProcessing();

        try {
            // Create blob from recorded chunks
            const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder.mimeType });
            console.log('Audio blob size:', audioBlob.size, 'bytes');

            // Convert to Bulgarian text using ElevenLabs
            const bulgarianText = await this.transcribeAudio(audioBlob);

            if (!bulgarianText) {
                this.showError('Kunne ikke genkende tale. Prøv igen.');
                return;
            }

            this.currentBulgarianText = bulgarianText;

            // Translate to Danish
            const danishText = await this.translateToDanish(bulgarianText);

            if (!danishText) {
                this.showError('Kunne ikke oversætte. Prøv igen!');
                return;
            }

            this.currentDanishText = danishText;

            // Show result
            this.displayTranslation(bulgarianText, danishText);

            // Generate and play Danish audio
            await this.generateAndPlayDanishAudio(danishText);

        } catch (error) {
            console.error('❌ Error processing recording:', error);
            this.showError('Der opstod en fejl. Prøv igen!');
        }
    }

    async transcribeAudio(audioBlob) {
        const apiKey = window.ELEVENLABS_API_KEY;

        if (!apiKey) {
            console.error('❌ ElevenLabs API key not found');
            return null;
        }

        try {
            console.log('🎙️ Transcribing audio with ElevenLabs...');

            // Convert to format ElevenLabs accepts
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model_id', 'eleven_multilingual_v2');
            formData.append('language_code', 'bg'); // Bulgarian language code

            const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ ElevenLabs STT failed:', response.status);
                console.error('Error response:', errorText);
                throw new Error(`ElevenLabs STT failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('ElevenLabs STT response:', data);

            if (data.text) {
                console.log('✅ Transcribed:', data.text);
                return data.text;
            }

            console.error('❌ No text in response');
            return null;

        } catch (error) {
            console.error('❌ Error transcribing audio:', error);
            return null;
        }
    }

    showListeningState() {
        const listenBtn = document.getElementById('startListeningBtn');
        const statusText = document.getElementById('listeningStatus');

        if (listenBtn) {
            listenBtn.classList.add('listening');
            listenBtn.innerHTML = '🎤';
        }

        if (statusText) {
            statusText.textContent = 'Говори на български...';
            statusText.style.display = 'block';
        }
    }

    hideListeningState() {
        const listenBtn = document.getElementById('startListeningBtn');
        const statusText = document.getElementById('listeningStatus');

        if (listenBtn) {
            listenBtn.classList.remove('listening');
            listenBtn.innerHTML = '🎤';
        }

        if (statusText) {
            statusText.style.display = 'none';
        }
    }

    showProcessing() {
        const bulgarianDisplay = document.getElementById('bulgarianText');
        const danishDisplay = document.getElementById('danishText');
        const loadingSpinner = document.getElementById('speechLoadingSpinner');

        if (bulgarianDisplay) bulgarianDisplay.textContent = this.currentBulgarianText;
        if (danishDisplay) danishDisplay.textContent = 'Oversætter...';
        if (loadingSpinner) loadingSpinner.style.display = 'block';

        this.showResultScreen();
    }

    displayTranslation(bulgarianText, danishText) {
        const bulgarianDisplay = document.getElementById('bulgarianText');
        const danishDisplay = document.getElementById('danishText');
        const loadingSpinner = document.getElementById('speechLoadingSpinner');
        const playBtn = document.getElementById('playDanishBtn');
        const saveBtn = document.getElementById('savePhraseBtn');
        const newBtn = document.getElementById('newPhraseBtn');

        if (bulgarianDisplay) bulgarianDisplay.textContent = bulgarianText;
        if (danishDisplay) danishDisplay.textContent = danishText;
        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (playBtn) playBtn.style.display = 'block';
        if (saveBtn) saveBtn.style.display = 'block';
        if (newBtn) newBtn.style.display = 'block';
    }

    async translateToDanish(bulgarianText) {
        try {
            const apiKey = window.GOOGLE_TRANSLATION_API_KEY;

            if (!apiKey) {
                console.error('❌ Google Translate API key not found');
                console.error('Please set window.GOOGLE_TRANSLATION_API_KEY in config.js');
                return null;
            }

            console.log('🌐 Translating to Danish:', bulgarianText);

            const response = await fetch(`${speechConfig.translateApiUrl}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: bulgarianText,
                    source: 'bg',
                    target: 'da',
                    format: 'text'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Translation API failed:', response.status);
                console.error('Error response:', errorText);
                throw new Error(`Translation API failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('Translation API response:', data);

            if (data.data && data.data.translations && data.data.translations[0]) {
                const translated = data.data.translations[0].translatedText;
                console.log('✅ Translated:', bulgarianText, '→', translated);
                return translated;
            }

            console.error('❌ Unexpected translation response format:', data);
            return null;

        } catch (error) {
            console.error('❌ Error translating text:', error);
            return null;
        }
    }

    async generateAndPlayDanishAudio(danishText) {
        try {
            // Check cache first
            const cachedAudio = this.cacheManager.getAudio(danishText);

            if (cachedAudio && cachedAudio.data) {
                console.log(`🔊 Playing audio from cache: ${danishText}`);
                await this.playAudioData(cachedAudio.data);
                return;
            }

            // Generate audio using ElevenLabs
            console.log(`🎙️ Generating audio for: ${danishText}`);
            const audioData = await this.generateElevenLabsAudio(danishText);

            if (audioData) {
                // Cache the audio
                this.cacheManager.cacheAudio(danishText, audioData);

                // Play the audio
                await this.playAudioData(audioData);
            } else {
                // Fallback to browser TTS
                this.fallbackToWebSpeech(danishText);
            }

        } catch (error) {
            console.error('Error generating audio:', error);
            // Fallback to browser TTS
            this.fallbackToWebSpeech(danishText);
        }
    }

    async generateElevenLabsAudio(text) {
        const apiKey = window.ELEVENLABS_API_KEY;
        const voiceId = window.ELEVENLABS_VOICE_ID;
        const modelId = window.ELEVENLABS_MODEL_ID;

        if (!apiKey || !voiceId) {
            console.warn('⚠️ ElevenLabs API credentials not found, using fallback TTS');
            console.warn('To use ElevenLabs, set window.ELEVENLABS_API_KEY and window.ELEVENLABS_VOICE_ID in config.js');
            return null;
        }

        try {
            console.log('🎙️ Generating ElevenLabs audio for:', text);
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
                const errorText = await response.text();
                console.error('❌ ElevenLabs API failed:', response.status);
                console.error('Error response:', errorText);
                throw new Error(`ElevenLabs API failed: ${response.status}`);
            }

            // Get audio as blob
            const audioBlob = await response.blob();
            console.log('✅ ElevenLabs audio generated successfully');

            // Convert to base64 for caching
            const base64Audio = await this.blobToBase64(audioBlob);

            return base64Audio;

        } catch (error) {
            console.error('❌ Error generating ElevenLabs audio:', error);
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

    fallbackToWebSpeech(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'da-DK';
            utterance.rate = 0.8;
            utterance.pitch = 1.2;
            window.speechSynthesis.speak(utterance);
        }
    }

    async playDanishAudio() {
        if (!this.currentDanishText) return;

        const btn = document.getElementById('playDanishBtn');
        if (btn) {
            btn.classList.add('playing');
        }

        await this.generateAndPlayDanishAudio(this.currentDanishText);

        if (btn) {
            setTimeout(() => {
                btn.classList.remove('playing');
            }, 800);
        }
    }

    saveCurrentPhrase() {
        if (!this.currentBulgarianText || !this.currentDanishText) return;

        const phrase = {
            bulgarian: this.currentBulgarianText,
            danish: this.currentDanishText,
            timestamp: new Date().toISOString()
        };

        // Add to beginning of array
        this.savedPhrases.unshift(phrase);

        // Limit to max saved phrases
        if (this.savedPhrases.length > speechConfig.maxSavedPhrases) {
            this.savedPhrases = this.savedPhrases.slice(0, speechConfig.maxSavedPhrases);
        }

        // Save to localStorage
        this.savePhrases();

        // Show confirmation
        const saveBtn = document.getElementById('savePhraseBtn');
        if (saveBtn) {
            const originalText = saveBtn.textContent;
            saveBtn.textContent = '✅ Gemt!';
            saveBtn.disabled = true;

            setTimeout(() => {
                saveBtn.textContent = originalText;
                saveBtn.disabled = false;
            }, 2000);
        }

        console.log('Phrase saved:', phrase);
    }

    loadSavedPhrases() {
        try {
            const stored = localStorage.getItem(speechConfig.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading saved phrases:', error);
            return [];
        }
    }

    savePhrases() {
        try {
            localStorage.setItem(speechConfig.storageKey, JSON.stringify(this.savedPhrases));
        } catch (error) {
            console.error('Error saving phrases:', error);
        }
    }

    renderHistory() {
        const historyList = document.getElementById('phraseHistoryList');
        if (!historyList) return;

        if (this.savedPhrases.length === 0) {
            historyList.innerHTML = '<div class="empty-history">Ingen gemte sætninger endnu</div>';
            return;
        }

        historyList.innerHTML = this.savedPhrases.map((phrase, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-item-content">
                    <div class="history-bulgarian">${phrase.bulgarian}</div>
                    <div class="history-arrow">→</div>
                    <div class="history-danish">${phrase.danish}</div>
                </div>
                <div class="history-actions">
                    <button class="history-play-btn" data-index="${index}">
                        🔊
                    </button>
                    <button class="history-delete-btn" data-index="${index}">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        historyList.querySelectorAll('.history-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.playHistoryPhrase(index);
            });
        });

        historyList.querySelectorAll('.history-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteHistoryPhrase(index);
            });
        });
    }

    async playHistoryPhrase(index) {
        const phrase = this.savedPhrases[index];
        if (!phrase) return;

        await this.generateAndPlayDanishAudio(phrase.danish);
    }

    deleteHistoryPhrase(index) {
        this.savedPhrases.splice(index, 1);
        this.savePhrases();
        this.renderHistory();
    }

    resetCurrentPhrase() {
        this.currentBulgarianText = '';
        this.currentDanishText = '';

        const playBtn = document.getElementById('playDanishBtn');
        const saveBtn = document.getElementById('savePhraseBtn');
        const newBtn = document.getElementById('newPhraseBtn');

        if (playBtn) playBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'none';
        if (newBtn) newBtn.style.display = 'none';
    }

    resetToMain() {
        this.showMainScreen();
    }

    showError(message) {
        const bulgarianDisplay = document.getElementById('bulgarianText');
        const danishDisplay = document.getElementById('danishText');
        const loadingSpinner = document.getElementById('speechLoadingSpinner');

        if (loadingSpinner) loadingSpinner.style.display = 'none';
        if (bulgarianDisplay) bulgarianDisplay.textContent = this.currentBulgarianText || '';
        if (danishDisplay) danishDisplay.textContent = message;

        this.showResultScreen();
    }

    getErrorMessage(errorType) {
        const errorMessages = {
            'no-speech': 'Ingen tale detekteret',
            'audio-capture': 'Kunne ikke få adgang til mikrofon',
            'not-allowed': 'Mikrofon adgang nægtet',
            'network': 'Netværksfejl',
            'aborted': 'Talegenkendelses afbrudt',
            'service-not-allowed': 'Tjeneste ikke tilladt',
            'bad-grammar': 'Grammatikfejl',
            'language-not-supported': 'Sprog ikke understøttet'
        };

        return errorMessages[errorType] || `Ukendt fejl: ${errorType}`;
    }

    destroy() {
        // Stop recording if active
        if (this.isRecording && this.mediaRecorder) {
            this.mediaRecorder.stop();
        }

        // Stop media stream
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}
