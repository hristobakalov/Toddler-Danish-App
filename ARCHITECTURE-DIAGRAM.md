# Architecture Diagram

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                         index.html                           │
│                    (Main HTML Structure)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ loads (type="module")
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        js/main.js                            │
│                    (Application Entry)                       │
│  • Initialize on DOMContentLoaded                           │
│  • Register Service Worker                                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ creates
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    js/game-manager.js                        │
│                    (Game Orchestrator)                       │
│  • Manages game lifecycle                                   │
│  • Handles navigation                                       │
│  • Switches between games                                   │
└────┬───────────────────────┬────────────────────────────────┘
     │                       │
     │ creates & manages     │ creates & manages
     │                       │
     ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│  AlphabetGame    │   │   ColorsGame     │
│ (alphabet-game)  │   │  (colors-game)   │
└────┬─────────────┘   └────┬─────────────┘
     │                       │
     │ imports               │ imports
     │                       │
     ├───────────────────────┼─────────────────┐
     │                       │                  │
     ▼                       ▼                  ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ SpeechManager│   │  Animation   │   │  Game Data   │
│   (speech)   │   │  Manager     │   │              │
│              │   │(animations)  │   │ • alphabet   │
│ • speak()    │   │              │   │ • colors     │
│ • Danish     │   │ • animate    │   │              │
│   letters    │   │   Card()     │   │              │
│              │   │ • show       │   │              │
│              │   │   Feedback() │   │              │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Data Flow

### User Interaction Flow

```
User clicks nav button
        │
        ▼
GameManager.switchGame()
        │
        ├─→ Hide all games
        ├─→ Show selected game
        ├─→ Update title/subtitle
        └─→ Update active nav state


User clicks card/element
        │
        ▼
Game.handleClick()
        │
        ├─→ AnimationManager.animateCard()
        ├─→ SpeechManager.speak()
        └─→ Update game state
```

### Colors Quiz Game Flow

```
User clicks "Start Game"
        │
        ▼
ColorsGame.startGame()
        │
        ▼
ColorsGame.startCountdown()
        │
        ├─→ 3... (speak)
        ├─→ 2... (speak)
        ├─→ 1... (speak)
        └─→ Go! (speak)
        │
        ▼
ColorsGame.startQuizRound()
        │
        ├─→ Pick random color
        ├─→ Generate 4 options
        ├─→ Display options
        └─→ Speak color name
        │
        ▼
User clicks color option
        │
        ▼
ColorsGame.handleColorSelection()
        │
        ├─→ If correct:
        │   ├─→ Show green border
        │   ├─→ AnimationManager.showFeedback(👍)
        │   └─→ Wait 2s → startQuizRound()
        │
        └─→ If incorrect:
            ├─→ Show red border
            ├─→ Highlight correct answer
            ├─→ AnimationManager.showFeedback(👎)
            ├─→ SpeechManager.speak(correct color)
            └─→ Wait 3s → startQuizRound()
```

## File Organization

```
js/
│
├── main.js                    # Entry point
│   └── imports: GameManager
│
├── game-manager.js            # Orchestrator
│   ├── imports: AlphabetGame
│   └── imports: ColorsGame
│
├── games/                     # Game modules
│   ├── alphabet-game.js
│   │   ├── imports: alphabet-data
│   │   ├── imports: SpeechManager
│   │   └── imports: AnimationManager
│   │
│   └── colors-game.js
│       ├── imports: colors-data
│       ├── imports: SpeechManager
│       └── imports: AnimationManager
│
├── data/                      # Pure data
│   ├── alphabet-data.js       # Danish alphabet
│   └── colors-data.js         # Danish colors
│
└── utils/                     # Shared utilities
    ├── speech.js              # TTS functionality
    └── animations.js          # Animation helpers
```

## Lifecycle Diagram

### App Initialization

```
1. Browser loads index.html
        ↓
2. Browser loads js/main.js (ES6 module)
        ↓
3. DOMContentLoaded fires
        ↓
4. main.js creates GameManager
        ↓
5. GameManager.init()
        ↓
6. Create AlphabetGame instance
        ↓
7. AlphabetGame.init()
        ↓
8. Create ColorsGame instance
        ↓
9. ColorsGame.init()
        ↓
10. Setup navigation listeners
        ↓
11. App ready! (Alphabet game active)
```

### Game Switch

```
User clicks "Colors" nav button
        ↓
GameManager.switchGame('colors')
        ↓
Hide AlphabetGame content
        ↓
Show ColorsGame content
        ↓
Update header (title & subtitle)
        ↓
Update nav active state
        ↓
ColorsGame is now active
```

## Component Responsibilities

### GameManager
- **Owns**: Game instances
- **Controls**: Navigation, visibility
- **Coordinates**: Game switching

### AlphabetGame
- **Owns**: Letter cards, click state
- **Controls**: Card rendering, word reveal
- **Uses**: SpeechManager, AnimationManager

### ColorsGame
- **Owns**: Color cards, quiz state
- **Controls**: Free play & quiz modes
- **Uses**: SpeechManager, AnimationManager

### SpeechManager
- **Owns**: Speech synthesis config
- **Controls**: Danish pronunciation
- **Provides**: speak() method

### AnimationManager
- **Owns**: Nothing (stateless)
- **Controls**: CSS class animations
- **Provides**: animateCard(), showFeedback()

## Benefits Summary

```
┌──────────────────────────────────────────────────────────┐
│                   MODULAR ARCHITECTURE                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ✓ Separation of Concerns                               │
│    Each module has one clear purpose                     │
│                                                           │
│  ✓ Reusability                                           │
│    Utilities shared across games                         │
│                                                           │
│  ✓ Maintainability                                       │
│    Easy to find and fix bugs                            │
│                                                           │
│  ✓ Scalability                                           │
│    Add new games without touching existing code          │
│                                                           │
│  ✓ Testability                                           │
│    Each module can be tested in isolation               │
│                                                           │
│  ✓ Clear Dependencies                                    │
│    ES6 imports show what each file needs                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```
