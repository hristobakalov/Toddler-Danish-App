# Developer Guide

Quick reference for developers working on this project.

## Project Structure

```
Toddler-Danish-App/
├── index.html                 # Main HTML
├── styles.css                 # Global styles
├── manifest.json              # PWA manifest
├── service-worker.js          # PWA service worker
│
├── js/                        # JavaScript modules
│   ├── main.js               # Entry point
│   ├── game-manager.js       # Game orchestrator
│   │
│   ├── games/                # Game implementations
│   │   ├── alphabet-game.js
│   │   └── colors-game.js
│   │
│   ├── data/                 # Game content
│   │   ├── alphabet-data.js
│   │   └── colors-data.js
│   │
│   └── utils/                # Shared utilities
│       ├── speech.js
│       └── animations.js
│
└── docs/                      # Documentation
    ├── ARCHITECTURE.md
    ├── ARCHITECTURE-DIAGRAM.md
    ├── REFACTORING-SUMMARY.md
    └── DEVELOPER-GUIDE.md (this file)
```

## Getting Started

### 1. Clone and Run

```bash
# Navigate to project
cd Toddler-Danish-App

# Start local server (required for ES6 modules)
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### 2. Make Changes

Edit files in `js/` directory. Browser will reload automatically.

### 3. Test

Open browser DevTools:
- Console: Check for errors
- Network: Verify module loading
- Application: Check service worker

## Module System

### Importing

```javascript
// Named imports
import { danishAlphabet } from '../data/alphabet-data.js';

// Default imports
import { GameManager } from './game-manager.js';

// Multiple imports
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';
```

### Exporting

```javascript
// Named export
export const danishColors = [...];

// Class export
export class ColorsGame {
    // ...
}
```

## Common Tasks

### Adding a New Game

See [ARCHITECTURE.md](ARCHITECTURE.md#adding-a-new-game) for detailed guide.

Quick version:

1. Create `js/data/your-game-data.js`
2. Create `js/games/your-game.js`
3. Add HTML section in `index.html`
4. Register in `js/game-manager.js`
5. Update `service-worker.js` cache list

### Modifying Existing Game

1. Find game in `js/games/`
2. Make changes
3. Test in browser
4. Check console for errors

### Adding New Words/Colors

1. Edit `js/data/alphabet-data.js` or `js/data/colors-data.js`
2. Follow existing format
3. Refresh browser

### Changing Styles

1. Edit `styles.css`
2. Use existing CSS classes when possible
3. Test on mobile (DevTools responsive mode)

### Updating Speech

1. Edit `js/utils/speech.js`
2. Modify `letterPronunciation` object for letters
3. Adjust `rate`, `pitch` for voice changes

## Debugging

### Module Not Loading

**Error:** `Failed to load module`

**Fix:**
- Check file path (case-sensitive)
- Verify file exists
- Use relative paths (`./` or `../`)
- Must use `.js` extension

### Game Not Showing

**Check:**
1. HTML section has correct ID
2. Game registered in GameManager
3. Navigation data-game matches
4. Game's init() method called

### Speech Not Working

**Check:**
1. Browser supports Web Speech API (Chrome, Safari)
2. Not muted
3. Danish voice available (check in console)
4. Correct language code (`da-DK`)

### Service Worker Issues

**Fix:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
  .then(regs => regs.forEach(reg => reg.unregister()));

// Refresh page
location.reload();
```

## Code Style

### Naming Conventions

```javascript
// Classes: PascalCase
class AlphabetGame { }

// Variables/Functions: camelCase
const danishAlphabet = [];
function startGame() { }

// Constants: UPPER_SNAKE_CASE
const CACHE_NAME = 'app-v1';

// Private methods: _prefixed
_handlePrivateMethod() { }
```

### File Naming

```javascript
// Modules: kebab-case
alphabet-game.js
speech-manager.js
color-utils.js
```

### Comments

```javascript
// Single line for brief comments

/**
 * Multi-line for function documentation
 * @param {string} text - Text to speak
 * @param {boolean} isLetter - Whether text is a letter
 */
```

## Performance Tips

### Lazy Loading (Future)

Could implement:
```javascript
// Only load game when needed
const game = await import('./games/alphabet-game.js');
```

### Minimize Reflows

```javascript
// Bad: Multiple DOM updates
items.forEach(item => {
    container.appendChild(createCard(item));
});

// Good: Batch updates
const fragment = document.createDocumentFragment();
items.forEach(item => {
    fragment.appendChild(createCard(item));
});
container.appendChild(fragment);
```

### Event Delegation

```javascript
// Good: One listener for many elements
container.addEventListener('click', (e) => {
    if (e.target.matches('.card')) {
        handleCardClick(e.target);
    }
});

// Avoid: Many individual listeners
cards.forEach(card => {
    card.addEventListener('click', handleCardClick);
});
```

## Testing Checklist

Before committing:

- [ ] Test alphabet game
  - [ ] Click letters (pronunciation)
  - [ ] Click words (pronunciation)
  - [ ] Cards animate correctly

- [ ] Test colors game
  - [ ] Free play mode works
  - [ ] Start game button
  - [ ] Countdown (3, 2, 1, Go)
  - [ ] Quiz shows 4 colors
  - [ ] Correct answer (green, thumbs up)
  - [ ] Wrong answer (red, show correct)
  - [ ] Exit game button

- [ ] Test navigation
  - [ ] Switch between games
  - [ ] Title updates
  - [ ] Active state shows
  - [ ] Mobile (bottom nav)
  - [ ] Desktop (top nav)

- [ ] Browser compatibility
  - [ ] Chrome
  - [ ] Safari
  - [ ] Firefox
  - [ ] Mobile browsers

- [ ] PWA functionality
  - [ ] Service worker registers
  - [ ] Offline mode works
  - [ ] Install prompt (if applicable)

## Useful Commands

### Development Server

```bash
# Python
python3 -m http.server 8000

# Node (if you have it)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Check Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations()
    .then(regs => console.log(regs));
```

### Clear Cache

```javascript
// In browser console
caches.keys()
    .then(keys => Promise.all(
        keys.map(key => caches.delete(key))
    ));
```

### Check Module Loading

```javascript
// In browser console
performance.getEntriesByType('resource')
    .filter(r => r.name.includes('.js'))
    .forEach(r => console.log(r.name, r.duration));
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-game

# Make changes
# ... edit files ...

# Stage changes
git add js/games/new-game.js
git add js/data/new-game-data.js

# Commit with clear message
git commit -m "Add new numbers game with quiz mode"

# Push to remote
git push origin feature/new-game
```

## Resources

### Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture
- [ARCHITECTURE-DIAGRAM.md](ARCHITECTURE-DIAGRAM.md) - Visual diagrams
- [REFACTORING-SUMMARY.md](REFACTORING-SUMMARY.md) - What changed
- [README.md](README.md) - User guide

### External Resources
- [MDN: ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN: Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MDN: Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev: PWA Guide](https://web.dev/progressive-web-apps/)

## Common Patterns

### Creating a New Game

```javascript
import { gameData } from '../data/game-data.js';
import { SpeechManager } from '../utils/speech.js';
import { AnimationManager } from '../utils/animations.js';

export class MyGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.speechManager = new SpeechManager();
    }

    init() {
        this.render();
    }

    render() {
        // Create and append elements
    }

    destroy() {
        // Clean up
        this.container.innerHTML = '';
    }
}
```

### Adding Speech

```javascript
// Just a word
this.speechManager.speak('Hej');

// A letter (uses pronunciation map)
this.speechManager.speak('A', true);
```

### Adding Animation

```javascript
// Animate element
AnimationManager.animateCard(element, 'spin');

// Show feedback
AnimationManager.showFeedback('👍', '#4CAF50');
```

## Troubleshooting

### CORS Errors

Must use a server, not `file://` protocol.

### Module Not Found

Check:
1. Path is relative (`./` or `../`)
2. Extension is `.js`
3. File exists
4. Spelling/case matches

### Changes Not Showing

1. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
2. Clear service worker cache
3. Check browser console for errors

### Service Worker Not Updating

1. Unregister in DevTools > Application > Service Workers
2. Update `CACHE_NAME` in `service-worker.js`
3. Hard refresh

## Need Help?

1. Check console errors first
2. Review documentation
3. Check existing game code for examples
4. Debug with `console.log()`
5. Use browser DevTools

Happy coding! 🚀
