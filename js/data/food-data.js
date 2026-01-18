// Danish food items data
export const danishFoods = [
    {
        id: 'apple',
        name: 'Æble',
        emoji: '🍎',
        audio: 'records/foods/aeble.mp3',
        category: 'fruit'
    },
    {
        id: 'banana',
        name: 'Banan',
        emoji: '🍌',
        audio: 'records/foods/banan.mp3',
        category: 'fruit'
    },
    {
        id: 'bread',
        name: 'Brød',
        emoji: '🍞',
        audio: 'records/foods/broed.mp3',
        category: 'bakery'
    },
    {
        id: 'milk',
        name: 'Mælk',
        emoji: '🥛',
        audio: 'records/foods/maelk.mp3',
        category: 'dairy'
    },
    {
        id: 'cake',
        name: 'Kage',
        emoji: '🍰',
        audio: 'records/foods/kage.mp3',
        category: 'dessert'
    },
    {
        id: 'cheese',
        name: 'Ost',
        emoji: '🧀',
        audio: 'records/foods/ost.mp3',
        category: 'dairy'
    },
    {
        id: 'vegetables',
        name: 'Grøntsager',
        emoji: '🥗',
        audio: 'records/foods/groentsager.mp3',
        category: 'vegetable'
    },
    {
        id: 'pear',
        name: 'Pære',
        emoji: '🍐',
        audio: 'records/foods/paere.mp3',
        category: 'fruit'
    },
    {
        id: 'orange',
        name: 'Appelsin',
        emoji: '🍊',
        audio: 'records/foods/appelsin.mp3',
        category: 'fruit'
    },
    {
        id: 'strawberry',
        name: 'Jordbær',
        emoji: '🍓',
        audio: 'records/foods/jordbaer.mp3',
        category: 'fruit'
    },
    {
        id: 'tomato',
        name: 'Tomat',
        emoji: '🍅',
        audio: 'records/foods/tomat.mp3',
        category: 'vegetable'
    },
    {
        id: 'carrot',
        name: 'Gulerod',
        emoji: '🥕',
        audio: 'records/foods/gulerod.mp3',
        category: 'vegetable'
    },
    {
        id: 'potato',
        name: 'Kartoffel',
        emoji: '🥔',
        audio: 'records/foods/kartoffel.mp3',
        category: 'vegetable'
    },
    {
        id: 'pasta',
        name: 'Pasta',
        emoji: '🍝',
        audio: 'records/foods/pasta.mp3',
        category: 'grain'
    },
    {
        id: 'rice',
        name: 'Ris',
        emoji: '🍚',
        audio: 'records/foods/ris.mp3',
        category: 'grain'
    },
    {
        id: 'fish',
        name: 'Fisk',
        emoji: '🐟',
        audio: 'records/foods/fisk.mp3',
        category: 'protein'
    },
    {
        id: 'meat',
        name: 'Kød',
        emoji: '🍖',
        audio: 'records/foods/koed.mp3',
        category: 'protein'
    },
    {
        id: 'egg',
        name: 'Æg',
        emoji: '🥚',
        audio: 'records/foods/aeg.mp3',
        category: 'protein'
    },
    {
        id: 'yogurt',
        name: 'Yoghurt',
        emoji: '🍦',
        audio: 'records/foods/yoghurt.mp3',
        category: 'dairy'
    },
    {
        id: 'ice-cream',
        name: 'Is',
        emoji: '🍨',
        audio: 'records/foods/is.mp3',
        category: 'dessert'
    }
];

// Helper function to get foods by category
export function getFoodsByCategory(category) {
    return danishFoods.filter(food => food.category === category);
}
