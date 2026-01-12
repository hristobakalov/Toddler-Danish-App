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

// Get image URL for a word (using Unsplash for real photos)
function getImageUrl(word) {
    const cache = getCachedImages();

    // Check if we have a cached image
    if (cache[word]) {
        return cache[word];
    }

    // Map Danish words to English search terms for better image results
    const translationMap = {
        'Abe': 'monkey',
        'Avis': 'newspaper',
        'Bjørn': 'bear',
        'Brød': 'bread',
        'Cikade': 'cicada',
        'Cykel': 'bicycle',
        'Delfin': 'dolphin',
        'Dør': 'door',
        'Egern': 'squirrel',
        'Elev': 'student child',
        'Fisk': 'fish',
        'Fod': 'foot',
        'Giraf': 'giraffe',
        'Glas': 'glass cup',
        'Hund': 'dog',
        'Hus': 'house',
        'Ildflue': 'firefly',
        'Is': 'ice cream',
        'Jaguar': 'jaguar',
        'Jakke': 'jacket',
        'Kat': 'cat',
        'Kaffe': 'coffee',
        'Løve': 'lion',
        'Lampe': 'lamp',
        'Mus': 'mouse',
        'Mælk': 'milk',
        'Næsehorn': 'rhinoceros',
        'Nøgle': 'key',
        'Ørn': 'eagle',
        'Oste': 'cheese',
        'Pingvin': 'penguin',
        'Penge': 'money coins',
        'Quokka': 'quokka',
        'Quiz': 'quiz game',
        'Ræv': 'fox',
        'Regn': 'rain',
        'Slange': 'snake',
        'Sko': 'shoe',
        'Tiger': 'tiger',
        'Tog': 'train',
        'Ugle': 'owl',
        'Ur': 'clock watch',
        'Vildsvin': 'wild boar',
        'Vand': 'water glass',
        'Wombat': 'wombat',
        'Weekend': 'weekend relaxation',
        'Xerus': 'squirrel africa',
        'Xylofon': 'xylophone',
        'Yak': 'yak',
        'Yoghurt': 'yogurt',
        'Zebra': 'zebra',
        'Zone': 'zone area',
        'Æsel': 'donkey',
        'Æble': 'apple',
        'Ørred': 'trout fish',
        'Øl': 'beer',
        'Ål': 'eel',
        'Åben': 'open door'
    };

    const searchTerm = translationMap[word] || word;

    // Use Unsplash Source for free, high-quality photos
    // This service provides random images based on search terms
    const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(searchTerm)}`;

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
