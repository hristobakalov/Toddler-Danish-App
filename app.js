// Danish alphabet data with words
const danishAlphabet = [
    { letter: 'A', words: ['Abe', 'Avis'] },
    { letter: 'B', words: ['Bjørn', 'Brød'] },
    { letter: 'C', words: ['Cikade', 'Cykel'] },
    { letter: 'D', words: ['Delfin', 'Dør'] },
    { letter: 'E', words: ['Egern', 'Elev'] },
    { letter: 'F', words: ['Fisk', 'Fod'] },
    { letter: 'G', words: ['Giraf', 'Glas'] },
    { letter: 'H', words: ['Hund', 'Hus'] },
    { letter: 'I', words: ['Ildflue', 'Is'] },
    { letter: 'J', words: ['Jaguar', 'Jakke'] },
    { letter: 'K', words: ['Kat', 'Kaffe'] },
    { letter: 'L', words: ['Løve', 'Lampe'] },
    { letter: 'M', words: ['Mus', 'Mælk'] },
    { letter: 'N', words: ['Næsehorn', 'Nøgle'] },
    { letter: 'O', words: ['Ørn', 'Oste'] },
    { letter: 'P', words: ['Pingvin', 'Penge'] },
    { letter: 'Q', words: ['Quokka', 'Quiz'] },
    { letter: 'R', words: ['Ræv', 'Regn'] },
    { letter: 'S', words: ['Slange', 'Sko'] },
    { letter: 'T', words: ['Tiger', 'Tog'] },
    { letter: 'U', words: ['Ugle', 'Ur'] },
    { letter: 'V', words: ['Vildsvin', 'Vand'] },
    { letter: 'W', words: ['Wombat', 'Weekend'] },
    { letter: 'X', words: ['Xerus', 'Xylofon'] },
    { letter: 'Y', words: ['Yak', 'Yoghurt'] },
    { letter: 'Z', words: ['Zebra', 'Zone'] },
    { letter: 'Æ', words: ['Æsel', 'Æble'] },
    { letter: 'Ø', words: ['Ørred', 'Øl'] },
    { letter: 'Å', words: ['Ål', 'Åben'] }
];

// Track which cards have been clicked
const clickedCards = new Set();

// Image cache using localStorage
const IMAGE_CACHE_KEY = 'danishAlphabetImageCache';

// Get cached images
function getCachedImages() {
    try {
        const cached = localStorage.getItem(IMAGE_CACHE_KEY);
        return cached ? JSON.parse(cached) : {};
    } catch (e) {
        return {};
    }
}

// Save images to cache
function saveImageToCache(word, imageUrl) {
    try {
        const cache = getCachedImages();
        cache[word] = imageUrl;
        localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
        console.warn('Could not cache image:', e);
    }
}

// Get image URL for a word - uses curated emoji/icon style images
function getImageUrl(word) {
    const cache = getCachedImages();

    // Check if we have a cached image
    if (cache[word]) {
        return cache[word];
    }

    // Map Danish words to emojis for consistent, recognizable images
    const emojiMap = {
        'Abe': '🐵',
        'Avis': '📰',
        'Bjørn': '🐻',
        'Brød': '🍞',
        'Cikade': '🦗',
        'Cykel': '🚲',
        'Delfin': '🐬',
        'Dør': '🚪',
        'Egern': '🐿️',
        'Elev': '👨‍🎓',
        'Fisk': '🐟',
        'Fod': '🦶',
        'Giraf': '🦒',
        'Glas': '🥃',
        'Hund': '🐕',
        'Hus': '🏠',
        'Ildflue': '🪲',
        'Is': '🍦',
        'Jaguar': '🐆',
        'Jakke': '🧥',
        'Kat': '🐈',
        'Kaffe': '☕',
        'Løve': '🦁',
        'Lampe': '💡',
        'Mus': '🐭',
        'Mælk': '🥛',
        'Næsehorn': '🦏',
        'Nøgle': '🔑',
        'Ørn': '🦅',
        'Oste': '🧀',
        'Pingvin': '🐧',
        'Penge': '💰',
        'Quokka': '🦘',
        'Quiz': '❓',
        'Ræv': '🦊',
        'Regn': '🌧️',
        'Slange': '🐍',
        'Sko': '👟',
        'Tiger': '🐯',
        'Tog': '🚂',
        'Ugle': '🦉',
        'Ur': '⏰',
        'Vildsvin': '🐗',
        'Vand': '💧',
        'Wombat': '🦫',
        'Weekend': '🏖️',
        'Xerus': '🐿️',
        'Xylofon': '🎵',
        'Yak': '🐃',
        'Yoghurt': '🥣',
        'Zebra': '🦓',
        'Zone': '🗺️',
        'Æsel': '🫏',
        'Æble': '🍎',
        'Ørred': '🐟',
        'Øl': '🍺',
        'Ål': '🐍',
        'Åben': '🔓'
    };

    const emoji = emojiMap[word] || '📷';

    // Create a data URL with the emoji as an SVG
    // This ensures the image always loads and displays correctly
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="400" height="400">
            <rect width="100" height="100" fill="#ffffff"/>
            <text x="50" y="50" font-size="60" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
        </svg>
    `;

    const imageUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));

    // Cache the URL
    saveImageToCache(word, imageUrl);

    return imageUrl;
}

// Initialize the app
function init() {
    const grid = document.getElementById('alphabetGrid');

    danishAlphabet.forEach((item, index) => {
        const card = createLetterCard(item, index);
        grid.appendChild(card);
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

        // Create image element
        const img = document.createElement('img');
        img.src = getImageUrl(word);
        img.alt = word;
        img.className = 'word-image';

        // Create text element
        const text = document.createElement('h3');
        text.textContent = word;

        wordItem.appendChild(img);
        wordItem.appendChild(text);

        wordItem.addEventListener('click', (e) => {
            e.stopPropagation();
            speakText(word);
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
