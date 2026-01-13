import { danishActions, actionsQuizAudio } from '../data/actions-data.js';
import { AnimationManager } from '../utils/animations.js';

export class ActionsGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);

        this.currentActionQuestion = null;
        this.isGameActive = false;
        this.audioElement = null;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const grid = this.freePlayContainer.querySelector('.actions-grid');
        grid.innerHTML = '';

        danishActions.forEach((item, index) => {
            const card = this.createActionCard(item, index);
            grid.appendChild(card);
        });
    }

    createActionCard(item, index) {
        const card = document.createElement('div');
        card.className = 'action-card';
        card.dataset.index = index;

        // Action display with GIF
        const actionDisplay = document.createElement('div');
        actionDisplay.className = 'action-display';

        const gif = document.createElement('img');
        gif.src = item.gif;
        gif.alt = item.name;
        gif.className = 'action-gif';

        // Add emoji overlay
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'action-emoji';
        emojiSpan.textContent = item.emoji;

        actionDisplay.appendChild(gif);
        actionDisplay.appendChild(emojiSpan);

        // Action sentence
        const actionSentence = document.createElement('h2');
        actionSentence.className = 'action-name';
        actionSentence.textContent = item.sentence;

        card.appendChild(actionDisplay);
        card.appendChild(actionSentence);

        // Card click handler
        card.addEventListener('click', () => {
            AnimationManager.animateCard(card, 'spin');
            this.playAudio(item.audio);
        });

        return card;
    }

    playAudio(audioPath) {
        // Stop any existing audio
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        this.audioElement = new Audio(audioPath);
        this.audioElement.play();
    }

    setupGameControls() {
        const startBtn = document.getElementById('startActionGameBtn');
        const exitBtn = document.getElementById('exitActionGameBtn');

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
        document.getElementById('actionsFreePlay').style.display = 'none';
        document.getElementById('actionsQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Stop any audio
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }

        // Show free play mode
        document.getElementById('actionsFreePlay').style.display = 'block';
        document.getElementById('actionsQuizMode').style.display = 'none';
        document.getElementById('actionsQuizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('actionsCountdown');
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

                // Speak the countdown (using text-to-speech for countdown only)
                const utterance = new SpeechSynthesisUtterance(sequence[index] === 'Go!' ? 'Go' : sequence[index]);
                utterance.lang = 'da-DK';
                utterance.rate = 0.84;
                window.speechSynthesis.speak(utterance);

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
        document.getElementById('actionsQuizInterface').style.display = 'block';

        // Pick a random action as the correct answer
        this.currentActionQuestion = danishActions[Math.floor(Math.random() * danishActions.length)];

        // Display the action GIF
        const quizGifEl = document.getElementById('quizActionGif');
        quizGifEl.src = this.currentActionQuestion.gif;
        quizGifEl.alt = this.currentActionQuestion.name;

        // Setup repeat button
        this.setupRepeatButton();

        // Play question audio "Hvad laver jeg?" then the action sentence
        setTimeout(() => {
            this.playQuestionSequence();
        }, 300);

        // Generate 4 options (including correct answer)
        const options = this.generateActionOptions(this.currentActionQuestion);

        // Display options
        this.displayActionOptions(options);
    }

    async playQuestionSequence() {
        // Play "Hvad laver jeg?" (What am I doing?)
        await this.playAudioPromise(actionsQuizAudio.question);

        // Wait a bit
        await this.wait(500);

        // Play the action sentence
        await this.playAudioPromise(this.currentActionQuestion.audio);
    }

    playAudioPromise(audioPath) {
        return new Promise((resolve) => {
            if (this.audioElement) {
                this.audioElement.pause();
            }

            this.audioElement = new Audio(audioPath);
            this.audioElement.onended = () => resolve();
            this.audioElement.onerror = () => resolve();
            this.audioElement.play();
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setupRepeatButton() {
        const repeatBtn = document.getElementById('repeatActionBtn');

        // Remove old listener to avoid duplicates
        const newBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newBtn, repeatBtn);

        // Add click listener
        newBtn.addEventListener('click', () => {
            this.playQuestionSequence();

            // Visual feedback
            newBtn.style.animation = 'none';
            setTimeout(() => {
                newBtn.style.animation = 'soundPulse 0.3s ease';
            }, 10);
        });
    }

    generateActionOptions(correctAction) {
        const options = [correctAction];

        // Add 3 random different actions
        while (options.length < 4) {
            const randomAction = danishActions[Math.floor(Math.random() * danishActions.length)];
            if (!options.includes(randomAction)) {
                options.push(randomAction);
            }
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    displayActionOptions(options) {
        const container = document.getElementById('actionsQuizOptions');
        container.innerHTML = '';

        options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option action-quiz-option';
            optionDiv.dataset.actionId = option.id;

            // Emoji
            const emoji = document.createElement('span');
            emoji.className = 'quiz-option-emoji';
            emoji.textContent = option.emoji;

            // Sentence
            const sentence = document.createElement('span');
            sentence.className = 'quiz-option-name';
            sentence.textContent = option.sentence;

            optionDiv.appendChild(emoji);
            optionDiv.appendChild(sentence);

            // Click handler
            optionDiv.addEventListener('click', () => {
                this.handleAnswer(option, optionDiv, options);
            });

            container.appendChild(optionDiv);
        });
    }

    async handleAnswer(selectedAction, selectedElement, allOptions) {
        const isCorrect = selectedAction.id === this.currentActionQuestion.id;

        // Disable all options
        const allOptionElements = document.querySelectorAll('.action-quiz-option');
        allOptionElements.forEach(el => {
            el.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            // Correct answer
            selectedElement.classList.add('correct');
            AnimationManager.animateCard(selectedElement, 'shake');

            // Show feedback
            this.showFeedback(true);

            // Play "Rigtigt!" audio
            await this.playAudioPromise(actionsQuizAudio.correct);

            // Wait before next round
            setTimeout(() => {
                this.startQuizRound();
            }, 2000);
        } else {
            // Wrong answer
            selectedElement.classList.add('wrong');

            // Highlight correct answer
            allOptionElements.forEach(el => {
                const actionId = el.dataset.actionId;
                if (actionId === this.currentActionQuestion.id) {
                    el.classList.add('correct');
                }
            });

            // Show feedback
            this.showFeedback(false);

            // Play correct action audio
            await this.playAudioPromise(this.currentActionQuestion.audio);

            // Wait before next round
            setTimeout(() => {
                this.startQuizRound();
            }, 3000);
        }
    }

    showFeedback(isCorrect) {
        const feedback = document.getElementById('actionsFeedback');
        const feedbackIcon = feedback.querySelector('.feedback-icon');

        feedbackIcon.textContent = isCorrect ? '👍' : '👎';
        feedback.style.display = 'flex';

        setTimeout(() => {
            feedback.style.display = 'none';
        }, isCorrect ? 1500 : 2500);
    }

    destroy() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        window.speechSynthesis.cancel();
    }
}
