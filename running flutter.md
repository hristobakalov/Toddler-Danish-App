Quick Start - Running Flutter App on Mac
Step 1: Install Flutter SDK
Download Flutter:


# Using Homebrew (recommended)
brew install --cask flutter

# OR download directly from:
# https://docs.flutter.dev/get-started/install/macos
Add Flutter to PATH (if not using Homebrew):


# Add this to your ~/.zshrc or ~/.bash_profile
export PATH="$PATH:/path/to/flutter/bin"

# Then reload:
source ~/.zshrc
Verify installation:


flutter doctor
Step 2: Install Xcode (for iOS Simulator)
Install Xcode from App Store

Open App Store
Search for "Xcode"
Install (it's free but large, ~15 GB)
Install Xcode Command Line Tools:


sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
Accept Xcode license:


sudo xcodebuild -license accept
Install CocoaPods (for iOS dependencies):


sudo gem install cocoapods
Step 3: Set Up iOS Simulator
Open Simulator:


open -a Simulator
Or from Xcode: Xcode → Open Developer Tool → Simulator

Choose a device (in Simulator menu):

File → Open Simulator → iPhone 15 Pro (or any recent iPhone)
Step 4: Run Your App

# Navigate to your Flutter app
cd /Users/hristo.bakalov/Toddler-Danish-App/flutter-app

# Get dependencies
flutter pub get

# Check available devices
flutter devices

# Run the app
flutter run
Step 5: Verify Everything Works
Run flutter doctor to check your setup:


flutter doctor -v
Expected output:


[✓] Flutter (Channel stable, ...)
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[✓] VS Code (version ...)
Alternative: Use Android Emulator
If you prefer Android or want to test on Android:

Install Android Studio:


brew install --cask android-studio
Open Android Studio:

Go to Settings/Preferences
Appearance & Behavior → System Settings → Android SDK
Install latest SDK
Create AVD (Android Virtual Device):

Tools → Device Manager
Create Virtual Device
Choose Pixel 7 or similar
Download system image (API 33+)
Run:


flutter run
Quick Command Reference

# Install dependencies
flutter pub get

# Run on iOS Simulator
flutter run

# Run on specific device
flutter run -d "iPhone 15 Pro"

# Run on Chrome (web)
flutter run -d chrome

# Hot reload (while app is running)
# Press 'r' in terminal

# Hot restart
# Press 'R' in terminal

# Quit
# Press 'q' in terminal
Recommended IDE Setup
Option 1: VS Code (Lighter)

# Install VS Code
brew install --cask visual-studio-code

# Install Flutter extension
# Open VS Code → Extensions → Search "Flutter" → Install
Option 2: Android Studio (Full-featured)
Already has Flutter/Dart support built-in
Better for complex debugging
Common Issues & Solutions
"Command not found: flutter"

# Check if Flutter is in PATH
echo $PATH | grep flutter

# If not, add it:
export PATH="$PATH:$HOME/flutter/bin"
"CocoaPods not installed"

sudo gem install cocoapods
"Unable to find bundled Java version"

# Install Java
brew install openjdk@11
"iOS deployment target warning"
Open ios/Podfile and set:


platform :ios, '12.0'
Running Your Toddler App Specifically

cd /Users/hristo.bakalov/Toddler-Danish-App/flutter-app

# First time setup
flutter pub get

# Open iOS Simulator
open -a Simulator

# Run the app
flutter run

# You should see:
# - Home screen with 8 game cards
# - Tap "Alfabet" to play the Alphabet Game!
Expected First Run
Dependencies download: ~30 seconds
App builds: 1-2 minutes (first time only)
Simulator launches: App appears
You'll see: Beautiful home screen with game grid
Tap "Alfabet": Opens the Alphabet Game we just built!
Hot Reload Magic ✨
While the app is running:

Change any Dart code
Press r in terminal
See changes instantly (< 1 second)
No need to restart!
Let me know when you have Flutter installed and I can help troubleshoot or continue building more games! 🚀