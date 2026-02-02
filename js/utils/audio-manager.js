// Audio Manager - Web Audio API for Piano
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initAudioContext();
    }

    initAudioContext() {
        // Create on user interaction to avoid autoplay policy issues
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // 30% volume for comfortable listening
        }
    }

    playNote(frequency, duration = 0.5) {
        // Ensure audio context is running
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const currentTime = this.audioContext.currentTime;

        // Create oscillator for the note
        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        // Use sine wave for pleasant, smooth tone
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, currentTime);

        // ADSR Envelope (Attack, Decay, Sustain, Release)
        // Attack: Quick rise to peak
        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(0.8, currentTime + 0.02);

        // Decay to sustain level
        noteGain.gain.linearRampToValueAtTime(0.5, currentTime + 0.1);

        // Sustain (held at 0.5)
        noteGain.gain.setValueAtTime(0.5, currentTime + duration - 0.1);

        // Release: Fade out
        noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

        // Connect nodes
        oscillator.connect(noteGain);
        noteGain.connect(this.masterGain);

        // Start and stop
        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration);

        // Clean up after note ends
        oscillator.onended = () => {
            oscillator.disconnect();
            noteGain.disconnect();
        };

        return oscillator;
    }

    // For teaching mode - play with slight variation for emphasis
    playNoteEmphasis(frequency, duration = 0.6) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const currentTime = this.audioContext.currentTime;

        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, currentTime);

        // Stronger attack for emphasis
        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(1.0, currentTime + 0.03);
        noteGain.gain.linearRampToValueAtTime(0.6, currentTime + 0.15);
        noteGain.gain.setValueAtTime(0.6, currentTime + duration - 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);

        oscillator.connect(noteGain);
        noteGain.connect(this.masterGain);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + duration);

        oscillator.onended = () => {
            oscillator.disconnect();
            noteGain.disconnect();
        };

        return oscillator;
    }

    destroy() {
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}
