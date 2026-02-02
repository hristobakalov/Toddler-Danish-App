// Piano Data Configuration
export const pianoConfig = {
    // Full chromatic octave (C4 to C5) - 13 keys total (8 white + 5 black)
    // Ordered from left to right as they appear on a real piano
    keys: [
        {
            id: 0,
            note: 'C4',
            frequency: 261.63,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 1,
            note: 'C#4',
            frequency: 277.18,
            isBlack: true,
            colorName: 'Sort'
        },
        {
            id: 2,
            note: 'D4',
            frequency: 293.66,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 3,
            note: 'D#4',
            frequency: 311.13,
            isBlack: true,
            colorName: 'Sort'
        },
        {
            id: 4,
            note: 'E4',
            frequency: 329.63,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 5,
            note: 'F4',
            frequency: 349.23,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 6,
            note: 'F#4',
            frequency: 369.99,
            isBlack: true,
            colorName: 'Sort'
        },
        {
            id: 7,
            note: 'G4',
            frequency: 392.00,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 8,
            note: 'G#4',
            frequency: 415.30,
            isBlack: true,
            colorName: 'Sort'
        },
        {
            id: 9,
            note: 'A4',
            frequency: 440.00,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 10,
            note: 'A#4',
            frequency: 466.16,
            isBlack: true,
            colorName: 'Sort'
        },
        {
            id: 11,
            note: 'B4',
            frequency: 493.88,
            isBlack: false,
            colorName: 'Hvid'
        },
        {
            id: 12,
            note: 'C5',
            frequency: 523.25,
            isBlack: false,
            colorName: 'Hvid'
        }
    ],

    // Songs for teaching mode (simple melodies using white keys only)
    songs: [
        {
            name: 'Meget Simpel Melodi',
            notes: [0, 2, 4, 2, 0, 0, 0]  // C-D-E-D-C-C-C (7 notes)
        },
        {
            name: 'Op og Ned',
            notes: [0, 2, 4, 5, 7, 9, 11, 12]  // C-D-E-F-G-A-B-C (ascending scale - 8 notes)
        },
        {
            name: 'Lille Melodi',
            notes: [0, 0, 7, 7, 9, 9, 7]  // C-C-G-G-A-A-G (7 notes)
        }
    ],

    // Mode configurations
    modes: {
        freestyle: {
            name: 'Fri Leg',
            icon: '🎹',
            description: 'Spil frit og udforsk lyde!'
        },
        teaching: {
            name: 'Lær Melodi',
            icon: '🎵',
            description: 'Følg farverne og lær en melodi!'
        }
    }
};
