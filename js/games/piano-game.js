import { pianoConfig } from '../data/piano-data.js';
import { AudioManager } from '../utils/audio-manager.js';

export class PianoGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.audioManager = new AudioManager();

        // Game state
        this.currentMode = null;
        this.isTeachingActive = false;
        this.currentSong = null;
        this.currentNoteIndex = 0;
        this.notesPlayed = 0;

        // DOM elements (will be set in init)
        this.elements = {};
    }

    init() {
        this.setupElements();
        this.showModeSelection();
    }

    setupElements() {
        // Cache DOM references
        this.elements = {
            modeScreen: document.getElementById('pianoModeScreen'),
            freestyleScreen: document.getElementById('pianoFreestyleScreen'),
            teachingScreen: document.getElementById('pianoTeachingScreen'),
            freestyleBtn: document.getElementById('selectFreestyleBtn'),
            teachingBtn: document.getElementById('selectTeachingBtn'),
            backToModeBtn: document.querySelectorAll('.back-to-mode-btn'),
            keyboardContainer: document.getElementById('pianoKeyboard'),
            teachingKeyboardContainer: document.getElementById('pianoTeachingKeyboard'),
            scoreDisplay: document.getElementById('pianoScore'),
            songNameDisplay: document.getElementById('currentSongName'),
            progressDisplay: document.getElementById('teachingProgress'),
            nextSongBtn: document.getElementById('nextSongBtn')
        };

        this.setupControls();
    }

    setupControls() {
        // Mode selection buttons
        this.elements.freestyleBtn?.addEventListener('click', () => {
            this.startFreestyle();
        });

        this.elements.teachingBtn?.addEventListener('click', () => {
            this.startTeaching();
        });

        // Back buttons
        this.elements.backToModeBtn?.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showModeSelection();
            });
        });

        // Next song button
        this.elements.nextSongBtn?.addEventListener('click', () => {
            this.loadNextSong();
        });
    }

    showModeSelection() {
        this.currentMode = null;
        this.isTeachingActive = false;

        // Show mode screen, hide others
        this.elements.modeScreen.style.display = 'flex';
        this.elements.freestyleScreen.style.display = 'none';
        this.elements.teachingScreen.style.display = 'none';
    }

    startFreestyle() {
        this.currentMode = 'freestyle';
        this.notesPlayed = 0;

        // Show freestyle screen
        this.elements.modeScreen.style.display = 'none';
        this.elements.freestyleScreen.style.display = 'flex';
        this.elements.teachingScreen.style.display = 'none';

        // Render keyboard
        this.renderKeyboard(this.elements.keyboardContainer, false);

        // Update score
        this.updateScore();
    }

    startTeaching() {
        this.currentMode = 'teaching';
        this.isTeachingActive = true;

        // Show teaching screen
        this.elements.modeScreen.style.display = 'none';
        this.elements.freestyleScreen.style.display = 'none';
        this.elements.teachingScreen.style.display = 'flex';

        // Load first song
        this.loadSong(0);

        // Render keyboard
        this.renderKeyboard(this.elements.teachingKeyboardContainer, true);
    }

    renderKeyboard(container, isTeachingMode) {
        container.innerHTML = '';

        pianoConfig.keys.forEach((keyData, index) => {
            const key = document.createElement('div');

            // Set class based on key color
            if (keyData.isBlack) {
                key.className = 'piano-key black-key';
            } else {
                key.className = 'piano-key white-key';
            }

            key.dataset.keyId = keyData.id;
            key.dataset.note = keyData.note;

            // Add click/touch handler
            key.addEventListener('click', () => {
                this.handleKeyPress(keyData, key, isTeachingMode);
            });

            // Prevent touch scroll
            key.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleKeyPress(keyData, key, isTeachingMode);
            }, { passive: false });

            container.appendChild(key);
        });

        // Highlight first note in teaching mode
        if (isTeachingMode && this.currentSong) {
            this.highlightCurrentNote();
        }
    }

    handleKeyPress(keyData, keyElement, isTeachingMode) {
        if (isTeachingMode) {
            this.handleTeachingKeyPress(keyData, keyElement);
        } else {
            this.handleFreestyleKeyPress(keyData, keyElement);
        }
    }

    handleFreestyleKeyPress(keyData, keyElement) {
        // Play sound
        this.audioManager.playNote(keyData.frequency);

        // Visual feedback
        this.animateKeyPress(keyElement);

        // Increment counter
        this.notesPlayed++;
        this.updateScore();
    }

    handleTeachingKeyPress(keyData, keyElement) {
        if (!this.isTeachingActive || !this.currentSong) return;

        const expectedKeyId = this.currentSong.notes[this.currentNoteIndex];

        if (keyData.id === expectedKeyId) {
            // Correct key pressed
            this.audioManager.playNoteEmphasis(keyData.frequency);
            this.animateKeySuccess(keyElement);

            // Move to next note
            this.currentNoteIndex++;
            this.updateProgress();

            // Check if song completed
            if (this.currentNoteIndex >= this.currentSong.notes.length) {
                this.onSongComplete();
            } else {
                // Highlight next note after delay
                setTimeout(() => {
                    this.highlightCurrentNote();
                }, 600);
            }
        } else {
            // Wrong key - gentle feedback
            this.audioManager.playNote(keyData.frequency, 0.3); // Shorter duration
            this.animateKeyError(keyElement);
        }
    }

    highlightCurrentNote() {
        // Remove all highlights
        const allKeys = this.elements.teachingKeyboardContainer.querySelectorAll('.piano-key');
        allKeys.forEach(k => k.classList.remove('highlighted'));

        // Highlight current note (no sound hint - just visual)
        if (this.currentNoteIndex < this.currentSong.notes.length) {
            const targetKeyId = this.currentSong.notes[this.currentNoteIndex];
            const targetKey = this.elements.teachingKeyboardContainer.querySelector(`[data-key-id="${targetKeyId}"]`);

            if (targetKey) {
                targetKey.classList.add('highlighted');
            }
        }
    }

    loadSong(songIndex) {
        this.currentSong = pianoConfig.songs[songIndex];
        this.currentNoteIndex = 0;

        // Update UI
        this.elements.songNameDisplay.textContent = this.currentSong.name;
        this.updateProgress();
    }

    loadNextSong() {
        const currentIndex = pianoConfig.songs.indexOf(this.currentSong);
        const nextIndex = (currentIndex + 1) % pianoConfig.songs.length;

        this.loadSong(nextIndex);

        // Re-render keyboard to reset highlights
        this.renderKeyboard(this.elements.teachingKeyboardContainer, true);

        this.isTeachingActive = true;

        // Hide next song button
        this.elements.nextSongBtn.style.display = 'none';
    }

    onSongComplete() {
        this.isTeachingActive = false;

        // Remove all highlights
        const allKeys = this.elements.teachingKeyboardContainer.querySelectorAll('.piano-key');
        allKeys.forEach(k => k.classList.remove('highlighted'));

        // Show celebration
        this.showCelebration();

        // Show next song button
        this.elements.nextSongBtn.style.display = 'block';
    }

    updateScore() {
        if (this.elements.scoreDisplay) {
            this.elements.scoreDisplay.textContent = this.notesPlayed;
        }
    }

    updateProgress() {
        if (this.elements.progressDisplay && this.currentSong) {
            this.elements.progressDisplay.textContent =
                `${this.currentNoteIndex} / ${this.currentSong.notes.length}`;
        }
    }

    // Animation methods
    animateKeyPress(keyElement) {
        keyElement.classList.add('pressed');
        setTimeout(() => {
            keyElement.classList.remove('pressed');
        }, 200);
    }

    animateKeySuccess(keyElement) {
        keyElement.classList.add('success');
        setTimeout(() => {
            keyElement.classList.remove('success');
        }, 600);
    }

    animateKeyError(keyElement) {
        keyElement.classList.add('error');
        setTimeout(() => {
            keyElement.classList.remove('error');
        }, 400);
    }

    showCelebration() {
        // Create celebration overlay
        const celebration = document.createElement('div');
        celebration.className = 'piano-celebration';
        celebration.innerHTML = `
            <div class="celebration-emoji">🎉</div>
            <div class="celebration-text">Godt Klaret!</div>
        `;

        this.elements.teachingScreen.appendChild(celebration);

        setTimeout(() => {
            celebration.remove();
        }, 2000);
    }

    destroy() {
        this.isTeachingActive = false;
        this.audioManager.destroy();

        // Clear keyboards
        if (this.elements.keyboardContainer) {
            this.elements.keyboardContainer.innerHTML = '';
        }
        if (this.elements.teachingKeyboardContainer) {
            this.elements.teachingKeyboardContainer.innerHTML = '';
        }
    }
}
