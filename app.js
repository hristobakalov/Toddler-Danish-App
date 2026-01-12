// Danish alphabet data with words and emojis
const danishAlphabet = [
    { letter: 'A', words: [{ text: 'Abe', emoji: '🐵' }, { text: 'Avis', emoji: '📰' }] },
    { letter: 'B', words: [{ text: 'Bjørn', emoji: '🐻' }, { text: 'Brød', emoji: '🍞' }] },
    { letter: 'C', words: [{ text: 'Cikade', emoji: '🦗' }, { text: 'Cykel', emoji: '🚲' }] },
    { letter: 'D', words: [{ text: 'Delfin', emoji: '🐬' }, { text: 'Dør', emoji: '🚪' }] },
    { letter: 'E', words: [{ text: 'Egern', emoji: '🐿️' }, { text: 'Elev', emoji: '👨‍🎓' }] },
    { letter: 'F', words: [{ text: 'Fisk', emoji: '🐟' }, { text: 'Fod', emoji: '🦶' }] },
    { letter: 'G', words: [{ text: 'Giraf', emoji: '🦒' }, { text: 'Glas', emoji: '🥃' }] },
    { letter: 'H', words: [{ text: 'Hund', emoji: '🐕' }, { text: 'Hus', emoji: '🏠' }] },
    { letter: 'I', words: [{ text: 'Ildflue', emoji: '🪲' }, { text: 'Is', emoji: '🍦' }] },
    { letter: 'J', words: [{ text: 'Jaguar', emoji: '🐆' }, { text: 'Jakke', emoji: '🧥' }] },
    { letter: 'K', words: [{ text: 'Kat', emoji: '🐈' }, { text: 'Kaffe', emoji: '☕' }] },
    { letter: 'L', words: [{ text: 'Løve', emoji: '🦁' }, { text: 'Lampe', emoji: '💡' }] },
    { letter: 'M', words: [{ text: 'Mus', emoji: '🐭' }, { text: 'Mælk', emoji: '🥛' }] },
    { letter: 'N', words: [{ text: 'Næsehorn', emoji: '🦏' }, { text: 'Nøgle', emoji: '🔑' }] },
    { letter: 'O', words: [{ text: 'Ørn', emoji: '🦅' }, { text: 'Oste', emoji: '🧀' }] },
    { letter: 'P', words: [{ text: 'Pingvin', emoji: '🐧' }, { text: 'Penge', emoji: '💰' }] },
    { letter: 'Q', words: [{ text: 'Quokka', emoji: '🦘' }, { text: 'Quiz', emoji: '❓' }] },
    { letter: 'R', words: [{ text: 'Ræv', emoji: '🦊' }, { text: 'Regn', emoji: '🌧️' }] },
    { letter: 'S', words: [{ text: 'Slange', emoji: '🐍' }, { text: 'Sko', emoji: '👟' }] },
    { letter: 'T', words: [{ text: 'Tiger', emoji: '🐯' }, { text: 'Tog', emoji: '🚂' }] },
    { letter: 'U', words: [{ text: 'Ugle', emoji: '🦉' }, { text: 'Ur', emoji: '⏰' }] },
    { letter: 'V', words: [{ text: 'Vildsvin', emoji: '🐗' }, { text: 'Vand', emoji: '💧' }] },
    { letter: 'W', words: [{ text: 'Wombat', emoji: '🦫' }, { text: 'Weekend', emoji: '🏖️' }] },
    { letter: 'X', words: [{ text: 'Xerus', emoji: '🐿️' }, { text: 'Xylofon', emoji: '🎵' }] },
    { letter: 'Y', words: [{ text: 'Yak', emoji: '🐃' }, { text: 'Yoghurt', emoji: '🥣' }] },
    { letter: 'Z', words: [{ text: 'Zebra', emoji: '🦓' }, { text: 'Zone', emoji: '🗺️' }] },
    { letter: 'Æ', words: [{ text: 'Æsel', emoji: '🫏' }, { text: 'Æble', emoji: '🍎' }] },
    { letter: 'Ø', words: [{ text: 'Ørred', emoji: '🐟' }, { text: 'Øl', emoji: '🍺' }] },
    { letter: 'Å', words: [{ text: 'Ål', emoji: '🐍' }, { text: 'Åben', emoji: '🔓' }] }
];

// Danish colors data
const danishColors = [
    { name: 'Rød', color: '#FF0000', emoji: '❤️' },
    { name: 'Blå', color: '#0000FF', emoji: '💙' },
    { name: 'Gul', color: '#FFFF00', emoji: '💛' },
    { name: 'Grøn', color: '#00FF00', emoji: '💚' },
    { name: 'Orange', color: '#FF8800', emoji: '🧡' },
    { name: 'Lilla', color: '#800080', emoji: '💜' },
    { name: 'Pink', color: '#FFC0CB', emoji: '🩷' },
    { name: 'Brun', color: '#8B4513', emoji: '🤎' },
    { name: 'Sort', color: '#000000', emoji: '🖤' },
    { name: 'Hvid', color: '#FFFFFF', emoji: '🤍' },
    { name: 'Grå', color: '#808080', emoji: '🩶' },
    { name: 'Turkis', color: '#40E0D0', emoji: '💎' }
];

// Track which cards have been clicked
const clickedCards = new Set();

// Initialize the app
function init() {
    // Initialize alphabet game
    const alphabetGrid = document.getElementById('alphabetGrid');
    danishAlphabet.forEach((item, index) => {
        const card = createLetterCard(item, index);
        alphabetGrid.appendChild(card);
    });

    // Initialize colors game
    const colorsGrid = document.getElementById('colorsGrid');
    danishColors.forEach((item, index) => {
        const card = createColorCard(item, index);
        colorsGrid.appendChild(card);
    });

    // Setup navigation
    setupNavigation();
}

// Setup navigation between games
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const gameTitle = document.getElementById('gameTitle');
    const gameSubtitle = document.getElementById('gameSubtitle');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const gameName = item.dataset.game;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Hide all games
            document.querySelectorAll('.game-content').forEach(game => {
                game.classList.remove('active');
            });

            // Show selected game
            if (gameName === 'alphabet') {
                document.getElementById('alphabetGame').classList.add('active');
                gameTitle.textContent = '🔤 Alfabet';
                gameSubtitle.textContent = 'Tryk på kortet for at lære!';
            } else if (gameName === 'colors') {
                document.getElementById('colorsGame').classList.add('active');
                gameTitle.textContent = '🎨 Farver';
                gameSubtitle.textContent = 'Tryk på farven for at lære!';
            }
        });
    });
}

// Create a letter card
function createLetterCard(item, index) {
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
            speakText(word.text);
            animateCard(wordItem, 'spin');
        });
        wordsSection.appendChild(wordItem);
    });

    card.appendChild(letterDisplay);
    card.appendChild(wordsSection);

    // Card click handler
    card.addEventListener('click', () => handleCardClick(card, item, wordsSection));

    return card;
}

// Handle card click
function handleCardClick(card, item, wordsSection) {
    const cardIndex = card.dataset.index;

    // Animate the card
    animateCard(card, 'spin');

    // First click: pronounce letter
    if (!clickedCards.has(cardIndex)) {
        speakText(item.letter, true); // true indicates it's a letter
        clickedCards.add(cardIndex);

        // Show words after pronunciation
        setTimeout(() => {
            wordsSection.classList.add('show');
        }, 600);
    } else {
        // Subsequent clicks: just pronounce letter
        speakText(item.letter, true); // true indicates it's a letter
    }
}

// Animate card
function animateCard(element, animationClass) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, 600);
}

// Create a color card
function createColorCard(item, index) {
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
        animateCard(card, 'spin');
        speakText(item.name);
    });

    return card;
}

// Text-to-speech function
function speakText(text, isLetter = false) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // For single letters, we need to use SSML or phonetic approach
    // Danish letters pronunciation mapping
    const letterPronunciation = {
        'A': 'a',
        'B': 'be',
        'C': 'se',
        'D': 'de',
        'E': 'e',
        'F': 'æf',
        'G': 'ge',
        'H': 'hå',
        'I': 'i',
        'J': 'jåd',
        'K': 'kå',
        'L': 'æl',
        'M': 'æm',
        'N': 'æn',
        'O': 'o',
        'P': 'pe',
        'Q': 'ku',
        'R': 'ær',
        'S': 'æs',
        'T': 'te',
        'U': 'u',
        'V': 've',
        'W': 'dobbelt ve',
        'X': 'æks',
        'Y': 'y',
        'Z': 'sæt',
        'Æ': 'æ',
        'Ø': 'ø',
        'Å': 'å'
    };

    // If it's a single letter, use the pronunciation guide
    const textToSpeak = isLetter && letterPronunciation[text]
        ? letterPronunciation[text]
        : text;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'da-DK'; // Danish language
    utterance.rate = 0.7; // Slower for toddlers
    utterance.pitch = 1.2; // Higher pitch for toddlers
    utterance.volume = 1.0;

    // Try to find a Danish voice
    const voices = window.speechSynthesis.getVoices();
    const danishVoice = voices.find(voice => voice.lang.startsWith('da'));

    if (danishVoice) {
        utterance.voice = danishVoice;
    }

    window.speechSynthesis.speak(utterance);
}

// Load voices (some browsers need this)
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
