import { danishLetters, tracingColors } from '../data/letter-tracing-data.js';
import { SpeechManager } from '../utils/speech.js';

export class LetterTracingGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speechManager = new SpeechManager();
        this.currentLetter = null;
        this.selectedColor = tracingColors[0].color;
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.totalPixels = 0;
        this.coloredPixels = 0;
        this.hasPlayedSuccess = false;
        this.audioElement = null;
    }

    init() {
        this.render();
        this.selectRandomLetter();
    }

    render() {
        this.container.innerHTML = `
            <div class="letter-tracing-wrapper">
                <div class="tracing-canvas-container">
                    <canvas id="letterTracingCanvas" class="tracing-canvas"></canvas>
                </div>

                <div class="color-picker">
                    ${tracingColors.map((colorObj, index) => `
                        <button class="color-btn ${index === 0 ? 'active' : ''}"
                                data-color="${colorObj.color}"
                                style="background-color: ${colorObj.color};"
                                aria-label="${colorObj.name}">
                        </button>
                    `).join('')}
                </div>

                <button class="next-letter-btn">
                    <span class="btn-icon">➡️</span>
                    <span class="btn-text">Næste Bogstav</span>
                </button>
            </div>
        `;

        this.setupCanvas();
        this.attachEventListeners();
    }

    setupCanvas() {
        this.canvas = document.getElementById('letterTracingCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size - width responsive, height fixed at 350px
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth - 40;

        this.canvas.width = Math.min(containerWidth, 500);
        this.canvas.height = 350;

        // Enable smooth drawing
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    attachEventListeners() {
        // Color picker
        const colorButtons = this.container.querySelectorAll('.color-btn');
        colorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                colorButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedColor = btn.dataset.color;
            });
        });

        // Next letter button
        const nextBtn = this.container.querySelector('.next-letter-btn');
        nextBtn.addEventListener('click', () => {
            this.selectRandomLetter();
        });

        // Canvas drawing events
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.startDrawing(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.draw(e), { passive: false });
        this.canvas.addEventListener('touchend', () => this.stopDrawing());
        this.canvas.addEventListener('touchcancel', () => this.stopDrawing());

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
    }

    selectRandomLetter() {
        this.currentLetter = danishLetters[Math.floor(Math.random() * danishLetters.length)];
        this.hasPlayedSuccess = false;
        this.coloredPixels = 0;
        this.drawLetterOutline();
        this.speechManager.speak(this.currentLetter, true);
    }

    drawLetterOutline() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw white background for the letter
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the letter with black border and white fill
        // Use the smaller dimension to calculate font size for better fit
        const minDimension = Math.min(this.canvas.width, this.canvas.height);
        const fontSize = minDimension * 0.85;
        this.ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const x = this.canvas.width / 2;
        const y = this.canvas.height / 2;

        // Draw white fill
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(this.currentLetter, x, y);

        // Draw black stroke/border
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 8;
        this.ctx.strokeText(this.currentLetter, x, y);

        // Calculate total pixels inside the letter for progress tracking
        this.calculateTotalPixels();
    }

    calculateTotalPixels() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        let whitePixels = 0;

        // Store the initial state to track which pixels are part of the letter
        this.letterPixels = new Set();

        // Count white pixels (inside the letter) and store their positions
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel is white (inside letter area)
            if (r > 240 && g > 240 && b > 240) {
                whitePixels++;
                this.letterPixels.add(i);
            }
        }

        this.totalPixels = whitePixels;
    }

    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        if (e.touches && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        } else {
            return {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY
            };
        }
    }

    startDrawing(e) {
        e.preventDefault();
        this.isDrawing = true;
        const coords = this.getCoordinates(e);

        // Check if we're clicking/tapping on a white area (inside the letter)
        const imageData = this.ctx.getImageData(coords.x, coords.y, 1, 1);
        const data = imageData.data;
        const isWhite = data[0] > 240 && data[1] > 240 && data[2] > 240;

        // Draw a dot on single click/tap
        if (isWhite) {
            this.ctx.fillStyle = this.selectedColor;
            this.ctx.beginPath();
            this.ctx.arc(coords.x, coords.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.updateProgress();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }

    draw(e) {
        if (!this.isDrawing) return;
        e.preventDefault();

        const coords = this.getCoordinates(e);

        // Check if we're drawing on a white area (inside the letter)
        const imageData = this.ctx.getImageData(coords.x, coords.y, 1, 1);
        const data = imageData.data;
        const isWhite = data[0] > 240 && data[1] > 240 && data[2] > 240;

        if (isWhite) {
            this.ctx.strokeStyle = this.selectedColor;
            this.ctx.lineWidth = 20;
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(coords.x, coords.y);

            // Update colored pixels count
            this.updateProgress();
        }
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    updateProgress() {
        // Check progress every few strokes to avoid performance issues
        if (Math.random() > 0.95) { // Check 5% of the time
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;
            let coloredCount = 0;

            // Only check pixels that were originally part of the letter (white pixels)
            for (const pixelIndex of this.letterPixels) {
                const r = data[pixelIndex];
                const g = data[pixelIndex + 1];
                const b = data[pixelIndex + 2];

                // Check if this letter pixel is now colored (not white anymore)
                if (!(r > 240 && g > 240 && b > 240)) {
                    coloredCount++;
                }
            }

            this.coloredPixels = coloredCount;
            const progress = (this.coloredPixels / this.totalPixels) * 100;

            // If 90% or more is colored, play success sound
            if (progress >= 90 && !this.hasPlayedSuccess) {
                this.hasPlayedSuccess = true;
                this.playSuccessSound();
                this.showSuccessAnimation();
            }
        }
    }

    playSuccessSound() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.audioElement = new Audio('records/goodjob.mp3');
        this.audioElement.play().catch(err => console.log('Audio play failed:', err));
    }

    showSuccessAnimation() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <div class="success-emoji">🌟</div>
                <div class="success-text">Godt Klaret!</div>
            </div>
        `;
        this.container.appendChild(overlay);

        // Remove overlay after animation
        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }

    destroy() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
