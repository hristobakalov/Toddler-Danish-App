// Danish clothing items data
// Coordinates are based on the single cloths.png image with Bingo (left) and Bluey (right)
export const danishClothingItems = [
    // Bingo's clothing (left side of image)
    {
        id: 'bingo-blouse',
        name: 'Bluse',
        emoji: '🟢',
        audio: 'records/bluse.mp3',
        character: 'bingo',
        // Position on combined image (percentage from left, top)
        position: { x: 32, y: 70 }
    },
    {
        id: 'bingo-pants',
        name: 'Bukser',
        emoji: '🟢',
        audio: 'records/bukser.mp3',
        character: 'bingo',
        position: { x: 32, y: 80 }
    },
    {
        id: 'bingo-socks',
        name: 'Sokker',
        emoji: '🟢',
        audio: 'records/sokker.mp3',
        character: 'bingo',
        position: { x: 27, y: 90 }
    },

    // Bluey's clothing (right side of image)
    {
        id: 'bluey-hat',
        name: 'Hat',
        emoji: '🟢',
        audio: 'records/hat.mp3',
        character: 'bluey',
        position: { x: 65, y: 22 }
    },
    {
        id: 'bluey-scarf',
        name: 'Tørklæde',
        emoji: '🟢',
        audio: 'records/tørklæde.mp3',
        character: 'bluey',
        position: { x: 65, y: 48 }
    },
    {
        id: 'bluey-jacket',
        name: 'Jakke',
        emoji: '🟢',
        audio: 'records/jakke.mp3',
        character: 'bluey',
        position: { x: 65, y: 58 }
    },
    {
        id: 'bluey-gloves',
        name: 'Handsker',
        emoji: '🟢',
        audio: 'records/handsker.mp3',
        character: 'bluey',
        position: { x: 74, y: 72 }
    },
    {
        id: 'bluey-pants',
        name: 'Bukser',
        emoji: '🟢',
        audio: 'records/bukser.mp3',
        character: 'bluey',
        position: { x: 57, y: 74 }
    },
    {
        id: 'bluey-shoes',
        name: 'Sko',
        emoji: '🟢',
        audio: 'records/sko.mp3',
        character: 'bluey',
        position: { x: 65, y: 87 }
    }
];

// Helper functions to get items by character
export function getBingoClothing() {
    return danishClothingItems.filter(item => item.character === 'bingo');
}

export function getBlueyClothing() {
    return danishClothingItems.filter(item => item.character === 'bluey');
}
