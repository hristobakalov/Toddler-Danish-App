import { danishAlphabet } from '../data/alphabet-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class AlphabetGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speechManager = new SpeechManager();
        this.clickedCards = new Set();
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        danishAlphabet.forEach((item, index) => {
            const card = this.createLetterCard(item, index);
            this.container.appendChild(card);
        });
    }

    createLetterCard(item, index) {
        const card = document.createElement('div');
        card.className = 'letter-card';
        card.dataset.index = index;

        // Letter display
        const letterDisplay = document.createElement('div');
        letterDisplay.className = 'letter-display';
        letterDisplay.innerHTML = `<h2>${item.letter}</h2>`;

        // Words section (hidden initially)
        const wordsSection = document.createElement('div');
        wordsSection.className = 'words-section';

        item.words.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';

            // Create emoji element
            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'word-emoji';
            emojiSpan.textContent = word.emoji;

            // Create text element
            const text = document.createElement('h3');
            text.textContent = word.text;

            wordItem.appendChild(emojiSpan);
            wordItem.appendChild(text);

            wordItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.speechManager.speak(word.text);
                AnimationManager.animateCard(wordItem, 'spin');
            });
            wordsSection.appendChild(wordItem);
        });

        card.appendChild(letterDisplay);
        card.appendChild(wordsSection);

        // Card click handler
        card.addEventListener('click', () => this.handleCardClick(card, item, wordsSection));

        return card;
    }

    handleCardClick(card, item, wordsSection) {
        const cardIndex = card.dataset.index;

        // Animate the card
        AnimationManager.animateCard(card, 'spin');

        // First click: pronounce letter
        if (!this.clickedCards.has(cardIndex)) {
            this.speechManager.speak(item.letter, true);
            this.clickedCards.add(cardIndex);

            // Show words after pronunciation
            setTimeout(() => {
                wordsSection.classList.add('show');
            }, 600);
        } else {
            // Subsequent clicks: just pronounce letter
            this.speechManager.speak(item.letter, true);
        }
    }

    destroy() {
        this.container.innerHTML = '';
        this.clickedCards.clear();
    }
}
