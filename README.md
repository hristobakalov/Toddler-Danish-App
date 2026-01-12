# 🎨 Dansk Alfabet - Toddler Language Learning App

A mobile-first Danish alphabet learning app designed for toddlers to learn letters and words through interactive cards with text-to-speech functionality.

## Features

- **29 Danish Alphabet Letters** - Complete Danish alphabet including Æ, Ø, and Å
- **Interactive Cards** - Each letter card has a smooth 3D spinning animation
- **Text-to-Speech** - Pronounces letters and words in Danish
- **Two-Stage Learning**:
  1. Click a card to hear the letter pronunciation
  2. Card reveals two words starting with that letter
  3. Click each word to hear it pronounced
- **Mobile-First Design** - Optimized for touch devices and small screens
- **Beautiful Animations** - Smooth transitions and engaging visual feedback
- **PWA (Progressive Web App)** - Install on iPhone/Android as a native app
- **Offline Support** - Works without internet connection once installed
- **Emoji Images** - Colorful, recognizable emoji icons for each word

## How to Use

1. Open `index.html` in a web browser
2. Click on any letter card to hear the letter pronounced
3. The card will spin and reveal two words
4. Click on each word to hear it pronounced
5. Click the letter again to hear it repeated

## Technology

- Pure HTML5, CSS3, and JavaScript
- Web Speech API for text-to-speech
- Responsive grid layout
- CSS animations and transitions

## Browser Compatibility

Works best in modern browsers with Web Speech API support:
- Chrome (recommended for best Danish voice support)
- Safari
- Edge
- Firefox

## Running the App

Simply open `index.html` in your web browser. No build process or server required!

For mobile testing, you can:
- Use browser developer tools to simulate mobile devices
- Host the files on a local server and access from your phone
- Deploy to a web hosting service

## Installing as an iPhone App (PWA)

The app is a Progressive Web App (PWA) and can be installed on your iPhone like a native app:

### Method 1: Install from Safari (iPhone/iPad)

1. **Open the app** in Safari browser
2. Tap the **Share** button (square with arrow pointing up) at the bottom of the screen
3. Scroll down and tap **"Add to Home Screen"**
4. Edit the name if desired (default: "Dansk Alfabet")
5. Tap **"Add"** in the top right corner
6. The app icon will appear on your home screen
7. Tap the icon to open the app - it will run in fullscreen like a native app!

### Method 2: Deploy to a Web Server

For the PWA to work fully (with service worker), you need to:

1. **Deploy to a hosting service** (GitHub Pages, Netlify, Vercel, etc.)
2. **Access via HTTPS** - PWAs require secure connection
3. Follow the installation steps above from Safari

### Quick Deploy Options:

**GitHub Pages:**
```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/dansk-alfabet.git
git push -u origin main

# Enable GitHub Pages in repo settings
# Your app will be at: https://yourusername.github.io/dansk-alfabet/
```

**Netlify Drop:**
1. Go to https://app.netlify.com/drop
2. Drag and drop your project folder
3. Get instant HTTPS URL

### Benefits of Installing as PWA:

- **Home Screen Icon** - Quick access like any other app
- **Full Screen** - No browser UI, looks like a native app
- **Offline Access** - Works without internet after first load
- **Fast Loading** - Cached for instant startup
- **No App Store** - Install directly from web

## Customization

To add or modify words, edit the `danishAlphabet` array in `app.js`.

## Credits

Created for Danish-speaking toddlers to learn their alphabet in a fun, interactive way!
