export const temperatureConfig = {
    // Default starting temperature
    defaultTemp: 15,

    // Min and max temperature
    minTemp: 0,
    maxTemp: 40,

    // Temperature step when adjusting
    step: 1,

    // Temperature levels with ranges, labels, colors, and audio
    levels: [
        {
            id: 'cold',
            range: [0, 10],
            label: 'Koldt',
            emoji: '🧊',
            color: '#3b82f6', // Light blue
            bgColor: '#e0f2fe',
            audio: 'records/temperature/koldt.mp3'
        },
        {
            id: 'pleasant',
            range: [10, 20],
            label: 'Behageligt',
            emoji: '😊',
            color: '#22c55e', // Green
            bgColor: '#dcfce7',
            audio: 'records/temperature/behageligt.mp3'
        },
        {
            id: 'mild',
            range: [20, 25],
            label: 'Lunt',
            emoji: '☀️',
            color: '#eab308', // Yellow
            bgColor: '#fef9c3',
            audio: 'records/temperature/lunt.mp3'
        },
        {
            id: 'warm',
            range: [25, 30],
            label: 'Varmt',
            emoji: '🌤️',
            color: '#f97316', // Orange
            bgColor: '#ffedd5',
            audio: 'records/temperature/varmt.mp3'
        },
        {
            id: 'very-warm',
            range: [30, 35],
            label: 'Meget varmt',
            emoji: '🔥',
            color: '#ea580c', // Deep orange
            bgColor: '#fed7aa',
            audio: 'records/temperature/meget_varmt.mp3'
        },
        {
            id: 'hot',
            range: [35, 40],
            label: 'Hedt',
            emoji: '🥵',
            color: '#dc2626', // Red
            bgColor: '#fecaca',
            audio: 'records/temperature/hedt.mp3'
        },
        {
            id: 'very-hot',
            range: [40, Infinity],
            label: 'Meget hedt',
            emoji: '🔥🔥',
            color: '#991b1b', // Dark red
            bgColor: '#fca5a5',
            audio: 'records/temperature/meget_hedt.mp3'
        }
    ],

    // Get the appropriate level for a temperature
    getLevel(temperature) {
        return this.levels.find(level =>
            temperature >= level.range[0] && temperature < level.range[1]
        ) || this.levels[3]; // Default to pleasant
    },

    // Calculate mercury height percentage (0-100)
    getMercuryHeight(temperature) {
        const range = this.maxTemp - this.minTemp;
        const position = temperature - this.minTemp;
        return Math.max(0, Math.min(100, (position / range) * 100));
    }
};
