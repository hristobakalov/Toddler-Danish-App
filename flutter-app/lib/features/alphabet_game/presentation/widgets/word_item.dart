import 'package:flutter/material.dart';
import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../core/constants/dimensions.dart';
import '../../domain/entities/word.dart';

class WordItem extends StatefulWidget {
  const WordItem({
    required this.word,
    required this.onTap,
    super.key,
  });

  final Word word;
  final VoidCallback onTap;

  @override
  State<WordItem> createState() => _WordItemState();
}

class _WordItemState extends State<WordItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _spinController;
  late Animation<double> _spinAnimation;

  @override
  void initState() {
    super.initState();
    _spinController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _spinAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _spinController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _spinController.dispose();
    super.dispose();
  }

  void _handleTap() {
    _spinController.forward(from: 0);
    widget.onTap();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _handleTap,
      child: AnimatedBuilder(
        animation: _spinAnimation,
        builder: (context, child) {
          return Transform(
            alignment: Alignment.center,
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateY(_spinAnimation.value * 3.14159 * 2),
            child: child,
          );
        },
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: Dimensions.spacingMedium,
            vertical: Dimensions.spacingSmall,
          ),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(Dimensions.radiusMedium),
            border: Border.all(
              color: AppColors.primary.withOpacity(0.3),
              width: 2,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                widget.word.emoji,
                style: AppTextStyles.emoji.copyWith(fontSize: 32),
              ),
              const SizedBox(width: Dimensions.spacingSmall),
              Text(
                widget.word.text,
                style: AppTextStyles.word.copyWith(fontSize: 24),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
