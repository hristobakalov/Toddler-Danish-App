// Text-to-speech utility
export class SpeechManager {
    constructor() {
        // Danish letters pronunciation mapping
        this.letterPronunciation = {
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

        // Load voices when available
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    speak(text, isLetter = false) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        // If it's a single letter, use the pronunciation guide
        const textToSpeak = isLetter && this.letterPronunciation[text]
            ? this.letterPronunciation[text]
            : text;

        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'da-DK'; // Danish language
        utterance.rate = 0.84; // 20% faster than original 0.7 (0.7 * 1.2 = 0.84)
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
}
