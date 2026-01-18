import { AlphabetGame } from './games/alphabet-game.js';
import { ColorsGame } from './games/colors-game.js';
import { NumbersGame } from './games/numbers-game.js';
import { SentencesGame } from './games/sentences-game.js';
import { ActionsGame } from './games/actions-game.js';
import { BoxGame } from './games/box-game.js';
import { LetterTracingGame } from './games/letter-tracing-game.js';
import { ParkingGame } from './games/parking-game.js';
import { HandGame } from './games/hand-game.js';
import { ClothingGame } from './games/clothing-game.js';
import { FoodGame } from './games/food-game.js';

export class GameManager {
    constructor() {
        this.games = {
            alphabet: null,
            colors: null,
            numbers: null,
            sentences: null,
            actions: null,
            box: null,
            letterTracing: null,
            parking: null,
            hand: null,
            clothing: null,
            food: null
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

        this.games.box = new BoxGame('boxGameContainer');
        this.games.box.init();

        this.games.letterTracing = new LetterTracingGame('letterTracingContainer');
        this.games.letterTracing.init();

        this.games.parking = new ParkingGame('parkingGameContainer');
        this.games.parking.init();

        this.games.hand = new HandGame('handFreePlay', 'handQuizMode');
        this.games.hand.init();

        this.games.clothing = new ClothingGame('clothingFreePlay', 'clothingQuizMode');
        this.games.clothing.init();

        this.games.food = new FoodGame('foodFreePlay', 'foodQuizMode');
        this.games.food.init();

        // Setup navigation
        this.setupIntroScreen();
        this.setupHomeButton();
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

            case 'box':
                document.getElementById('boxGame').classList.add('active');
                titleEl.textContent = '🎁 Hvad er i boksen?';
                subtitleEl.textContent = 'Åbn gaven for at se!';
                break;

            case 'letterTracing':
                document.getElementById('letterTracingGame').classList.add('active');
                titleEl.textContent = '✏️ Bogstav Tegning';
                subtitleEl.textContent = 'Tegn bogstavet!';
                break;

            case 'parking':
                document.getElementById('parkingGame').classList.add('active');
                titleEl.textContent = '🚗 Parkering';
                subtitleEl.textContent = 'Parker bilerne!';
                break;

            case 'hand':
                document.getElementById('handGame').classList.add('active');
                titleEl.textContent = '✋ Hånd';
                subtitleEl.textContent = 'Tryk på fingeren for at lære!';
                break;

            case 'clothing':
                document.getElementById('clothingGame').classList.add('active');
                titleEl.textContent = '👕 Tøj';
                subtitleEl.textContent = 'Tryk på tøjet for at lære!';
                break;

            case 'food':
                document.getElementById('foodGame').classList.add('active');
                titleEl.textContent = '🍎 Spisetid';
                subtitleEl.textContent = 'Tryk på maden for at lære!';
                break;

            default:
                console.warn(`Unknown game: ${gameName}`);
        }
    }

    getCurrentGame() {
        return this.games[this.currentGame];
    }

    setupIntroScreen() {
        const gameCards = document.querySelectorAll('.game-card');
        const introScreen = document.getElementById('introScreen');
        const container = document.querySelector('.container');
        const homeBtn = document.getElementById('homeBtn');
        const gameTitle = document.getElementById('gameTitle');
        const gameSubtitle = document.getElementById('gameSubtitle');

        gameCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameName = card.dataset.game;

                // Hide intro screen
                introScreen.classList.remove('active');

                // Show game container and home button
                container.style.display = 'block';
                homeBtn.style.display = 'flex';

                // Hide all games
                document.querySelectorAll('.game-content').forEach(game => {
                    game.classList.remove('active');
                });

                // Show selected game
                this.switchGame(gameName, gameTitle, gameSubtitle);
            });
        });
    }

    setupHomeButton() {
        const homeBtn = document.getElementById('homeBtn');
        const introScreen = document.getElementById('introScreen');
        const container = document.querySelector('.container');

        homeBtn.addEventListener('click', () => {
            // Hide game container and home button
            container.style.display = 'none';
            homeBtn.style.display = 'none';

            // Show intro screen
            introScreen.classList.add('active');
        });
    }
}
