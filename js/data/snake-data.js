export const snakeConfig = {
    // Grid settings
    gridSize: 20, // 20x20 grid
    cellSize: 25, // pixels per cell

    // Game speed (milliseconds per frame)
    initialSpeed: 230,
    speedIncrement: 5, // Speed increases by 5ms per food eaten
    minSpeed: 80,

    // Snake colors
    snakeColors: [
        { name: 'green', head: '#4CAF50', body: '#66BB6A' },
        { name: 'red', head: '#f44336', body: '#ef5350' },
        { name: 'blue', head: '#2196F3', body: '#42A5F5' }
    ],

    // Rewards/Food items
    rewards: [
        { emoji: '🍎', name: 'Æble', points: 10 },
        { emoji: '🍌', name: 'Banan', points: 10 },
        { emoji: '🍇', name: 'Druer', points: 10 },
        { emoji: '🍓', name: 'Jordbær', points: 10 },
        { emoji: '🍊', name: 'Appelsin', points: 10 },
        { emoji: '🍉', name: 'Vandmelon', points: 10 },
        { emoji: '🍑', name: 'Fersken', points: 10 },
        { emoji: '🍒', name: 'Kirsebær', points: 10 }
    ],

    // Special rewards (appear less frequently)
    specialRewards: [
        { emoji: '⭐', name: 'Stjerne', points: 50 },
        { emoji: '💎', name: 'Diamant', points: 100 }
    ],

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
