import { danishFoods } from '../data/food-data.js';
import { AnimationManager } from '../utils/animations.js';

export class FoodGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);
        this.audioElement = null;

        this.currentFoodQuestion = null;
        this.isGameActive = false;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const foodsGrid = this.freePlayContainer.querySelector('.foods-grid');
        if (!foodsGrid) return;

        foodsGrid.innerHTML = '';

        danishFoods.forEach((food, index) => {
            const card = this.createFoodCard(food, index);
            foodsGrid.appendChild(card);
        });
    }

    createFoodCard(food, index) {
        const card = document.createElement('div');
        card.className = 'food-card';
        card.dataset.foodId = food.id;
        card.dataset.index = index;

        // Food emoji
        const emojiDisplay = document.createElement('div');
        emojiDisplay.className = 'food-emoji';
        emojiDisplay.textContent = food.emoji;

        // Food name
        const foodName = document.createElement('h3');
        foodName.className = 'food-name';
        foodName.textContent = food.name;

        card.appendChild(emojiDisplay);
        card.appendChild(foodName);

        // Card click handler
        card.addEventListener('click', () => {
            this.handleFoodClick(card, food);
        });

        return card;
    }

    handleFoodClick(element, food) {
        // Animate the card
        AnimationManager.animateCard(element, 'spin');

        // Play the food audio
        this.playAudio(food.audio);

        // Show feedback
        AnimationManager.showFeedback(food.emoji, '#4CAF50');
    }

    playAudio(audioPath) {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.audioElement = new Audio(audioPath);
        this.audioElement.play().catch(err => console.log('Audio play failed:', err));
    }

    setupGameControls() {
        const startBtn = document.getElementById('startFoodGameBtn');
        const exitBtn = document.getElementById('exitFoodGameBtn');

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
        document.getElementById('foodFreePlay').style.display = 'none';
        document.getElementById('foodQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Show free play mode
        document.getElementById('foodFreePlay').style.display = 'block';
        document.getElementById('foodQuizMode').style.display = 'none';
        document.getElementById('foodQuizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('foodCountdown');
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
        document.getElementById('foodQuizInterface').style.display = 'block';

        // Pick a random food item as the correct answer
        this.currentFoodQuestion = danishFoods[Math.floor(Math.random() * danishFoods.length)];

        // Display the food name
        const foodNameEl = document.getElementById('quizFoodName');
        foodNameEl.textContent = this.currentFoodQuestion.name;

        // Setup repeat button
        this.setupRepeatButton();

        // Play the food audio
        setTimeout(() => {
            this.playAudio(this.currentFoodQuestion.audio);
        }, 300);

        // Generate 4 options (including correct answer)
        const options = this.generateFoodOptions(this.currentFoodQuestion);

        // Display options
        this.displayFoodOptions(options);
    }

    setupRepeatButton() {
        const repeatBtn = document.getElementById('repeatFoodBtn');

        // Remove old listener to avoid duplicates
        const newBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newBtn, repeatBtn);

        // Add click listener
        newBtn.addEventListener('click', () => {
            this.playAudio(this.currentFoodQuestion.audio);

            // Visual feedback
            newBtn.style.animation = 'none';
            setTimeout(() => {
                newBtn.style.animation = 'soundPulse 0.3s ease';
            }, 10);
        });
    }

    generateFoodOptions(correctFood) {
        const options = [correctFood];

        // Add 3 random different foods
        while (options.length < 4) {
            const randomFood = danishFoods[Math.floor(Math.random() * danishFoods.length)];
            if (!options.includes(randomFood)) {
                options.push(randomFood);
            }
        }

        // Shuffle options
        return options.sort(() => Math.random() - 0.5);
    }

    displayFoodOptions(options) {
        const container = document.getElementById('foodQuizOptions');
        container.innerHTML = '';

        options.forEach(food => {
            const optionCard = document.createElement('div');
            optionCard.className = 'food-quiz-option';
            optionCard.dataset.foodId = food.id;

            // Food emoji
            const emoji = document.createElement('div');
            emoji.className = 'quiz-food-emoji';
            emoji.textContent = food.emoji;

            optionCard.appendChild(emoji);

            // Click handler
            optionCard.addEventListener('click', () => this.handleFoodSelection(optionCard, food));

            container.appendChild(optionCard);
        });
    }

    handleFoodSelection(element, selectedFood) {
        // Prevent multiple clicks
        const allOptions = document.querySelectorAll('.food-quiz-option');
        allOptions.forEach(opt => opt.style.pointerEvents = 'none');

        if (selectedFood.id === this.currentFoodQuestion.id) {
            // Correct answer
            element.classList.add('correct');
            AnimationManager.showFeedback('👍', '#4CAF50');

            // Play "Rigtigt" sound
            this.playAudio('records/rigtigt.mp3');

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
                if (opt.dataset.foodId === this.currentFoodQuestion.id) {
                    setTimeout(() => {
                        opt.classList.add('correct');
                    }, 300);
                }
            });

            AnimationManager.showFeedback('👎', '#f44336');

            // Play the correct food audio again
            setTimeout(() => {
                this.playAudio(this.currentFoodQuestion.audio);
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
        const foodsGrid = this.freePlayContainer?.querySelector('.foods-grid');
        if (foodsGrid) {
            foodsGrid.innerHTML = '';
        }
    }
}
