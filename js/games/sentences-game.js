import { danishSentences } from '../data/sentences-data.js';

export class SentencesGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentIndex = 0;
        this.isSpeaking = false;
        this.audioElement = null;
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        const sentenceCard = this.createSentenceCard(danishSentences[this.currentIndex]);
        this.container.appendChild(sentenceCard);

        // Add navigation buttons if there are multiple sentences
        if (danishSentences.length > 1) {
            const navigation = this.createNavigation();
            this.container.appendChild(navigation);
        }
    }

    createSentenceCard(sentenceData) {
        const card = document.createElement('div');
        card.className = 'sentence-card';

        // GIF container
        const gifContainer = document.createElement('div');
        gifContainer.className = 'sentence-gif-container';

        const gif = document.createElement('img');
        gif.src = sentenceData.gif;
        gif.alt = sentenceData.sentence;
        gif.className = 'sentence-gif';
        gifContainer.appendChild(gif);

        // Sentence display
        const sentenceDisplay = document.createElement('div');
        sentenceDisplay.className = 'sentence-display';

        // Create word spans for highlighting
        const wordsContainer = document.createElement('div');
        wordsContainer.className = 'sentence-words';
        wordsContainer.id = 'sentenceWords';

        sentenceData.words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'sentence-word';
            wordSpan.dataset.index = index;
            wordSpan.textContent = word;
            wordsContainer.appendChild(wordSpan);

            // Add space after word (except last word)
            if (index < sentenceData.words.length - 1) {
                const space = document.createTextNode(' ');
                wordsContainer.appendChild(space);
            }
        });

        sentenceDisplay.appendChild(wordsContainer);

        // Speak button
        const speakButton = document.createElement('button');
        speakButton.className = 'sentence-speak-btn';
        speakButton.innerHTML = '🔊 Lyt til sætningen';
        speakButton.addEventListener('click', () => this.speakSentence(sentenceData));

        card.appendChild(gifContainer);
        card.appendChild(sentenceDisplay);
        card.appendChild(speakButton);

        return card;
    }

    async speakSentence(sentenceData) {
        if (this.isSpeaking) return;

        this.isSpeaking = true;
        const wordElements = document.querySelectorAll('.sentence-word');

        // Reset all highlights
        wordElements.forEach(el => el.classList.remove('highlight'));

        // Stop any existing audio
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        // Create and play audio
        this.audioElement = new Audio(sentenceData.audio);

        // Get audio duration and calculate timing for each word
        this.audioElement.addEventListener('loadedmetadata', () => {
            const duration = this.audioElement.duration;
            const timePerWord = duration / sentenceData.words.length;

            // Highlight first word immediately
            wordElements[0].classList.add('highlight');
            let currentWordIndex = 1;

            // Highlight remaining words as audio plays (start earlier with 0.85 multiplier)
            const highlightInterval = setInterval(() => {
                if (currentWordIndex < sentenceData.words.length) {
                    // Remove previous highlight
                    wordElements.forEach(el => el.classList.remove('highlight'));

                    // Add current highlight
                    wordElements[currentWordIndex].classList.add('highlight');
                    currentWordIndex++;
                } else {
                    clearInterval(highlightInterval);
                }
            }, timePerWord * 1000 * 0.95); // Highlight 15% earlier

            // Clean up when audio ends
            this.audioElement.onended = () => {
                clearInterval(highlightInterval);
                wordElements.forEach(el => el.classList.remove('highlight'));
                this.isSpeaking = false;
            };
        });

        this.audioElement.play();
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'sentence-navigation';

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'sentence-nav-btn';
        prevBtn.innerHTML = '⬅️ Forrige';
        prevBtn.disabled = this.currentIndex === 0;
        prevBtn.addEventListener('click', () => this.previous());

        // Current indicator
        const indicator = document.createElement('div');
        indicator.className = 'sentence-indicator';
        indicator.textContent = `${this.currentIndex + 1} / ${danishSentences.length}`;

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'sentence-nav-btn';
        nextBtn.innerHTML = 'Næste ➡️';
        nextBtn.disabled = this.currentIndex === danishSentences.length - 1;
        nextBtn.addEventListener('click', () => this.next());

        nav.appendChild(prevBtn);
        nav.appendChild(indicator);
        nav.appendChild(nextBtn);

        return nav;
    }

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.render();
        }
    }

    next() {
        if (this.currentIndex < danishSentences.length - 1) {
            this.currentIndex++;
            this.render();
        }
    }

    destroy() {
        this.container.innerHTML = '';
        this.currentIndex = 0;
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
    }
}
