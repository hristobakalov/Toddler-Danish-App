# App Architecture

This document describes the modular architecture of the Danish Language Learning App.

## Directory Structure

```
Toddler-Danish-App/
├── index.html              # Main HTML file
├── styles.css              # Global styles
├── manifest.json           # PWA manifest
├── service-worker.js       # PWA service worker
├── js/
│   ├── main.js            # Entry point
│   ├── game-manager.js    # Game orchestrator
│   ├── games/             # Game modules
│   │   ├── alphabet-game.js
│   │   └── colors-game.js
│   ├── data/              # Game data
│   │   ├── alphabet-data.js
│   │   └── colors-data.js
│   └── utils/             # Shared utilities
│       ├── speech.js      # Text-to-speech manager
│       └── animations.js  # Animation utilities
└── app.js.old             # Legacy monolithic code (backup)
```

## Architecture Overview

### Modular Design Principles

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Reusability**: Shared utilities can be used across multiple games
3. **Maintainability**: Easy to update or add new games without affecting existing code
4. **Testability**: Each module can be tested independently

## Core Modules

### 1. Main Entry Point (`js/main.js`)

- Initializes the app on DOM load
- Creates and initializes the GameManager
- Registers the service worker for PWA functionality

### 2. Game Manager (`js/game-manager.js`)

**Responsibilities:**
- Orchestrates all games
- Manages game lifecycle (init, destroy)
- Handles navigation between games
- Updates UI elements (title, subtitle)

**Key Methods:**
- `init()`: Initialize all games and navigation
- `setupNavigation()`: Configure nav menu event listeners
- `switchGame(gameName)`: Switch between games
- `getCurrentGame()`: Get active game instance

### 3. Game Modules (`js/games/`)

Each game is a self-contained ES6 class:

#### AlphabetGame (`alphabet-game.js`)

**Responsibilities:**
- Render alphabet cards
- Handle letter pronunciation
- Show/hide word examples
- Manage card click states

**Key Methods:**
- `init()`: Initialize and render the game
- `render()`: Create and display all cards
- `createLetterCard(item, index)`: Create a single card
- `handleCardClick(card, item, wordsSection)`: Handle interactions
- `destroy()`: Clean up when game is closed

#### ColorsGame (`colors-game.js`)

**Responsibilities:**
- Render color cards (free play mode)
- Manage quiz game mode
- Handle countdown and quiz rounds
- Provide feedback on answers

**Key Methods:**
- `init()`: Initialize both free play and quiz modes
- `renderFreePlay()`: Display color cards
- `startGame()`: Begin quiz mode
- `startCountdown()`: 3, 2, 1, Go countdown
- `startQuizRound()`: Generate and display quiz
- `handleColorSelection()`: Process answer and give feedback
- `destroy()`: Clean up game state

### 4. Data Modules (`js/data/`)

Pure data exports - no logic:

- `alphabet-data.js`: Danish alphabet with words and emojis
- `colors-data.js`: Danish colors with hex codes and emojis

**Benefits:**
- Easy to update content without touching logic
- Can be easily localized for other languages
- Simple to add/remove items

### 5. Utility Modules (`js/utils/`)

Shared functionality used across games:

#### SpeechManager (`speech.js`)

**Responsibilities:**
- Text-to-speech synthesis
- Danish pronunciation mapping
- Voice selection

**Key Methods:**
- `speak(text, isLetter)`: Speak text in Danish

#### AnimationManager (`animations.js`)

**Responsibilities:**
- Card animations
- Feedback overlays

**Key Methods:**
- `animateCard(element, animationClass)`: Apply animation
- `showFeedback(icon, color)`: Display feedback overlay

## Adding a New Game

To add a new game, follow these steps:

### 1. Create Data File

```javascript
// js/data/numbers-data.js
export const danishNumbers = [
    { number: 1, name: 'En', emoji: '1️⃣' },
    { number: 2, name: 'To', emoji: '2️⃣' },
    // ...
];
```

### 2. Create Game Module

```javascript
// js/games/numbers-game.js
import { danishNumbers } from '../data/numbers-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class NumbersGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speechManager = new SpeechManager();
    }

    init() {
        this.render();
    }

    render() {
        // Render your game
    }

    destroy() {
        // Clean up
    }
}
```

### 3. Update HTML

Add game section and navigation button:

```html
<!-- Navigation -->
<button class="nav-item" data-game="numbers">
    <span class="nav-icon">🔢</span>
    <span class="nav-label">Tal</span>
</button>

<!-- Game Content -->
<div class="game-content" id="numbersGame">
    <div id="numbersGrid"></div>
</div>
```

### 4. Register in GameManager

```javascript
// js/game-manager.js
import { NumbersGame } from './games/numbers-game.js';

// In constructor
this.games.numbers = null;

// In init()
this.games.numbers = new NumbersGame('numbersGrid');
this.games.numbers.init();

// In switchGame()
case 'numbers':
    document.getElementById('numbersGame').classList.add('active');
    titleEl.textContent = '🔢 Tal';
    subtitleEl.textContent = 'Lær at tælle!';
    break;
```

### 5. Update Service Worker

Add new files to cache:

```javascript
const urlsToCache = [
    // ...
    '/js/games/numbers-game.js',
    '/js/data/numbers-data.js'
];
```

## Benefits of This Architecture

### For Development

- **Easy to understand**: Each file has a clear purpose
- **Easy to debug**: Issues are isolated to specific modules
- **Easy to extend**: Add new games without touching existing code
- **Easy to refactor**: Change one game without affecting others

### For Performance

- **Code splitting**: Browsers can cache modules separately
- **Lazy loading**: Could load games on-demand (future optimization)
- **Tree shaking**: Unused code can be eliminated in builds

### For Maintenance

- **Single Responsibility**: Each module does one thing well
- **DRY (Don't Repeat Yourself)**: Shared code in utils
- **Clear dependencies**: ES6 imports show what each file needs
- **Version control**: Smaller files = clearer git diffs

## ES6 Modules

This app uses native ES6 modules (`import`/`export`):

- No build step required for development
- Native browser support (modern browsers)
- Clear dependency graph
- Better IDE support (autocomplete, refactoring)

## Future Improvements

Possible enhancements to the architecture:

1. **State Management**: Add a centralized state manager (similar to Redux)
2. **Event Bus**: Implement pub/sub for game communication
3. **Config System**: Externalize configuration (colors, timeouts, etc.)
4. **Plugin System**: Allow third-party games to be registered
5. **Build System**: Add Vite/Webpack for production optimization
6. **TypeScript**: Add type safety for better DX
7. **Testing**: Add Jest/Vitest for unit tests

## Notes

- All modules use ES6 class syntax for consistency
- All paths are relative to the project root
- Service worker caches all modules for offline use
- The old monolithic `app.js` is backed up as `app.js.old`
