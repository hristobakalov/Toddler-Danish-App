import { temperatureConfig } from '../data/temperature-data.js';

export class TemperatureGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentTemp = temperatureConfig.defaultTemp;
        this.currentLevel = null;
        this.audioElement = null;
        this.isDragging = false;
        this.thermometerTube = null;
    }

    init() {
        this.setupControls();
        this.updateThermometer(false); // Initial render without sound
    }

    setupControls() {
        this.thermometerTube = document.querySelector('.thermometer-tube');

        if (this.thermometerTube) {
            // Mouse events
            this.thermometerTube.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', (e) => this.onDrag(e));
            document.addEventListener('mouseup', () => this.endDrag());

            // Touch events
            this.thermometerTube.addEventListener('touchstart', (e) => this.startDrag(e), { passive: false });
            document.addEventListener('touchmove', (e) => this.onDrag(e), { passive: false });
            document.addEventListener('touchend', () => this.endDrag());
        }
    }

    startDrag(e) {
        this.isDragging = true;
        this.updateTemperatureFromEvent(e);
    }

    onDrag(e) {
        if (!this.isDragging) return;
        this.updateTemperatureFromEvent(e);
    }

    endDrag() {
        this.isDragging = false;
    }

    updateTemperatureFromEvent(e) {
        e.preventDefault();

        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const rect = this.thermometerTube.getBoundingClientRect();

        // Calculate position relative to thermometer (0 at top, 1 at bottom)
        const relativeY = (clientY - rect.top) / rect.height;
        const clampedY = Math.max(0, Math.min(1, relativeY));

        // Invert Y (top = hot, bottom = cold) and convert to temperature
        const tempRange = temperatureConfig.maxTemp - temperatureConfig.minTemp;
        const newTemp = Math.round(temperatureConfig.maxTemp - (clampedY * tempRange));

        if (newTemp !== this.currentTemp) {
            this.currentTemp = newTemp;
            this.updateThermometer(true);
        }
    }

    updateThermometer(playSound = true) {
        const level = temperatureConfig.getLevel(this.currentTemp);
        const mercuryHeight = temperatureConfig.getMercuryHeight(this.currentTemp);

        // Update temperature display
        const tempDisplay = document.getElementById('tempDisplay');
        if (tempDisplay) {
            tempDisplay.textContent = `${this.currentTemp}°C`;
        }

        // Update mercury column
        const mercury = document.querySelector('.thermometer-mercury');
        if (mercury) {
            mercury.style.height = `${mercuryHeight}%`;
            mercury.style.background = this.getMercuryGradient(level.color);
        }

        // Update bulb color
        const bulb = document.querySelector('.thermometer-bulb-inner');
        if (bulb) {
            bulb.style.background = level.color;
            bulb.style.boxShadow = `0 0 20px ${level.color}`;
        }

        // Update level display
        const levelLabel = document.getElementById('tempLevelLabel');
        const levelEmoji = document.getElementById('tempLevelEmoji');

        if (levelLabel) {
            levelLabel.textContent = level.label;
            levelLabel.style.color = level.color;
        }

        if (levelEmoji) {
            levelEmoji.textContent = level.emoji;
        }

        // Update background color
        const gameScreen = document.getElementById('temperatureGame');
        if (gameScreen) {
            gameScreen.style.background = `linear-gradient(135deg, ${level.bgColor} 0%, #ffffff 100%)`;
        }

        // Play audio if level changed and sound enabled
        if (playSound && (!this.currentLevel || this.currentLevel.id !== level.id)) {
            this.playLevelSound(level);
        }

        this.currentLevel = level;

        // Add pulse animation to thermometer
        this.animateThermometer();
    }

    getMercuryGradient(color) {
        // Create gradient from lighter to darker
        return `linear-gradient(to top, ${color} 0%, ${color}dd 100%)`;
    }

    playLevelSound(level) {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        this.audioElement = new Audio(level.audio);
        this.audioElement.play().catch(err => console.log('Audio play failed:', err));
    }

    animateThermometer() {
        this.isAnimating = true;

        const thermometer = document.querySelector('.thermometer');
        if (thermometer) {
            thermometer.classList.remove('pulse');
            // Force reflow
            void thermometer.offsetWidth;
            thermometer.classList.add('pulse');
        }

        setTimeout(() => {
            this.isAnimating = false;
            if (thermometer) {
                thermometer.classList.remove('pulse');
            }
        }, 300);
    }

    destroy() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
    }
}
