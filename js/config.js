// Configuration loader
// Loads API keys for the application

// For development: Set your API key here temporarily
// For production: Load from your backend server

export function loadConfig() {
    // Set API key from .env file
    // Copy your GOOGLE_VISION_API_KEY from .env and paste it here:
    window.GOOGLE_VISION_API_KEY = 'AIzaSyDXI3eVDfBuLGyzBsKlCdHB8TdxdszgU_c';

    console.log('✅ Configuration loaded');
}

// Auto-load on import
loadConfig();
