import { danishNumbers } from '../data/numbers-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class NumbersGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);
        this.speechManager = new SpeechManager();

        this.currentNumberQuestion = null;
        this.isGameActive = false;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const grid = this.freePlayContainer.querySelector('.numbers-grid');
        grid.innerHTML = '';

        danishNumbers.forEach((item, index) => {
            const card = this.createNumberCard(item, index);
            grid.appendChild(card);
        });
    }

    createNumberCard(item, index) {
        const card = document.createElement('div');
        card.className = 'number-card';
        card.dataset.index = index;

        // Number display box
        const numberDisplay = document.createElement('div');
        numberDisplay.className = 'number-display';

        // Add emoji to number display
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'number-emoji';
        emojiSpan.textContent = item.emoji;
        numberDisplay.appendChild(emojiSpan);

        // Number name
        const numberName = document.createElement('h2');
        numberName.className = 'number-name';
        numberName.textContent = item.name;

        card.appendChild(numberDisplay);
        card.appendChild(numberName);

        // Card click handler
        card.addEventListener('click', () => {
            AnimationManager.animateCard(card, 'spin');
            this.speechManager.speak(item.name);
        });

        return card;
    }

    setupGameControls() {
        const startBtn = document.getElementById('startNumberGameBtn');
        const exitBtn = document.getElementById('exitNumberGameBtn');

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
        document.getElementById('numbersFreePlay').style.display = 'none';
        document.getElementById('numbersQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Show free play mode
        document.getElementById('numbersFreePlay').style.display = 'block';
        document.getElementById('numbersQuizMode').style.display = 'none';
        document.getElementById('numbersQuizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('numbersCountdown');
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
        document.getElementById('numbersQuizInterface').style.display = 'block';

        // Pick a random number as the correct answer
        this.currentNumberQuestion = danishNumbers[Math.floor(Math.random() * danishNumbers.length)];

        // Display the number name
        const numberNameEl = document.getElementById('quizNumberName');
        numberNameEl.textContent = this.currentNumberQuestion.name;

        // Setup repeat button
        this.setupRepeatButton();

        // Speak the number name
        setTimeout(() => {
            this.speechManager.speak(this.currentNumberQuestion.name);
        }, 300);

        // Generate 4 options (including correct answer)
        const options = this.generateNumberOptions(this.currentNumberQuestion);

        // Display options
        this.displayNumberOptions(options);
    }

    setupRepeatButton() {
        const repeatBtn = document.getElementById('repeatNumberBtn');

        // Remove old listener to avoid duplicates
        const newBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newBtn, repeatBtn);

        // Add click listener
        newBtn.addEventListener('click', () => {
            this.speechManager.speak(this.currentNumberQuestion.name);

            // Visual feedback
            newBtn.style.animation = 'none';
            setTimeout(() => {
                newBtn.style.animation = 'soundPulse 0.3s ease';
            }, 10);
        });
    }

    generateNumberOptions(correctNumber) {
        const options = [correctNumber];

        // Add 3 random different numbers
        while (options.length < 4) {
            const randomNumber = danishNumbers[Math.floor(Math.random() * danishNumbers.length)];
            if (!options.includes(randomNumber)) {
                options.push(randomNumber);
            }
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    displayNumberOptions(options) {
        const container = document.getElementById('numbersQuizOptions');
        container.innerHTML = '';

        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option number-quiz-option';

            // Add emoji
            const emoji = document.createElement('span');
            emoji.textContent = option.emoji;
            emoji.style.fontSize = '5rem';
            optionDiv.appendChild(emoji);

            // Click handler
            optionDiv.addEventListener('click', () => this.handleNumberSelection(optionDiv, option));

            container.appendChild(optionDiv);
        });
    }

    handleNumberSelection(element, selectedNumber) {
        // Prevent multiple clicks
        const allOptions = document.querySelectorAll('.number-quiz-option');
        allOptions.forEach(opt => opt.style.pointerEvents = 'none');

        if (selectedNumber.number === this.currentNumberQuestion.number) {
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
                const optEmoji = opt.textContent.trim();
                if (optEmoji === this.currentNumberQuestion.emoji) {
                    setTimeout(() => {
                        opt.classList.add('correct');
                    }, 300);
                }
            });

            AnimationManager.showFeedback('👎', '#f44336');

            // Say the correct number again
            setTimeout(() => {
                this.speechManager.speak(this.currentNumberQuestion.name);
            }, 800);

            // Wait then start new round
            setTimeout(() => {
                if (this.isGameActive) {
                    this.startQuizRound();
                }
            }, 3000);
        }
    }

    destroy() {
        this.isGameActive = false;
        this.freePlayContainer.querySelector('.numbers-grid').innerHTML = '';
    }
}
