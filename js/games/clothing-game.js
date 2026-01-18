import { danishClothingItems, getBingoClothing, getBlueyClothing } from '../data/clothing-data.js';
import { AnimationManager } from '../utils/animations.js';

export class ClothingGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);
        this.audioElement = null;

        this.currentClothingQuestion = null;
        this.isGameActive = false;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const clothingContainer = this.freePlayContainer.querySelector('.clothing-characters-container');
        if (!clothingContainer) return;

        clothingContainer.innerHTML = '';

        // Create single image wrapper with both Bingo and Bluey
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'clothing-image-wrapper';

        const clothingImage = document.createElement('img');
        clothingImage.src = 'img/cloths.png';
        clothingImage.alt = 'Bingo and Bluey';
        clothingImage.className = 'clothing-image';

        imageWrapper.appendChild(clothingImage);

        // Create clickable hotspots for all clothing items
        danishClothingItems.forEach((item, index) => {
            const hotspot = this.createClothingHotspot(item, index);
            imageWrapper.appendChild(hotspot);
        });

        clothingContainer.appendChild(imageWrapper);
    }

    createClothingHotspot(item, index) {
        const hotspot = document.createElement('button');
        hotspot.className = 'clothing-hotspot';
        hotspot.dataset.clothingId = item.id;
        hotspot.dataset.index = index;
        hotspot.setAttribute('aria-label', item.name);

        // Position the hotspot
        hotspot.style.left = `${item.position.x}%`;
        hotspot.style.top = `${item.position.y}%`;

        // Add visual indicator
        const indicator = document.createElement('span');
        indicator.className = 'hotspot-indicator';
        indicator.textContent = item.emoji;
        hotspot.appendChild(indicator);

        // Click handler for free play
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClothingClick(hotspot, item);
        });

        return hotspot;
    }

    handleClothingClick(element, item) {
        // Animate the hotspot
        element.classList.add('clicked');
        setTimeout(() => element.classList.remove('clicked'), 300);

        // Play the clothing audio
        this.playAudio(item.audio);

        // Show feedback
        AnimationManager.showFeedback(item.emoji, '#4CAF50');
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
        const startBtn = document.getElementById('startClothingGameBtn');
        const exitBtn = document.getElementById('exitClothingGameBtn');

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
        document.getElementById('clothingFreePlay').style.display = 'none';
        document.getElementById('clothingQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Show free play mode
        document.getElementById('clothingFreePlay').style.display = 'block';
        document.getElementById('clothingQuizMode').style.display = 'none';
        document.getElementById('clothingQuizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('clothingCountdown');
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
        document.getElementById('clothingQuizInterface').style.display = 'block';

        // Pick a random clothing item as the correct answer
        this.currentClothingQuestion = danishClothingItems[Math.floor(Math.random() * danishClothingItems.length)];

        // Display the clothing name
        const clothingNameEl = document.getElementById('quizClothingName');
        clothingNameEl.textContent = this.currentClothingQuestion.name;

        // Setup repeat button
        this.setupRepeatButton();

        // Play the clothing audio
        setTimeout(() => {
            this.playAudio(this.currentClothingQuestion.audio);
        }, 300);

        // Display both characters with clickable clothing items
        this.displayQuizCharacters();
    }

    setupRepeatButton() {
        const repeatBtn = document.getElementById('repeatClothingBtn');

        // Remove old listener to avoid duplicates
        const newBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newBtn, repeatBtn);

        // Add click listener
        newBtn.addEventListener('click', () => {
            this.playAudio(this.currentClothingQuestion.audio);

            // Visual feedback
            newBtn.style.animation = 'none';
            setTimeout(() => {
                newBtn.style.animation = 'soundPulse 0.3s ease';
            }, 10);
        });
    }

    displayQuizCharacters() {
        const container = document.getElementById('clothingQuizOptions');
        container.innerHTML = '';

        // Create single image wrapper with both Bingo and Bluey for quiz
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'clothing-image-wrapper quiz-clothing-wrapper';

        const clothingImage = document.createElement('img');
        clothingImage.src = 'img/cloths.png';
        clothingImage.alt = 'Bingo and Bluey';
        clothingImage.className = 'clothing-image';

        imageWrapper.appendChild(clothingImage);

        // Create clickable hotspots for all clothing items
        danishClothingItems.forEach((item, index) => {
            const hotspot = this.createQuizClothingHotspot(item, index);
            imageWrapper.appendChild(hotspot);
        });

        container.appendChild(imageWrapper);
    }

    createQuizClothingHotspot(item, index) {
        const hotspot = document.createElement('button');
        hotspot.className = 'clothing-hotspot quiz-clothing';
        hotspot.dataset.clothingId = item.id;
        hotspot.dataset.index = index;
        hotspot.setAttribute('aria-label', item.name);

        // Position the hotspot
        hotspot.style.left = `${item.position.x}%`;
        hotspot.style.top = `${item.position.y}%`;

        // Add visual indicator
        const indicator = document.createElement('span');
        indicator.className = 'hotspot-indicator';
        indicator.textContent = item.emoji;
        hotspot.appendChild(indicator);

        // Click handler for quiz
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleClothingSelection(hotspot, item);
        });

        return hotspot;
    }

    handleClothingSelection(element, selectedItem) {
        // Prevent multiple clicks
        const allHotspots = document.querySelectorAll('.quiz-clothing');
        allHotspots.forEach(hotspot => hotspot.style.pointerEvents = 'none');

        if (selectedItem.id === this.currentClothingQuestion.id) {
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
            allHotspots.forEach(hotspot => {
                if (hotspot.dataset.clothingId === this.currentClothingQuestion.id) {
                    setTimeout(() => {
                        hotspot.classList.add('correct');
                    }, 300);
                }
            });

            AnimationManager.showFeedback('👎', '#f44336');

            // Play the correct clothing audio again
            setTimeout(() => {
                this.playAudio(this.currentClothingQuestion.audio);
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
        const clothingContainer = this.freePlayContainer?.querySelector('.clothing-characters-container');
        if (clothingContainer) {
            clothingContainer.innerHTML = '';
        }
    }
}
