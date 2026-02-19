export const speechConfig = {
    // Languages
    sourceLanguage: 'bg-BG', // Bulgarian
    targetLanguage: 'da-DK', // Danish

    // Google Translate API settings
    translateApiUrl: 'https://translation.googleapis.com/language/translate/v2',

    // Speech Recognition settings
    recognition: {
        continuous: false,
        interimResults: false,
        maxAlternatives: 1
    },

    // Storage key for saved phrases
    storageKey: 'toddler_danish_saved_phrases',
    maxSavedPhrases: 50
};
