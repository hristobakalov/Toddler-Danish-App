import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // Primary colors (from original app)
  static const Color primary = Color(0xFFFF6B6B); // Coral red
  static const Color secondary = Color(0xFFFFD93D); // Golden yellow
  static const Color accent = Color(0xFF6BCF7F); // Soft green

  // Background colors
  static const Color background = Color(0xFFFFF8E7); // Light cream
  static const Color surface = Color(0xFFFFFFFF); // White
  static const Color cardBackground = Color(0xFFFFF3DC); // Light yellow

  // Feedback colors
  static const Color success = Color(0xFF4CAF50); // Green
  static const Color error = Color(0xFFF44336); // Red
  static const Color warning = Color(0xFFFF9800); // Orange
  static const Color info = Color(0xFF2196F3); // Blue

  // Text colors
  static const Color textPrimary = Color(0xFF333333);
  static const Color textSecondary = Color(0xFF666666);
  static const Color textOnPrimary = Color(0xFFFFFFFF);

  // Game-specific colors
  static const Color quizCorrect = Color(0xFF81C784); // Light green
  static const Color quizIncorrect = Color(0xFFE57373); // Light red
  static const Color countdown = Color(0xFFFFD93D); // Yellow

  // Danish colors (for Colors Game)
  static const Map<String, Color> danishColors = {
    'Rød': Color(0xFFFF0000),
    'Blå': Color(0xFF0000FF),
    'Grøn': Color(0xFF00FF00),
    'Gul': Color(0xFFFFFF00),
    'Orange': Color(0xFFFFA500),
    'Lilla': Color(0xFF800080),
    'Pink': Color(0xFFFFC0CB),
    'Brun': Color(0xFF8B4513),
    'Grå': Color(0xFF808080),
    'Sort': Color(0xFF000000),
    'Hvid': Color(0xFFFFFFFF),
    'Lyserød': Color(0xFFFFB6C1),
  };

  // Parking game colors
  static const Color parkingGreen = Color(0xFF4CAF50);
  static const Color parkingYellow = Color(0xFFFFEB3B);
  static const Color parkingRed = Color(0xFFF44336);
  static const Color parkingBlue = Color(0xFF2196F3);
}
