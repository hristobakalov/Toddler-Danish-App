# Flutter Rearchitecture Plan - Tøddler Danish Learning App

## Executive Summary

This document outlines the architecture for porting the Tøddler Danish learning app from vanilla JavaScript to Flutter, maintaining all existing functionality while introducing modern mobile app architecture patterns.

## Architecture Overview

### Clean Architecture with Feature-First Organization

```
lib/
├── main.dart                          # App entry point
├── app/
│   ├── app.dart                       # Main App widget
│   ├── router/                        # Navigation
│   │   ├── app_router.dart
│   │   └── route_guards.dart
│   └── theme/                         # Theming
│       ├── app_theme.dart
│       ├── colors.dart
│       └── text_styles.dart
├── core/
│   ├── di/                            # Dependency Injection
│   │   └── injection_container.dart
│   ├── constants/                     # App-wide constants
│   │   ├── assets.dart
│   │   └── dimensions.dart
│   ├── services/                      # Core services
│   │   ├── audio_service.dart         # Audio playback
│   │   ├── tts_service.dart           # Text-to-speech (da-DK)
│   │   └── storage_service.dart       # Local storage
│   ├── widgets/                       # Shared widgets
│   │   ├── animated_button.dart
│   │   ├── game_container.dart
│   │   ├── feedback_overlay.dart
│   │   └── loading_indicator.dart
│   └── utils/
│       ├── animation_utils.dart
│       └── extensions.dart
├── features/
│   ├── home/
│   │   ├── presentation/
│   │   │   ├── pages/
│   │   │   │   └── home_page.dart
│   │   │   └── widgets/
│   │   │       └── game_card.dart
│   │   └── domain/
│   │       └── models/
│   │           └── game_info.dart
│   ├── alphabet_game/
│   │   ├── data/
│   │   │   ├── datasources/
│   │   │   │   └── alphabet_local_datasource.dart
│   │   │   ├── models/
│   │   │   │   └── alphabet_item_model.dart
│   │   │   └── repositories/
│   │   │       └── alphabet_repository_impl.dart
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── alphabet_item.dart
│   │   │   ├── repositories/
│   │   │   │   └── alphabet_repository.dart
│   │   │   └── usecases/
│   │   │       └── get_alphabet_items.dart
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   ├── alphabet_bloc.dart
│   │       │   ├── alphabet_event.dart
│   │       │   └── alphabet_state.dart
│   │       ├── pages/
│   │       │   └── alphabet_game_page.dart
│   │       └── widgets/
│   │           ├── letter_card.dart
│   │           └── word_section.dart
│   ├── colors_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   ├── colors_bloc.dart
│   │       │   ├── colors_event.dart
│   │       │   └── colors_state.dart
│   │       ├── pages/
│   │       │   ├── colors_free_play_page.dart
│   │       │   └── colors_quiz_page.dart
│   │       └── widgets/
│   │           ├── color_card.dart
│   │           ├── quiz_countdown.dart
│   │           └── quiz_option.dart
│   ├── numbers_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   ├── sentences_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── bloc/
│   │       │   ├── sentences_bloc.dart
│   │       │   ├── sentences_event.dart
│   │       │   └── sentences_state.dart
│   │       ├── pages/
│   │       │   └── sentences_game_page.dart
│   │       └── widgets/
│   │           ├── sentence_display.dart
│   │           └── word_highlighter.dart
│   ├── actions_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   ├── box_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       └── widgets/
│   │           ├── gift_box.dart
│   │           └── combination_display.dart
│   ├── letter_tracing_game/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   │       ├── bloc/
│   │       ├── pages/
│   │       │   └── tracing_game_page.dart
│   │       └── widgets/
│   │           ├── tracing_canvas.dart
│   │           └── color_picker.dart
│   └── parking_game/
│       ├── data/
│       │   ├── datasources/
│       │   │   └── parking_levels_datasource.dart
│       │   └── models/
│       │       ├── parking_level_model.dart
│       │       └── car_model.dart
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── parking_level.dart
│       │   │   └── car.dart
│       │   └── usecases/
│       │       ├── get_level.dart
│       │       └── move_car.dart
│       └── presentation/
│           ├── bloc/
│           │   ├── parking_bloc.dart
│           │   ├── parking_event.dart
│           │   └── parking_state.dart
│           ├── pages/
│           │   └── parking_game_page.dart
│           └── widgets/
│               ├── parking_grid.dart
│               ├── car_widget.dart
│               └── swipe_detector.dart
└── assets/
    ├── audio/
    │   ├── sentences/
    │   ├── actions/
    │   └── feedback/
    ├── images/
    │   ├── gifs/
    │   └── cars/
    └── fonts/
```

## Architecture Principles

### 1. Clean Architecture
- **Separation of Concerns**: Data, Domain, and Presentation layers
- **Dependency Rule**: Dependencies point inward (Presentation → Domain ← Data)
- **Testability**: Each layer can be tested independently

### 2. Feature-First Organization
- Each game is a self-contained feature module
- Shared code lives in `core/`
- Easy to add/remove games without affecting others

### 3. State Management: BLoC Pattern
- **Why BLoC**:
  - Official Flutter pattern
  - Excellent for complex state (games with quiz modes, progress tracking)
  - Built-in testing support
  - Stream-based, reactive
- **Each game has its own BLoC** for isolated state management

## Core Services

### 1. AudioService
```dart
class AudioService {
  Future<void> play(String path);
  Future<void> stop();
  Future<void> preloadAssets(List<String> paths);
  Stream<AudioState> get audioStream;
}
```

**Features**:
- Preloading for performance
- Background audio handling
- Audio ducking for TTS priority

### 2. TTSService (Text-to-Speech)
```dart
class TTSService {
  Future<void> speak(String text, {String language = 'da-DK'});
  Future<void> setRate(double rate); // 0.84 for engagement
  Future<void> setPitch(double pitch); // 1.2 for toddlers
  Future<void> stop();
}
```

**Features**:
- Danish language support (da-DK)
- Configurable rate and pitch
- Queue management

### 3. StorageService
```dart
class StorageService {
  Future<void> saveProgress(String gameId, Map<String, dynamic> data);
  Future<Map<String, dynamic>?> loadProgress(String gameId);
  Future<void> clearProgress(String gameId);
}
```

**Features**:
- SharedPreferences-based
- Progress tracking per game
- Simple key-value storage

## Key Technical Decisions

### 1. Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter

  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5

  # Dependency Injection
  get_it: ^7.6.0
  injectable: ^2.3.0

  # Audio
  just_audio: ^0.9.36
  flutter_tts: ^3.8.0

  # Navigation
  go_router: ^13.0.0

  # UI
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.0
  lottie: ^2.7.0 (for animations)

  # Canvas Drawing (Letter Tracing)
  flutter_painter: ^1.0.0

  # Utils
  path_provider: ^2.1.1
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter

  # Code Generation
  build_runner: ^2.4.6
  injectable_generator: ^2.4.0

  # Testing
  bloc_test: ^9.1.5
  mocktail: ^1.0.1

  # Linting
  flutter_lints: ^3.0.0
```

### 2. Navigation: go_router
- Type-safe routing
- Deep linking support
- Easy route transitions

### 3. Animations
- **Implicit Animations** for simple effects (card flips, fades)
- **Explicit Animations** for complex interactions (letter tracing feedback)
- **Lottie** for rich animations (gift box opening, success celebrations)

### 4. Assets Management
```dart
// lib/core/constants/assets.dart
class Assets {
  // Audio
  static const String audioSentenceMorning = 'assets/audio/sentences/morning.mp3';
  static const String audioCorrect = 'assets/audio/feedback/rigtigt.mp3';

  // Images
  static const String gifEating = 'assets/images/gifs/eating.gif';
  static const String carGreen = 'assets/images/cars/greencar.png';

  // All assets as lists for preloading
  static const List<String> allAudioAssets = [...];
  static const List<String> allImageAssets = [...];
}
```

## Game-Specific Architecture Details

### Alphabet Game
- **State**: List of letters, current selected letter, expanded state
- **Widgets**: FlipCard animation, word reveal
- **TTS**: Letter pronunciation + word pronunciation

### Colors & Numbers Games
- **State**: Free play mode vs Quiz mode, current question, score, timer
- **Widgets**: Countdown (3-2-1-Go), Quiz options grid, feedback overlay
- **Transitions**: Mode switching with animations

### Sentences Game
- **State**: Current sentence index, playback progress, highlighted word
- **Widgets**: GIF display, animated word highlighter
- **Challenge**: Sync word highlighting with audio (AudioPlayer position listener)

### Actions Game
- **State**: Free play vs Quiz, current action, quiz options
- **Widgets**: GIF cards, quiz overlay, emoji feedback

### Box Game
- **State**: Current combination (number + color + animal), gift counter
- **Widgets**: Animated gift box, combination display with tap zones
- **Logic**: Random combination generator

### Letter Tracing Game
- **State**: Current letter, drawing progress (%), color selection
- **Widgets**: Custom painter for letter outline, gesture detector
- **Challenge**: Hit detection (drawing inside letter bounds)
- **Canvas**: CustomPainter + GestureDetector

### Parking Game
- **State**: Grid, car positions, active car, level, parked count
- **Widgets**: Grid layout, car widget with rotation, swipe detector
- **Challenge**: Movement logic, collision detection, swipe gestures
- **Input**: Keyboard (desktop) + Swipe gestures (mobile)

## Testing Strategy

### Unit Tests
- Domain layer: Entities, use cases
- Data layer: Repositories, data sources
- BLoCs: Event → State transformations

### Widget Tests
- Individual widgets (cards, buttons, overlays)
- Page layouts

### Integration Tests
- Complete game flows
- Quiz mode end-to-end
- Progress persistence

## Performance Optimizations

### 1. Asset Preloading
- Preload audio and images on app startup
- Show loading screen during preload

### 2. Efficient Rendering
- `const` constructors wherever possible
- `RepaintBoundary` for canvas-heavy widgets
- Lazy loading for game pages

### 3. Memory Management
- Dispose controllers properly
- Cancel timers and streams
- Clear large assets when switching games

## Responsive Design

### Screen Size Handling
```dart
// lib/core/constants/dimensions.dart
class Dimensions {
  static double getCardWidth(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width < 600 ? width * 0.9 : 400;
  }
}
```

### Orientation Support
- Portrait primary (locked for games)
- Landscape support for tablets (optional)

## Accessibility

### 1. Semantic Labels
- All interactive elements have semantic labels
- Screen reader support

### 2. Large Touch Targets
- Minimum 48x48 logical pixels
- Toddler-friendly spacing

### 3. High Contrast Mode
- Respect system accessibility settings
- Ensure color contrast ratios

## Data Migration

### Existing Data Files → Dart Models

**Before (JavaScript):**
```javascript
// js/data/alphabet-data.js
export const alphabetData = [
  { letter: 'A', words: [{ text: 'Abe', emoji: '🐵' }] }
];
```

**After (Flutter):**
```dart
// features/alphabet_game/data/datasources/alphabet_local_datasource.dart
class AlphabetLocalDataSource {
  List<AlphabetItemModel> getAlphabetItems() {
    return [
      AlphabetItemModel(
        letter: 'A',
        words: [WordModel(text: 'Abe', emoji: '🐵')],
      ),
    ];
  }
}
```

## Development Phases

### Phase 1: Foundation (Week 1)
1. Create Flutter project
2. Set up folder structure
3. Implement core services (Audio, TTS, Storage)
4. Create shared widgets
5. Set up dependency injection
6. Implement navigation

### Phase 2: Simple Games (Week 2)
1. Port Alphabet Game
2. Port Colors Game (Free Play only first)
3. Port Numbers Game (Free Play only first)

### Phase 3: Quiz Modes (Week 3)
1. Implement Colors Quiz mode
2. Implement Numbers Quiz mode
3. Create reusable quiz components

### Phase 4: Media-Heavy Games (Week 4)
1. Port Sentences Game
2. Port Actions Game
3. Optimize audio/video loading

### Phase 5: Complex Games (Week 5)
1. Port Box Game
2. Port Letter Tracing Game (canvas work)

### Phase 6: Advanced Games (Week 6)
1. Port Parking Game (grid logic + gestures)

### Phase 7: Polish & Testing (Week 7)
1. Integration testing
2. Performance optimization
3. UI/UX refinements
4. Bug fixes

## Migration Strategy

### One-by-one Game Porting Process

For each game:

1. **Create feature folder structure**
2. **Port data models** (data/models/)
3. **Create entities** (domain/entities/)
4. **Implement repository** (data/repositories/ + domain/repositories/)
5. **Create use cases** (domain/usecases/)
6. **Build BLoC** (presentation/bloc/)
7. **Create widgets** (presentation/widgets/)
8. **Build page** (presentation/pages/)
9. **Add to navigation**
10. **Test thoroughly**
11. **Update home page**

## Quality Checklist (Per Game)

- [ ] All original features work
- [ ] Audio plays correctly
- [ ] TTS works with Danish locale
- [ ] Animations are smooth
- [ ] Touch targets are large enough
- [ ] Works on various screen sizes
- [ ] No memory leaks
- [ ] Unit tests pass
- [ ] Widget tests pass
- [ ] Integration tests pass

## Additional Considerations

### 1. Analytics
- Firebase Analytics for usage tracking
- Event tracking for game completions

### 2. Crash Reporting
- Firebase Crashlytics
- Error boundary widgets

### 3. Performance Monitoring
- Flutter DevTools
- FPS monitoring

### 4. Localization (Future)
- Easy to add more languages
- Use `flutter_localizations`

### 5. Offline Support
- All games work offline by default
- Assets bundled with app

## Success Metrics

1. **Feature Parity**: All 8 games work identically to JS version
2. **Performance**: 60 FPS during gameplay
3. **Load Time**: App ready in < 3 seconds
4. **Bundle Size**: APK < 50MB
5. **Test Coverage**: > 80% code coverage

## Next Steps

1. Get architecture approval
2. Create new Flutter project
3. Start Phase 1 (Foundation)
4. Port games one by one

---

**Document Version**: 1.0
**Last Updated**: 2026-01-16
**Status**: Awaiting Approval
