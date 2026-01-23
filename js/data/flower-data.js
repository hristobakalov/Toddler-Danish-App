export const flowerConfig = {
    // Grid settings
    gridSize: 20,
    cellSize: 25,

    // Flower settings
    initialFlowerSize: 1,  // Start at 1x1 grid cells
    maxFlowerSize: 6,  // Maximum 6x6 grid cells
    flowerGrowthRate: 0.2,  // Grow by 0.2 cells per food eaten
    flowerImages: ['img/flower11.png', 'img/flower22.png'],
    animationSpeed: 200,  // ms per frame

    // Game speed
    initialMoveSpeed: 200,  // Start slower
    minMoveSpeed: 50,  // Maximum speed (faster)
    speedIncreaseRate: 5,  // Decrease delay by 5ms per food eaten

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

    // Bombs
    bombEmoji: '🔴',
    explosionEmoji: '💥',
    bombSpawnInterval: [5000, 10000],  // Random between 5-10 seconds
    bombCountdown: 5000,  // 5 seconds before explosion
    explosionRadius: 2,  // 2x2 explosion area
    explosionDuration: 500,  // ms

    // Food spawning
    maxFoodItems: 8,  // Max food items on field at once

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
