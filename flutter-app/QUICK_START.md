# Quick Start Guide

## Prerequisites

Before running this Flutter app, ensure you have:

1. **Flutter SDK** installed (>= 3.0.0)
   - Download from: https://flutter.dev/docs/get-started/install
   - Verify installation: `flutter doctor`

2. **Development Environment**
   - **Android**: Android Studio with Android SDK
   - **iOS**: Xcode (macOS only)
   - **Editor**: VS Code or Android Studio

3. **Device/Emulator**
   - Physical device connected via USB
   - OR Android Emulator running
   - OR iOS Simulator running (macOS only)

## Setup Steps

### 1. Install Flutter Dependencies

```bash
cd flutter-app
flutter pub get
```

### 2. Verify Setup

```bash
flutter doctor
```

Fix any issues reported by `flutter doctor`.

### 3. Check Connected Devices

```bash
flutter devices
```

You should see at least one device listed.

### 4. Run the App

```bash
flutter run
```

Or for a specific device:
```bash
flutter run -d <device-id>
```

## Development Commands

### Hot Reload
While the app is running, press `r` in the terminal to hot reload.

### Hot Restart
Press `R` (capital R) to hot restart (full restart).

### Run Tests
```bash
flutter test
```

### Build APK (Android)
```bash
flutter build apk --release
```

### Build IPA (iOS)
```bash
flutter build ios --release
```

## Project Structure Quick Reference

```
lib/
├── main.dart              # App entry point
├── app/                   # App configuration
├── core/                  # Core services & widgets
└── features/              # Games (to be implemented)
```

## Adding a New Game

1. Create feature folder:
```bash
mkdir -p lib/features/my_game/{data,domain,presentation}/{datasources,models,repositories,entities,usecases,bloc,pages,widgets}
```

2. Implement Clean Architecture layers:
   - Data layer (models, data sources, repositories)
   - Domain layer (entities, use cases)
   - Presentation layer (BLoC, pages, widgets)

3. Register dependencies in `lib/core/di/injection_container.dart`

4. Add route in `lib/app/router/app_router.dart`

5. Update `GameInfo` in `lib/features/home/domain/models/game_info.dart`

## Troubleshooting

### "Command not found: flutter"
- Flutter is not in your PATH
- Follow installation instructions: https://flutter.dev/docs/get-started/install

### "No devices found"
- For Android: Start an emulator in Android Studio
- For iOS: Open Simulator from Xcode
- For physical device: Enable USB debugging and connect device

### "Version solving failed"
- Run `flutter pub get` again
- Try `flutter pub upgrade`
- Check Flutter version: `flutter --version`

### Build errors
- Run `flutter clean`
- Delete `pubspec.lock`
- Run `flutter pub get`

## IDE Setup

### VS Code
1. Install "Flutter" extension
2. Install "Dart" extension
3. Open Command Palette (Cmd/Ctrl+Shift+P)
4. Select "Flutter: Launch Emulator"

### Android Studio
1. Install Flutter plugin
2. Install Dart plugin
3. Restart Android Studio
4. Open project
5. Select device and click Run

## Useful Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Language Tour](https://dart.dev/guides/language/language-tour)
- [Flutter Cookbook](https://flutter.dev/docs/cookbook)
- [BLoC Pattern](https://bloclibrary.dev)

## Next Steps

Once the app is running, start porting games from the original JavaScript app:

1. ✅ Foundation complete
2. 🎯 Port Alphabet Game (recommended first)
3. 🎯 Port Colors Game
4. 🎯 Port Numbers Game
5. 🎯 Continue with remaining games...

---

**Need Help?**
- Check `FLUTTER_ARCHITECTURE.md` for architecture details
- Check `README.md` for project overview
- Check `SETUP_COMPLETE.md` for what's already done
