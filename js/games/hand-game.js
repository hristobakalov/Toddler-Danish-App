import { danishFingers } from '../data/hand-data.js';
import { AnimationManager } from '../utils/animations.js';

export class HandGame {
    constructor(freePlayContainerId, quizContainerId) {
        this.freePlayContainer = document.getElementById(freePlayContainerId);
        this.quizContainer = document.getElementById(quizContainerId);
        this.audioElement = null;

        this.currentFingerQuestion = null;
        this.isGameActive = false;
    }

    init() {
        this.renderFreePlay();
        this.setupGameControls();
    }

    renderFreePlay() {
        const handContainer = this.freePlayContainer.querySelector('.hand-container');
        if (!handContainer) return;

        handContainer.innerHTML = '';

        // Create hand image container
        const handImageWrapper = document.createElement('div');
        handImageWrapper.className = 'hand-image-wrapper';

        const handImage = document.createElement('img');
        handImage.src = 'img/hand.png';
        handImage.alt = 'Hand';
        handImage.className = 'hand-image';

        handImageWrapper.appendChild(handImage);

        // Create clickable hotspots for each finger
        danishFingers.forEach((finger, index) => {
            const hotspot = this.createFingerHotspot(finger, index);
            handImageWrapper.appendChild(hotspot);
        });

        handContainer.appendChild(handImageWrapper);
    }

    createFingerHotspot(finger, index) {
        const hotspot = document.createElement('button');
        hotspot.className = 'finger-hotspot';
        hotspot.dataset.fingerId = finger.id;
        hotspot.dataset.index = index;
        hotspot.setAttribute('aria-label', finger.name);

        // Position the hotspot
        hotspot.style.left = `${finger.position.x}%`;
        hotspot.style.top = `${finger.position.y}%`;

        // Add visual indicator
        const indicator = document.createElement('span');
        indicator.className = 'hotspot-indicator';
        indicator.textContent = finger.emoji;
        hotspot.appendChild(indicator);

        // Click handler for free play
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleFingerClick(hotspot, finger);
        });

        return hotspot;
    }

    handleFingerClick(element, finger) {
        // Animate the hotspot
        element.classList.add('clicked');
        setTimeout(() => element.classList.remove('clicked'), 300);

        // Play the finger audio
        this.playAudio(finger.audio);

        // Show feedback
        AnimationManager.showFeedback(finger.emoji, '#4CAF50');
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
        const startBtn = document.getElementById('startHandGameBtn');
        const exitBtn = document.getElementById('exitHandGameBtn');

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
        document.getElementById('handFreePlay').style.display = 'none';
        document.getElementById('handQuizMode').style.display = 'block';

        // Start countdown
        this.startCountdown();
    }

    exitGame() {
        this.isGameActive = false;

        // Show free play mode
        document.getElementById('handFreePlay').style.display = 'block';
        document.getElementById('handQuizMode').style.display = 'none';
        document.getElementById('handQuizInterface').style.display = 'none';
    }

    startCountdown() {
        const countdown = document.getElementById('handCountdown');
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
        document.getElementById('handQuizInterface').style.display = 'block';

        // Pick a random finger as the correct answer
        this.currentFingerQuestion = danishFingers[Math.floor(Math.random() * danishFingers.length)];

        // Display the finger name
        const fingerNameEl = document.getElementById('quizFingerName');
        fingerNameEl.textContent = this.currentFingerQuestion.name;

        // Setup repeat button
        this.setupRepeatButton();

        // Play the finger audio
        setTimeout(() => {
            this.playAudio(this.currentFingerQuestion.audio);
        }, 300);

        // Display the hand with clickable fingers
        this.displayQuizHand();
    }

    setupRepeatButton() {
        const repeatBtn = document.getElementById('repeatFingerBtn');

        // Remove old listener to avoid duplicates
        const newBtn = repeatBtn.cloneNode(true);
        repeatBtn.parentNode.replaceChild(newBtn, repeatBtn);

        // Add click listener
        newBtn.addEventListener('click', () => {
            this.playAudio(this.currentFingerQuestion.audio);

            // Visual feedback
            newBtn.style.animation = 'none';
            setTimeout(() => {
                newBtn.style.animation = 'soundPulse 0.3s ease';
            }, 10);
        });
    }

    displayQuizHand() {
        const container = document.getElementById('handQuizOptions');
        container.innerHTML = '';

        // Create hand image wrapper for quiz
        const handImageWrapper = document.createElement('div');
        handImageWrapper.className = 'hand-image-wrapper quiz-hand';

        const handImage = document.createElement('img');
        handImage.src = 'img/hand.png';
        handImage.alt = 'Hand';
        handImage.className = 'hand-image';

        handImageWrapper.appendChild(handImage);

        // Create clickable hotspots for each finger
        danishFingers.forEach((finger, index) => {
            const hotspot = this.createQuizFingerHotspot(finger, index);
            handImageWrapper.appendChild(hotspot);
        });

        container.appendChild(handImageWrapper);
    }

    createQuizFingerHotspot(finger, index) {
        const hotspot = document.createElement('button');
        hotspot.className = 'finger-hotspot quiz-finger';
        hotspot.dataset.fingerId = finger.id;
        hotspot.dataset.index = index;
        hotspot.setAttribute('aria-label', finger.name);

        // Position the hotspot
        hotspot.style.left = `${finger.position.x}%`;
        hotspot.style.top = `${finger.position.y}%`;

        // Add visual indicator
        const indicator = document.createElement('span');
        indicator.className = 'hotspot-indicator';
        indicator.textContent = finger.emoji;
        hotspot.appendChild(indicator);

        // Click handler for quiz
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleFingerSelection(hotspot, finger);
        });

        return hotspot;
    }

    handleFingerSelection(element, selectedFinger) {
        // Prevent multiple clicks
        const allHotspots = document.querySelectorAll('.quiz-finger');
        allHotspots.forEach(hotspot => hotspot.style.pointerEvents = 'none');

        if (selectedFinger.id === this.currentFingerQuestion.id) {
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
                if (hotspot.dataset.fingerId === this.currentFingerQuestion.id) {
                    setTimeout(() => {
                        hotspot.classList.add('correct');
                    }, 300);
                }
            });

            AnimationManager.showFeedback('👎', '#f44336');

            // Play the correct finger audio again
            setTimeout(() => {
                this.playAudio(this.currentFingerQuestion.audio);
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
        const handContainer = this.freePlayContainer?.querySelector('.hand-container');
        if (handContainer) {
            handContainer.innerHTML = '';
        }
    }
}
