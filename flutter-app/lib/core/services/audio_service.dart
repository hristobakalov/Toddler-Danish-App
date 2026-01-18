import 'dart:async';
import 'package:just_audio/just_audio.dart';
import 'package:flutter/foundation.dart';

enum AudioState {
  idle,
  loading,
  playing,
  paused,
  stopped,
  error,
}

class AudioService {
  AudioService() {
    _player = AudioPlayer();
    _setupPlayerListeners();
  }

  late final AudioPlayer _player;
  AudioState _state = AudioState.idle;
  final Map<String, Duration> _preloadedDurations = {};

  AudioState get state => _state;
  Stream<AudioState> get stateStream => _stateController.stream;
  final _stateController = StreamController<AudioState>.broadcast();

  void _setupPlayerListeners() {
    _player.playerStateStream.listen((playerState) {
      if (playerState.processingState == ProcessingState.completed) {
        _updateState(AudioState.idle);
      }
    });
  }

  void _updateState(AudioState newState) {
    _state = newState;
    _stateController.add(newState);
  }

  /// Play an audio file from assets
  Future<void> play(String assetPath) async {
    try {
      _updateState(AudioState.loading);
      await _player.setAsset(assetPath);
      await _player.play();
      _updateState(AudioState.playing);
    } catch (e) {
      debugPrint('Error playing audio: $e');
      _updateState(AudioState.error);
    }
  }

  /// Play audio and wait for completion
  Future<void> playAndWait(String assetPath) async {
    try {
      _updateState(AudioState.loading);
      await _player.setAsset(assetPath);
      await _player.play();
      _updateState(AudioState.playing);

      // Wait for audio to complete
      await _player.processingStateStream
          .firstWhere((state) => state == ProcessingState.completed);

      _updateState(AudioState.idle);
    } catch (e) {
      debugPrint('Error playing audio: $e');
      _updateState(AudioState.error);
    }
  }

  /// Pause playback
  Future<void> pause() async {
    await _player.pause();
    _updateState(AudioState.paused);
  }

  /// Resume playback
  Future<void> resume() async {
    await _player.play();
    _updateState(AudioState.playing);
  }

  /// Stop playback
  Future<void> stop() async {
    await _player.stop();
    _updateState(AudioState.stopped);
  }

  /// Seek to a specific position
  Future<void> seek(Duration position) async {
    await _player.seek(position);
  }

  /// Get current position
  Duration get currentPosition => _player.position;

  /// Get duration
  Duration? get duration => _player.duration;

  /// Stream of position updates
  Stream<Duration> get positionStream => _player.positionStream;

  /// Preload multiple assets for faster playback
  Future<void> preloadAssets(List<String> assetPaths) async {
    for (final path in assetPaths) {
      try {
        final tempPlayer = AudioPlayer();
        await tempPlayer.setAsset(path);
        _preloadedDurations[path] = tempPlayer.duration ?? Duration.zero;
        await tempPlayer.dispose();
      } catch (e) {
        debugPrint('Error preloading asset $path: $e');
      }
    }
  }

  /// Set volume (0.0 to 1.0)
  Future<void> setVolume(double volume) async {
    await _player.setVolume(volume.clamp(0.0, 1.0));
  }

  /// Dispose resources
  Future<void> dispose() async {
    await _stateController.close();
    await _player.dispose();
  }
}
