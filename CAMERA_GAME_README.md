# 📷 Camera Game - Kamera Spil

The Camera Game uses Google Cloud Vision API to recognize objects in real-time and teach Danish words to toddlers.

## Features

- ✅ Opens back camera on mobile devices
- ✅ Takes photos of objects
- ✅ Uses AI to recognize objects
- ✅ Translates object names to Danish
- ✅ Speaks the Danish word using Text-to-Speech
- ✅ Shows emoji representation of the object
- ✅ Displays confidence level

## How It Works

1. **User taps "Åbn Kamera"** - Requests camera permission
2. **Camera opens** - Shows live video feed from back camera
3. **User points at an object and taps capture button**
4. **Photo is sent to Google Vision API** - AI analyzes the image
5. **Object is identified** - Returns labels with confidence scores
6. **Translation** - Converts English label to Danish
7. **Display & Speech** - Shows Danish word with emoji and speaks it

## Supported Objects

The game recognizes 150+ common objects including:

### Categories
- 🐕 Animals (dog/hund, cat/kat, bird/fugl, etc.)
- 🍎 Food (apple/æble, banana/banan, etc.)
- 🚗 Vehicles (car/bil, bus/bus, etc.)
- 📚 Objects (book/bog, chair/stol, etc.)
- 🌳 Nature (tree/træ, flower/blomst, etc.)
- 👕 Clothing (shirt/skjorte, pants/bukser, etc.)
- ✋ Body parts (hand/hånd, eye/øje, etc.)

## API Setup

The game requires Google Cloud Vision API credentials. The API key is already configured in:
- `.env` file: `GOOGLE_VISION_API_KEY`
- `js/config.js`: Loads the API key into the browser

### API Costs
- **Free tier**: 1,000 requests per month
- **After free tier**: Very affordable pricing
- **No charges** unless you exceed the free quota

### Security Note
⚠️ The API key is currently loaded client-side for development. For production:
1. Move API calls to a backend server
2. Keep API key server-side only
3. Add rate limiting to prevent abuse

## Files Structure

```
js/
  ├── data/
  │   └── camera-data.js       # Translations & emoji mappings
  ├── games/
  │   └── camera-game.js       # Main game logic
  └── config.js                # API key loader

css/
  └── games/
      └── camera.css           # Game styling

index.html                     # Camera game HTML sections
```

## How to Test

1. **Desktop**: Uses front camera (if available)
2. **Mobile**: Uses back camera (recommended)
3. Point at common objects like:
   - Fruits (apples, bananas)
   - Toys
   - Books
   - Furniture
   - Clothing

## Fallback Behavior

If the API:
- Doesn't recognize an object → Shows error message
- Returns unknown label → Tries partial matching
- Is unavailable → Shows friendly error

## Text-to-Speech

Uses browser's built-in `speechSynthesis` API:
- Language: Danish (da-DK)
- Rate: 0.8x (slower for toddlers)
- Pitch: 1.2x (higher for children)

## Future Enhancements

Potential improvements:
- [ ] Gallery of previously captured objects
- [ ] Recording Danish audio files for better pronunciation
- [ ] Offline mode with pre-downloaded common objects
- [ ] Game mode: "Find the [object]" challenges
- [ ] Multiple language support
- [ ] Parent dashboard to track learning progress

## Troubleshooting

**Camera won't open:**
- Check browser permissions
- Ensure HTTPS connection (required for camera access)
- Try different browser (Chrome/Safari recommended)

**Objects not recognized:**
- Ensure good lighting
- Get closer to the object
- Try different angles
- Point at simpler, more common objects

**API errors:**
- Check API key is valid
- Verify internet connection
- Check API quota hasn't been exceeded
