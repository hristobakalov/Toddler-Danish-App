export const flowerConfig = {
    // Grid settings
    gridSize: 20,
    cellSize: 25,

    // Flower settings
    flowerSize: 4,  // 4x4 grid cells
    flowerImages: ['img/flower1.png', 'img/flower2.png', 'img/flower3.png'],
    animationSpeed: 200,  // ms per frame

    // Game speed
    moveSpeed: 150,  // ms per move

    // Food items (12 total)
    foodItems: [
        { emoji: '🧃', name: 'Juice', points: 10 },
        { emoji: '🍏', name: 'Æble', points: 10 },
        { emoji: '🍎', name: 'Rødt æble', points: 10 },
        { emoji: '🍊', name: 'Appelsin', points: 10 },
        { emoji: '🍋', name: 'Citron', points: 10 },
        { emoji: '🍌', name: 'Banan', points: 10 },
        { emoji: '🍇', name: 'Druer', points: 10 },
        { emoji: '🍓', name: 'Jordbær', points: 10 },
        { emoji: '🥕', name: 'Gulerod', points: 10 },
        { emoji: '🥦', name: 'Broccoli', points: 10 },
        { emoji: '🌽', name: 'Majs', points: 10 },
        { emoji: '🍅', name: 'Tomat', points: 10 }
    ],

    // Obstacles
    rockEmoji: '🪨',
    rockCount: 8,  // Number of rocks on the field

    // Bombs
    bombEmoji: '🔴',
    explosionEmoji: '💥',
    bombSpawnInterval: [5000, 10000],  // Random between 5-10 seconds
    bombCountdown: 5000,  // 5 seconds before explosion
    explosionRadius: 2,  // 2x2 explosion area
    explosionDuration: 500,  // ms

    // Food spawning
    maxFoodItems: 5,  // Max food items on field at once

    // Controls
    controls: {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right'
    }
};
