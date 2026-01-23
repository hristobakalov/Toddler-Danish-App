# 📷 Camera Game - Kamera Spil

The Camera Game uses AI vision and translation APIs to recognize ANY object in real-time and teach Danish words with high-quality pronunciation.

## Features

- ✅ Opens back camera on mobile devices
- ✅ Takes photos of objects
- ✅ Uses **Google Vision API** to recognize objects
- ✅ **Automatically translates ANY word** to Danish using Google Translate API
- ✅ **High-quality Danish pronunciation** using ElevenLabs AI voice
- ✅ **Smart caching system** - saves translations and audio locally
- ✅ Shows emoji representation of the object
- ✅ Displays confidence level
- ✅ Works offline for cached words

## How It Works

1. **User taps "Åbn Kamera"** - Requests camera permission
2. **Camera opens** - Shows live video feed from back camera
3. **User points at an object and taps capture button** 📸
4. **Photo is sent to Google Vision API** - AI analyzes the image
5. **Object is identified** - Returns English labels with confidence scores
6. **Smart Translation**:
   - First checks local cache (instant! ⚡)
   - Then checks predefined translations
   - Finally uses Google Translate API for new words
7. **High-Quality Audio**:
   - Checks audio cache first (instant!)
   - Generates Danish pronunciation using ElevenLabs AI voice
   - Caches audio for future use
8. **Display & Speech** - Shows Danish word with emoji and speaks it beautifully!

## Supported Objects

**The game can recognize and translate ANY object!** 🎉

Thanks to Google Translate API, the camera game is not limited to predefined words. However, we have 150+ pre-optimized translations for common objects:

### Categories
- 🐕 Animals (dog/hund, cat/kat, bird/fugl, etc.)
- 🍎 Food (apple/æble, banana/banan, etc.)
- 🚗 Vehicles (car/bil, bus/bus, etc.)
- 📚 Objects (book/bog, chair/stol, etc.)
- 🌳 Nature (tree/træ, flower/blomst, etc.)
- 👕 Clothing (shirt/skjorte, pants/bukser, etc.)
- ✋ Body parts (hand/hånd, eye/øje, etc.)

## API Setup

The game uses three APIs, all configured in `.env` and loaded via `js/config.js`:

### 1. Google Cloud Vision API
- **Purpose**: Object recognition from photos
- **Key**: `GOOGLE_VISION_API_KEY`
- **Free tier**: 1,000 requests/month
- **Cost**: Very affordable after free tier

### 2. Google Translate API
- **Purpose**: Translates English object names to Danish
- **Key**: `GOOGLE_TRANSLATION_API_KEY`
- **Free tier**: First 500,000 characters/month are free
- **Cost**: $20 per million characters after

### 3. ElevenLabs Text-to-Speech API
- **Purpose**: High-quality Danish pronunciation
- **Keys**: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL_ID`
- **Free tier**: 10,000 characters/month
- **Cost**: Very affordable paid plans

### Smart Caching = Minimal API Costs
The game caches both **translations** and **audio** locally using `localStorage`:
- First time: Uses all 3 APIs
- Repeat words: Instant playback from cache! ⚡
- Cache persists across sessions
- Typical toddler vocabulary: ~100-200 words = mostly cached after first use!

### Security Note
⚠️ The API key is currently loaded client-side for development. For production:
1. Move API calls to a backend server
2. Keep API key server-side only
3. Add rate limiting to prevent abuse

## Files Structure

```
js/
  ├── data/
  │   └── camera-data.js       # Predefined translations & emoji mappings
  ├── games/
  │   └── camera-game.js       # Main game logic with Vision + Translate + TTS
  ├── utils/
  │   └── cache-manager.js     # Smart caching for translations & audio
  └── config.js                # API key loader (3 APIs)

css/
  └── games/
      └── camera.css           # Game styling

index.html                     # Camera game HTML sections
```

## Caching System

The `CacheManager` class (`js/utils/cache-manager.js`) provides:

### Translation Cache
- Stores English → Danish word pairs
- Persists in `localStorage` under `camera_translations`
- Instant lookup for repeated words

### Audio Cache
- Stores ElevenLabs-generated audio as base64
- Persists in `localStorage` under `camera_audio`
- Includes timestamp for cache management
- Auto-cleanup of entries older than 30 days

### Cache Statistics
Access cache stats in browser console:
```javascript
// In browser console after playing the game:
const game = gameManager.games.camera;
console.log(game.cacheManager.getStats());
// Output: { translations: 45, audioFiles: 45 }
```

### Clear Cache
```javascript
game.cacheManager.clearAll();
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

### Primary: ElevenLabs AI Voice
- **High-quality** natural-sounding Danish
- **Consistent pronunciation** for all words
- **Child-friendly** voice settings
- **Cached** for instant replay

### Fallback: Browser Web Speech
If ElevenLabs fails, uses browser's `speechSynthesis`:
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
