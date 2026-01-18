import 'package:flutter/material.dart';
import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../core/constants/dimensions.dart';
import '../../domain/entities/alphabet_item.dart';
import 'word_item.dart';

class LetterCard extends StatefulWidget {
  const LetterCard({
    required this.item,
    required this.index,
    required this.isClicked,
    required this.onLetterTap,
    required this.onWordTap,
    super.key,
  });

  final AlphabetItem item;
  final int index;
  final bool isClicked;
  final VoidCallback onLetterTap;
  final Function(String) onWordTap;

  @override
  State<LetterCard> createState() => _LetterCardState();
}

class _LetterCardState extends State<LetterCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _spinController;
  late Animation<double> _spinAnimation;

  @override
  void initState() {
    super.initState();
    _spinController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
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
    widget.onLetterTap();
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
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppColors.cardBackground,
                AppColors.cardBackground.withOpacity(0.8),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(Dimensions.radiusLarge),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(Dimensions.spacingMedium),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Letter Display
                Text(
                  widget.item.letter,
                  style: AppTextStyles.letter.copyWith(fontSize: 80),
                ),

                // Words Section (show after first click)
                AnimatedContainer(
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                  height: widget.isClicked ? null : 0,
                  child: AnimatedOpacity(
                    duration: const Duration(milliseconds: 300),
                    opacity: widget.isClicked ? 1.0 : 0.0,
                    child: widget.isClicked
                        ? Column(
                            children: [
                              const SizedBox(height: Dimensions.spacingMedium),
                              const Divider(color: AppColors.textSecondary),
                              const SizedBox(height: Dimensions.spacingSmall),
                              ...widget.item.words.map(
                                (word) => Padding(
                                  padding: const EdgeInsets.only(
                                    bottom: Dimensions.spacingSmall,
                                  ),
                                  child: WordItem(
                                    word: word,
                                    onTap: () => widget.onWordTap(word.text),
                                  ),
                                ),
                              ),
                            ],
                          )
                        : const SizedBox.shrink(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
