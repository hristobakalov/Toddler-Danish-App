import { GameManager } from './game-manager.js';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const gameManager = new GameManager();
    gameManager.init();

    // Make gameManager available globally for debugging (optional)
    window.gameManager = gameManager;
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
