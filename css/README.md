# CSS Structure Documentation

This directory contains modular CSS files for the Toddler Danish App, replacing the monolithic `styles.css` file.

## Directory Structure

```
css/
├── base.css                    # Global resets and base styles
├── navigation.css              # Navigation menu styles
├── intro.css                   # Intro screen / game menu
├── main.css                    # Import file (optional, not currently used)
├── common/                     # Shared component styles
│   ├── animations.css          # Keyframe animations
│   ├── buttons.css             # Common button styles
│   ├── cards.css               # Card component styles
│   └── quiz.css                # Quiz interface components
└── games/                      # Game-specific styles
    ├── alphabet.css            # Alphabet game
    ├── colors.css              # Colors game
    ├── numbers.css             # Numbers game
    ├── sentences.css           # Sentences game
    ├── actions.css             # Actions game
    ├── box.css                 # Gift box game
    ├── letter-tracing.css      # Letter tracing game
    ├── parking.css             # Parking game
    ├── hand.css                # Hand/fingers game
    └── clothing.css            # Clothing game (Bingo & Bluey)
```

## File Descriptions

### Base Files
- **base.css** (936B): Global resets, body styles, container, header, and game content visibility
- **navigation.css** (1.5KB): Bottom navigation menu, nav items, and mobile responsiveness
- **intro.css** (3.8KB): Intro screen with game cards and home button

### Common Components
- **animations.css** (238B): Reusable keyframe animations (spin, pulse, shake, etc.)
- **buttons.css** (2.2KB): Start game, exit game, and common button styles
- **cards.css** (5.7KB): Letter cards, color cards, number cards
- **quiz.css** (4.0KB): Quiz interface, countdown, feedback overlay, options grid

### Game-Specific Styles
Each game has its own CSS file containing only the styles specific to that game:
- alphabet.css (2.7KB)
- colors.css (4.9KB)
- numbers.css (2.7KB)
- sentences.css (3.1KB)
- actions.css (5.0KB)
- box.css (4.2KB)
- letter-tracing.css (4.3KB)
- parking.css (7.4KB)
- hand.css (3.2KB)
- clothing.css (2.9KB)

## Benefits of Modular Structure

1. **Better Organization**: Each game's styles are in their own file
2. **Easier Maintenance**: Changes to one game won't affect others
3. **Better Performance**: Browser can cache individual files
4. **Code Reusability**: Common components are shared across games
5. **Developer Experience**: Much easier to find and edit specific styles

## Adding a New Game

When adding a new game:

1. Create a new CSS file in `css/games/your-game.css`
2. Add the styles specific to your game
3. Add the link tag in `index.html`:
   ```html
   <link rel="stylesheet" href="css/games/your-game.css">
   ```

## Original File

The original monolithic `styles.css` (2900 lines) has been backed up as `styles.css.backup`.

## Total Size Comparison

- **Original**: 1 file × 2900 lines = ~100KB
- **Modular**: 18 files × average 150 lines = ~100KB (same total, but organized)

The total file size remains the same, but the organization is vastly improved!
