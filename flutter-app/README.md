# Tøddler - Lær Dansk (Flutter Version)

A Flutter educational app for toddlers learning Danish language through interactive games.

## Project Structure

This Flutter app follows **Clean Architecture** principles with a **feature-first** organization:

```
lib/
├── app/                    # App-level configuration
│   ├── router/            # Navigation
│   └── theme/             # Theming
├── core/                   # Core functionality
│   ├── constants/         # App constants
│   ├── di/                # Dependency injection
│   ├── services/          # Core services (Audio, TTS, Storage)
│   ├── widgets/           # Shared widgets
│   └── utils/             # Utilities
└── features/              # Feature modules (games)
    ├── home/
    ├── alphabet_game/
    ├── colors_game/
    ├── numbers_game/
    ├── sentences_game/
    ├── actions_game/
    ├── box_game/
    ├── letter_tracing_game/
    └── parking_game/
```

Each feature follows the Clean Architecture pattern:
- **data**: Data sources, models, repository implementations
- **domain**: Entities, repository interfaces, use cases
- **presentation**: BLoC, pages, widgets

## Getting Started

### Prerequisites

- Flutter SDK (>= 3.0.0)
- Dart SDK
- iOS Simulator / Android Emulator or physical device

### Installation

1. Install dependencies:
```bash
cd flutter-app
flutter pub get
```

2. Copy assets from the original app:
```bash
# From the project root
cp -r gifs flutter-app/assets/images/
cp -r records flutter-app/assets/audio/
cp -r img flutter-app/assets/images/cars/
cp logo.png flutter-app/assets/images/
```

3. Run the app:
```bash
flutter run
```

### Code Generation

Some packages require code generation (injectable, etc.):

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

## Architecture

### State Management: BLoC Pattern

Each game uses the BLoC (Business Logic Component) pattern for state management:

```dart
// Example: Alphabet Game BLoC
class AlphabetBloc extends Bloc<AlphabetEvent, AlphabetState> {
  // Handle events and emit states
}
```

### Dependency Injection: get_it

All services and dependencies are registered in `core/di/injection_container.dart`:

```dart
final getIt = GetIt.instance;

// Usage in widgets:
final audioService = getIt<AudioService>();
```

### Core Services

1. **AudioService**: Handles audio playback (MP3 files)
2. **TtsService**: Text-to-speech in Danish (da-DK)
3. **StorageService**: Local storage for progress tracking

## Games

### 1. Alphabet Game (Alfabet)
- Letter discovery with word examples
- 29 Danish letters (A-Z + Æ, Ø, Å)
- TTS pronunciation

### 2. Colors Game (Farver)
- Free play + Quiz mode
- 12 Danish colors
- Multiple choice quiz

### 3. Numbers Game (Tal)
- Free play + Quiz mode
- Numbers 0-10 in Danish

### 4. Sentences Game (Sætninger)
- Story playback with word highlighting
- Synchronized audio and text

### 5. Actions Game (Handlinger)
- GIF-based action recognition
- Free play + Quiz mode

### 6. Box Game (Gaveæske)
- Random combination generator
- Number + Color + Animal

### 7. Letter Tracing Game (Tegn Bogstaver)
- Canvas-based drawing
- Progress tracking
- Color picker

### 8. Parking Game (Parkering)
- Grid-based spatial puzzle
- 3 difficulty levels
- Swipe gestures

## Development

### Adding a New Game

1. Create feature folder structure:
```bash
mkdir -p lib/features/my_game/{data,domain,presentation}/{datasources,models,repositories,entities,usecases,bloc,pages,widgets}
```

2. Implement layers (Data → Domain → Presentation)
3. Register dependencies in `injection_container.dart`
4. Add route in `app_router.dart`
5. Add game info in `GameInfo.games` list

### Testing

Run tests:
```bash
flutter test
```

Run tests with coverage:
```bash
flutter test --coverage
```

### Building

For Android:
```bash
flutter build apk --release
```

For iOS:
```bash
flutter build ios --release
```

## Assets

Place assets in the following directories:

- `assets/audio/sentences/` - Sentence audio files
- `assets/audio/actions/` - Action audio files
- `assets/audio/feedback/` - Feedback sounds
- `assets/images/gifs/` - Animated GIFs
- `assets/images/cars/` - Car images for parking game
- `assets/images/` - Logo and other images

## Dependencies

Key dependencies:
- `flutter_bloc` - State management
- `get_it` - Dependency injection
- `go_router` - Navigation
- `just_audio` - Audio playback
- `flutter_tts` - Text-to-speech
- `shared_preferences` - Local storage

See `pubspec.yaml` for complete list.

## Contributing

1. Follow the established architecture pattern
2. Write tests for new features
3. Use proper naming conventions
4. Keep widgets small and focused
5. Document complex logic

## License

[Add license information]

## Original App

This is a Flutter port of the original vanilla JavaScript app. The goal is to maintain feature parity while providing better performance and native mobile experience.
