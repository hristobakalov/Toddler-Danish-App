// Configuration loader
// Loads API keys for the application

// For development: Set your API key here temporarily
// For production: Load from your backend server

export function loadConfig() {
    // Set API keys from .env file
    window.GOOGLE_VISION_API_KEY = 'AIzaSyDXI3eVDfBuLGyzBsKlCdHB8TdxdszgU_c';
    window.GOOGLE_TRANSLATION_API_KEY = 'AIzaSyDh6C5cuK_Gf3sF8TACQ448uUHGnaYJINM';

    // ElevenLabs configuration
    window.ELEVENLABS_API_KEY = 'sk_8a3c6b752a14f06b287c1e0ddbe2e204cf23ac25fec9b5c5';
    window.ELEVENLABS_VOICE_ID = 'C43bq5qXRueL1cBQEOt3';
    window.ELEVENLABS_MODEL_ID = 'eleven_v3_dpo';

    console.log('✅ Configuration loaded');
}

// Auto-load on import
loadConfig();
