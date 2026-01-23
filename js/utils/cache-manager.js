// Cache Manager for translations and audio
// Uses localStorage for persistent caching

export class CacheManager {
    constructor() {
        this.translationCache = this.loadCache('camera_translations') || {};
        this.audioCache = this.loadCache('camera_audio') || {};
    }

    // Load cache from localStorage
    loadCache(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error loading cache:', error);
            return null;
        }
    }

    // Save cache to localStorage
    saveCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Error saving cache:', error);
        }
    }

    // Get cached translation
    getTranslation(englishWord) {
        const normalized = englishWord.toLowerCase().trim();
        return this.translationCache[normalized] || null;
    }

    // Cache translation
    cacheTranslation(englishWord, danishWord) {
        const normalized = englishWord.toLowerCase().trim();
        this.translationCache[normalized] = danishWord;
        this.saveCache('camera_translations', this.translationCache);
    }

    // Get cached audio
    getAudio(danishWord) {
        const normalized = danishWord.toLowerCase().trim();
        return this.audioCache[normalized] || null;
    }

    // Cache audio (stores base64 audio data)
    cacheAudio(danishWord, audioData) {
        const normalized = danishWord.toLowerCase().trim();
        this.audioCache[normalized] = {
            data: audioData,
            timestamp: Date.now()
        };
        this.saveCache('camera_audio', this.audioCache);
    }

    // Clear old cache entries (older than 30 days)
    clearOldEntries() {
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        let cleaned = false;

        // Clean audio cache
        for (const [key, value] of Object.entries(this.audioCache)) {
            if (value.timestamp && (now - value.timestamp) > thirtyDays) {
                delete this.audioCache[key];
                cleaned = true;
            }
        }

        if (cleaned) {
            this.saveCache('camera_audio', this.audioCache);
        }
    }

    // Get cache statistics
    getStats() {
        return {
            translations: Object.keys(this.translationCache).length,
            audioFiles: Object.keys(this.audioCache).length
        };
    }

    // Clear all cache
    clearAll() {
        this.translationCache = {};
        this.audioCache = {};
        localStorage.removeItem('camera_translations');
        localStorage.removeItem('camera_audio');
        console.log('✅ Cache cleared');
    }
}
