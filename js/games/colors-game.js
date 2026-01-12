import { danishColors } from '../data/colors-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class ColorsGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);
        this.speechManager = new SpeechManager();

        this.currentColorQuestion = null;
        this.isGameActive = false;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const grid = this.freePlayContainer.querySelector('.colors-grid');
        grid.innerHTML = '';

        danishColors.forEach((item, index) => {
            const card = this.createColorCard(item, index);
            grid.appendChild(card);
        });
    }

    createColorCard(item, index) {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.dataset.index = index;

        // Color display box
        const colorDisplay = document.createElement('div');
        colorDisplay.className = 'color-display';
        colorDisplay.style.backgroundColor = item.color;

        // Add border for white color visibility
        if (item.name === 'Hvid') {
            colorDisplay.style.border = '3px solid #ddd';
        }

        // Add emoji to color display
        const emojiSpan = document.createElement('span');
        emojiSpan.textContent = item.emoji;
        colorDisplay.appendChild(emojiSpan);

        // Color name
        const colorName = document.createElement('h2');
        colorName.className = 'color-name';
        colorName.textContent = item.name;

        card.appendChild(colorDisplay);
        card.appendChild(colorName);

        // Card click handler
        card.addEventListener('click', () => {
            AnimationManager.animateCard(card, 'spin');
            this.speechManager.speak(item.name);
        });

        return card;
    }

    setupGameControls() {
        const startBtn = document.getElementById('startColorGameBtn');
        const exitBtn = document.getElementById('exitGameBtn');

        if (startBtn) {
            startBtn.addEventListener('click', () => this.startGame());
        }

        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitGame());
        }
    }

    startGame() {
        this.isGameActive = true;

        // Hide free play mode
        document.getElementById('colorsFreePlay').style.display = 'none';
        document.getElementById('colorsQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Show free play mode
        document.getElementById('colorsFreePlay').style.display = 'block';
        document.getElementById('colorsQuizMode').style.display = 'none';
        document.getElementById('quizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('countdown');
        const countdownNumber = countdown.querySelector('.countdown-number');

        countdown.style.display = 'flex';

        const sequence = ['3', '2', '1', 'Go!'];
        let index = 0;

        const showNext = () => {
            if (index < sequence.length) {
                countdownNumber.textContent = sequence[index];
                countdownNumber.style.animation = 'none';
                setTimeout(() => {
                    countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
                }, 10);

                // Speak the countdown
                if (sequence[index] === 'Go!') {
                    this.speechManager.speak('Go');
                } else {
                    this.speechManager.speak(sequence[index]);
                }

                index++;
                setTimeout(showNext, 1000);
            } else {
                countdown.style.display = 'none';
                this.startQuizRound();
            }
        };

        showNext();
    }

    startQuizRound() {
        document.getElementById('quizInterface').style.display = 'block';

        // Pick a random color as the correct answer
        this.currentColorQuestion = danishColors[Math.floor(Math.random() * danishColors.length)];

        // Display the color name
        const colorNameEl = document.getElementById('quizColorName');
        colorNameEl.textContent = this.currentColorQuestion.name;

        // Speak the color name
        setTimeout(() => {
            this.speechManager.speak(this.currentColorQuestion.name);
        }, 300);

        // Generate 4 options (including correct answer)
        const options = this.generateColorOptions(this.currentColorQuestion);

        // Display options
        this.displayColorOptions(options);
    }

    generateColorOptions(correctColor) {
        const options = [correctColor];

        // Add 3 random different colors
        while (options.length < 4) {
            const randomColor = danishColors[Math.floor(Math.random() * danishColors.length)];
            if (!options.includes(randomColor)) {
                options.push(randomColor);
            }
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    displayColorOptions(options) {
        const container = document.getElementById('quizOptions');
        container.innerHTML = '';

        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option';
            optionDiv.style.backgroundColor = option.color;

            // Add border for white color
            if (option.name === 'Hvid') {
                optionDiv.style.border = '6px solid #ddd';
            }

            // Add emoji
            const emoji = document.createElement('span');
            emoji.textContent = option.emoji;
            optionDiv.appendChild(emoji);

            // Click handler
            optionDiv.addEventListener('click', () => this.handleColorSelection(optionDiv, option));

            container.appendChild(optionDiv);
        });
    }

    handleColorSelection(element, selectedColor) {
        // Prevent multiple clicks
        const allOptions = document.querySelectorAll('.quiz-option');
        allOptions.forEach(opt => opt.style.pointerEvents = 'none');

        if (selectedColor.name === this.currentColorQuestion.name) {
            // Correct answer
            element.classList.add('correct');
            AnimationManager.showFeedback('👍', '#4CAF50');

            // Wait then start new round
            setTimeout(() => {
                if (this.isGameActive) {
                    this.startQuizRound();
                }
            }, 2000);
        } else {
            // Incorrect answer
            element.classList.add('incorrect');

            // Find and highlight correct answer
            allOptions.forEach(opt => {
                const optColor = opt.style.backgroundColor;
                if (this.rgbToHex(optColor) === this.currentColorQuestion.color.toUpperCase()) {
                    setTimeout(() => {
                        opt.classList.add('correct');
                    }, 300);
                }
            });

            AnimationManager.showFeedback('👎', '#f44336');

            // Say the correct color again
            setTimeout(() => {
                this.speechManager.speak(this.currentColorQuestion.name);
            }, 800);

            // Wait then start new round
            setTimeout(() => {
                if (this.isGameActive) {
                    this.startQuizRound();
                }
            }, 3000);
        }
    }

    rgbToHex(rgb) {
        const values = rgb.match(/\d+/g);
        if (!values) return rgb;

        const r = parseInt(values[0]).toString(16).padStart(2, '0');
        const g = parseInt(values[1]).toString(16).padStart(2, '0');
        const b = parseInt(values[2]).toString(16).padStart(2, '0');

        return `#${r}${g}${b}`.toUpperCase();
    }

    destroy() {
        this.isGameActive = false;
        this.freePlayContainer.querySelector('.colors-grid').innerHTML = '';
    }
}
