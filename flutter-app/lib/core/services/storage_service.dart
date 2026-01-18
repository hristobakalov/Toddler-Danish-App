import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';

class StorageService {
  StorageService();

  SharedPreferences? _prefs;

  /// Initialize the storage service
  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    debugPrint('StorageService: Initialized');
  }

  /// Save game progress
  Future<bool> saveProgress(String gameId, Map<String, dynamic> data) async {
    try {
      final key = _getProgressKey(gameId);
      final jsonString = jsonEncode(data);
      final result = await _prefs?.setString(key, jsonString);
      debugPrint('StorageService: Saved progress for $gameId');
      return result ?? false;
    } catch (e) {
      debugPrint('Error saving progress for $gameId: $e');
      return false;
    }
  }

  /// Load game progress
  Future<Map<String, dynamic>?> loadProgress(String gameId) async {
    try {
      final key = _getProgressKey(gameId);
      final jsonString = _prefs?.getString(key);

      if (jsonString == null) {
        debugPrint('StorageService: No progress found for $gameId');
        return null;
      }

      final data = jsonDecode(jsonString) as Map<String, dynamic>;
      debugPrint('StorageService: Loaded progress for $gameId');
      return data;
    } catch (e) {
      debugPrint('Error loading progress for $gameId: $e');
      return null;
    }
  }

  /// Clear game progress
  Future<bool> clearProgress(String gameId) async {
    try {
      final key = _getProgressKey(gameId);
      final result = await _prefs?.remove(key);
      debugPrint('StorageService: Cleared progress for $gameId');
      return result ?? false;
    } catch (e) {
      debugPrint('Error clearing progress for $gameId: $e');
      return false;
    }
  }

  /// Clear all progress
  Future<bool> clearAllProgress() async {
    try {
      final keys = _prefs?.getKeys().where((key) => key.startsWith('progress_'));
      if (keys != null) {
        for (final key in keys) {
          await _prefs?.remove(key);
        }
      }
      debugPrint('StorageService: Cleared all progress');
      return true;
    } catch (e) {
      debugPrint('Error clearing all progress: $e');
      return false;
    }
  }

  /// Save a simple value (string)
  Future<bool> saveString(String key, String value) async {
    try {
      final result = await _prefs?.setString(key, value);
      return result ?? false;
    } catch (e) {
      debugPrint('Error saving string: $e');
      return false;
    }
  }

  /// Load a simple value (string)
  String? loadString(String key) {
    return _prefs?.getString(key);
  }

  /// Save an integer
  Future<bool> saveInt(String key, int value) async {
    try {
      final result = await _prefs?.setInt(key, value);
      return result ?? false;
    } catch (e) {
      debugPrint('Error saving int: $e');
      return false;
    }
  }

  /// Load an integer
  int? loadInt(String key) {
    return _prefs?.getInt(key);
  }

  /// Save a boolean
  Future<bool> saveBool(String key, bool value) async {
    try {
      final result = await _prefs?.setBool(key, value);
      return result ?? false;
    } catch (e) {
      debugPrint('Error saving bool: $e');
      return false;
    }
  }

  /// Load a boolean
  bool? loadBool(String key) {
    return _prefs?.getBool(key);
  }

  /// Save a double
  Future<bool> saveDouble(String key, double value) async {
    try {
      final result = await _prefs?.setDouble(key, value);
      return result ?? false;
    } catch (e) {
      debugPrint('Error saving double: $e');
      return false;
    }
  }

  /// Load a double
  double? loadDouble(String key) {
    return _prefs?.getDouble(key);
  }

  /// Check if a key exists
  bool containsKey(String key) {
    return _prefs?.containsKey(key) ?? false;
  }

  /// Remove a key
  Future<bool> remove(String key) async {
    try {
      final result = await _prefs?.remove(key);
      return result ?? false;
    } catch (e) {
      debugPrint('Error removing key: $e');
      return false;
    }
  }

  /// Get the progress key for a game
  String _getProgressKey(String gameId) {
    return 'progress_$gameId';
  }
}
