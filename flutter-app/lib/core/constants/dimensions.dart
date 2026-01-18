import 'package:flutter/material.dart';

class Dimensions {
  Dimensions._();

  // Touch targets (toddler-friendly)
  static const double minTouchTarget = 64.0;
  static const double largeTouchTarget = 80.0;

  // Spacing
  static const double spacingXSmall = 4.0;
  static const double spacingSmall = 8.0;
  static const double spacingMedium = 16.0;
  static const double spacingLarge = 24.0;
  static const double spacingXLarge = 32.0;

  // Border radius
  static const double radiusSmall = 8.0;
  static const double radiusMedium = 16.0;
  static const double radiusLarge = 24.0;
  static const double radiusXLarge = 32.0;

  // Card sizes
  static double getCardWidth(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 600) {
      return width * 0.9;
    } else if (width < 900) {
      return width * 0.7;
    } else {
      return 600;
    }
  }

  static double getCardHeight(BuildContext context) {
    final height = MediaQuery.of(context).size.height;
    if (height < 700) {
      return height * 0.25;
    } else {
      return 200;
    }
  }

  // Grid layout
  static int getGridCrossAxisCount(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    if (width < 600) {
      return 2;
    } else if (width < 900) {
      return 3;
    } else {
      return 4;
    }
  }

  // Canvas (Letter Tracing)
  static const double canvasHeight = 350.0;
  static const double strokeWidth = 20.0;
}
