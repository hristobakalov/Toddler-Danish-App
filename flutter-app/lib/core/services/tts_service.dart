import 'package:flutter_tts/flutter_tts.dart';
import 'package:flutter/foundation.dart';

enum TtsState {
  idle,
  speaking,
  paused,
  stopped,
}

class TtsService {
  TtsService() {
    _flutterTts = FlutterTts();
    _initializeTts();
  }

  late final FlutterTts _flutterTts;
  TtsState _state = TtsState.idle;

  TtsState get state => _state;

  Future<void> _initializeTts() async {
    try {
      // Set language to Danish
      await _flutterTts.setLanguage('da-DK');

      // Set speech rate (0.84 for engagement - faster than normal)
      await _flutterTts.setSpeechRate(0.84);

      // Set pitch (1.2 for toddlers - slightly higher)
      await _flutterTts.setPitch(1.2);

      // Set volume (1.0 = maximum)
      await _flutterTts.setVolume(1.0);

      // Setup handlers
      _flutterTts.setStartHandler(() {
        _state = TtsState.speaking;
        debugPrint('TTS: Started speaking');
      });

      _flutterTts.setCompletionHandler(() {
        _state = TtsState.idle;
        debugPrint('TTS: Completed speaking');
      });

      _flutterTts.setErrorHandler((message) {
        _state = TtsState.idle;
        debugPrint('TTS Error: $message');
      });

      _flutterTts.setPauseHandler(() {
        _state = TtsState.paused;
        debugPrint('TTS: Paused');
      });

      _flutterTts.setContinueHandler(() {
        _state = TtsState.speaking;
        debugPrint('TTS: Continued');
      });

      _flutterTts.setCancelHandler(() {
        _state = TtsState.stopped;
        debugPrint('TTS: Cancelled');
      });

      debugPrint('TTS: Initialized successfully for Danish (da-DK)');
    } catch (e) {
      debugPrint('Error initializing TTS: $e');
    }
  }

  /// Speak text in Danish
  Future<void> speak(String text, {String? language}) async {
    if (text.isEmpty) return;

    try {
      // Stop any ongoing speech
      await stop();

      // Set language if specified (default is da-DK)
      if (language != null) {
        await _flutterTts.setLanguage(language);
      }

      await _flutterTts.speak(text);
    } catch (e) {
      debugPrint('Error speaking text: $e');
    }
  }

  /// Speak and wait for completion
  Future<void> speakAndWait(String text, {String? language}) async {
    if (text.isEmpty) return;

    try {
      await stop();

      if (language != null) {
        await _flutterTts.setLanguage(language);
      }

      await _flutterTts.speak(text);

      // Wait for completion
      while (_state == TtsState.speaking) {
        await Future.delayed(const Duration(milliseconds: 100));
      }
    } catch (e) {
      debugPrint('Error speaking text: $e');
    }
  }

  /// Stop speaking
  Future<void> stop() async {
    try {
      await _flutterTts.stop();
      _state = TtsState.stopped;
    } catch (e) {
      debugPrint('Error stopping TTS: $e');
    }
  }

  /// Pause speaking
  Future<void> pause() async {
    try {
      await _flutterTts.pause();
      _state = TtsState.paused;
    } catch (e) {
      debugPrint('Error pausing TTS: $e');
    }
  }

  /// Set speech rate (0.0 - 1.0, where 0.5 is normal)
  Future<void> setRate(double rate) async {
    try {
      await _flutterTts.setSpeechRate(rate.clamp(0.0, 1.0));
    } catch (e) {
      debugPrint('Error setting rate: $e');
    }
  }

  /// Set pitch (0.5 - 2.0, where 1.0 is normal)
  Future<void> setPitch(double pitch) async {
    try {
      await _flutterTts.setPitch(pitch.clamp(0.5, 2.0));
    } catch (e) {
      debugPrint('Error setting pitch: $e');
    }
  }

  /// Set volume (0.0 - 1.0)
  Future<void> setVolume(double volume) async {
    try {
      await _flutterTts.setVolume(volume.clamp(0.0, 1.0));
    } catch (e) {
      debugPrint('Error setting volume: $e');
    }
  }

  /// Get available languages
  Future<List<String>> getLanguages() async {
    try {
      final languages = await _flutterTts.getLanguages;
      return List<String>.from(languages);
    } catch (e) {
      debugPrint('Error getting languages: $e');
      return [];
    }
  }

  /// Check if a language is available
  Future<bool> isLanguageAvailable(String language) async {
    try {
      final result = await _flutterTts.isLanguageAvailable(language);
      return result == 1;
    } catch (e) {
      debugPrint('Error checking language availability: $e');
      return false;
    }
  }
}
