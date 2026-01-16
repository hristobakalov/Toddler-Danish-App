export const carColors = [
    { name: 'green', image: '/img/greencar.png' },
    { name: 'yellow', image: '/img/yellowcar.png' },
    { name: 'red', image: '/img/redcar.png' },
    { name: 'blue', image: '/img/bluecar.png' }
];

export const levels = [
    {
        level: 1,
        name: 'Let',
        cars: 4,
        gridSize: { rows: 6, cols: 6 },
        parkingSpots: [
            { row: 0, col: 0, color: 'green' },
            { row: 0, col: 5, color: 'yellow' },
            { row: 5, col: 0, color: 'red' },
            { row: 5, col: 5, color: 'blue' }
        ],
        startPositions: [
            { row: 3, col: 2, color: 'green', rotation: 0 },
            { row: 3, col: 3, color: 'yellow', rotation: 0 },
            { row: 2, col: 2, color: 'red', rotation: 0 },
            { row: 2, col: 3, color: 'blue', rotation: 0 }
        ]
    },
    {
        level: 2,
        name: 'Mellem',
        cars: 6,
        gridSize: { rows: 8, cols: 8 },
        parkingSpots: [
            { row: 0, col: 0, color: 'green' },
            { row: 0, col: 3, color: 'yellow' },
            { row: 0, col: 7, color: 'red' },
            { row: 7, col: 0, color: 'blue' },
            { row: 7, col: 3, color: 'green' },
            { row: 7, col: 7, color: 'yellow' }
        ],
        startPositions: [
            { row: 4, col: 2, color: 'green', rotation: 0 },
            { row: 4, col: 3, color: 'yellow', rotation: 0 },
            { row: 4, col: 4, color: 'red', rotation: 0 },
            { row: 3, col: 2, color: 'blue', rotation: 0 },
            { row: 3, col: 3, color: 'green', rotation: 0 },
            { row: 3, col: 4, color: 'yellow', rotation: 0 }
        ]
    },
    {
        level: 3,
        name: 'Svær',
        cars: 8,
        gridSize: { rows: 10, cols: 10 },
        parkingSpots: [
            { row: 0, col: 0, color: 'green' },
            { row: 0, col: 3, color: 'yellow' },
            { row: 0, col: 6, color: 'red' },
            { row: 0, col: 9, color: 'blue' },
            { row: 9, col: 0, color: 'green' },
            { row: 9, col: 3, color: 'yellow' },
            { row: 9, col: 6, color: 'red' },
            { row: 9, col: 9, color: 'blue' }
        ],
        startPositions: [
            { row: 5, col: 3, color: 'green', rotation: 0 },
            { row: 5, col: 4, color: 'yellow', rotation: 0 },
            { row: 5, col: 5, color: 'red', rotation: 0 },
            { row: 5, col: 6, color: 'blue', rotation: 0 },
            { row: 4, col: 3, color: 'green', rotation: 0 },
            { row: 4, col: 4, color: 'yellow', rotation: 0 },
            { row: 4, col: 5, color: 'red', rotation: 0 },
            { row: 4, col: 6, color: 'blue', rotation: 0 }
        ]
    }
];
