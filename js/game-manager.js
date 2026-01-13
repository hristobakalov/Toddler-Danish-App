import { AlphabetGame } from './games/alphabet-game.js';
import { ColorsGame } from './games/colors-game.js';
import { NumbersGame } from './games/numbers-game.js';
import { SentencesGame } from './games/sentences-game.js';
import { ActionsGame } from './games/actions-game.js';

export class GameManager {
    constructor() {
        this.games = {
            alphabet: null,
            colors: null,
            numbers: null,
            sentences: null,
            actions: null
        };
        this.currentGame = 'alphabet';
    }

    init() {
        // Initialize games
        this.games.alphabet = new AlphabetGame('alphabetGrid');
        this.games.alphabet.init();

        this.games.colors = new ColorsGame('colorsFreePlay', 'colorsQuizMode');
        this.games.colors.init();

        this.games.numbers = new NumbersGame('numbersFreePlay', 'numbersQuizMode');
        this.games.numbers.init();

        this.games.sentences = new SentencesGame('sentencesContainer');
        this.games.sentences.init();

        this.games.actions = new ActionsGame('actionsFreePlay', 'actionsQuizMode');
        this.games.actions.init();

        // Setup navigation
        this.setupNavigation();
    }

    setupNavigation() {
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
                this.switchGame(gameName, gameTitle, gameSubtitle);
            });
        });
    }

    switchGame(gameName, titleEl, subtitleEl) {
        this.currentGame = gameName;

        switch (gameName) {
            case 'alphabet':
                document.getElementById('alphabetGame').classList.add('active');
                titleEl.textContent = '🔤 Alfabet';
                subtitleEl.textContent = 'Tryk på kortet for at lære!';
                break;

            case 'colors':
                document.getElementById('colorsGame').classList.add('active');
                titleEl.textContent = '🎨 Farver';
                subtitleEl.textContent = 'Tryk på farven for at lære!';
                break;

            case 'numbers':
                document.getElementById('numbersGame').classList.add('active');
                titleEl.textContent = '🔢 Tal';
                subtitleEl.textContent = 'Tryk på tallet for at lære!';
                break;

            case 'sentences':
                document.getElementById('sentencesGame').classList.add('active');
                titleEl.textContent = '💬 Sætninger';
                subtitleEl.textContent = 'Tryk for at lytte til sætningen!';
                break;

            case 'actions':
                document.getElementById('actionsGame').classList.add('active');
                titleEl.textContent = '🏃 Handlinger';
                subtitleEl.textContent = 'Tryk på handlingen for at lære!';
                break;

            default:
                console.warn(`Unknown game: ${gameName}`);
        }
    }

    getCurrentGame() {
        return this.games[this.currentGame];
    }
}
