import 'package:flutter/material.dart';
import '../../app/theme/colors.dart';
import '../../app/theme/text_styles.dart';

class FeedbackOverlay extends StatefulWidget {
  const FeedbackOverlay({
    required this.isCorrect,
    required this.onDismiss,
    this.duration = const Duration(milliseconds: 1500),
    super.key,
  });

  final bool isCorrect;
  final VoidCallback onDismiss;
  final Duration duration;

  @override
  State<FeedbackOverlay> createState() => _FeedbackOverlayState();
}

class _FeedbackOverlayState extends State<FeedbackOverlay>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _controller.forward();

    // Auto-dismiss after duration
    Future.delayed(widget.duration, () {
      if (mounted) {
        _controller.reverse().then((_) {
          widget.onDismiss();
        });
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        color: widget.isCorrect
            ? AppColors.quizCorrect.withOpacity(0.95)
            : AppColors.quizIncorrect.withOpacity(0.95),
        child: Center(
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  widget.isCorrect ? '👍' : '👎',
                  style: const TextStyle(fontSize: 120),
                ),
                const SizedBox(height: 16),
                Text(
                  widget.isCorrect ? 'Rigtigt!' : 'Prøv igen!',
                  style: AppTextStyles.feedback,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Static method to show the overlay
  static void show(
    BuildContext context, {
    required bool isCorrect,
    Duration duration = const Duration(milliseconds: 1500),
  }) {
    final overlay = OverlayEntry(
      builder: (context) => FeedbackOverlay(
        isCorrect: isCorrect,
        onDismiss: () {},
        duration: duration,
      ),
    );

    Overlay.of(context).insert(overlay);

    Future.delayed(duration + const Duration(milliseconds: 300), () {
      overlay.remove();
    });
  }
}
