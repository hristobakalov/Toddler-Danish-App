// Node.js script to generate PWA icons
// Run with: node generate-icons.js

const fs = require('fs');

function generateIconSVG(size) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FFD93D;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#FF6B6B;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#4ECDC4;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#bg)" rx="${size * 0.1}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${size * 0.35}" fill="white"/>
        <text x="${size/2}" y="${size/2}" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="#667eea" font-family="Arial, sans-serif">A</text>
        <text x="${size/2}" y="${size * 0.75}" font-size="${size * 0.12}" text-anchor="middle" dominant-baseline="middle" font-family="Arial, sans-serif">🎨</text>
    </svg>`;
}

// Generate 192x192 icon
fs.writeFileSync('icon-192.svg', generateIconSVG(192));
console.log('Created icon-192.svg');

// Generate 512x512 icon
fs.writeFileSync('icon-512.svg', generateIconSVG(512));
console.log('Created icon-512.svg');

console.log('\nSVG icons created successfully!');
console.log('To convert to PNG, you can:');
console.log('1. Open create-icons.html in a browser and download the PNG files');
console.log('2. Use an online converter like https://svgtopng.com/');
console.log('3. Use ImageMagick: convert icon-192.svg icon-192.png');
