import 'package:flutter/material.dart';
import '../../app/theme/colors.dart';
import '../constants/dimensions.dart';

class GameContainer extends StatelessWidget {
  const GameContainer({
    required this.child,
    this.title,
    this.showBackButton = true,
    this.actions,
    this.backgroundColor = AppColors.background,
    super.key,
  });

  final Widget child;
  final String? title;
  final bool showBackButton;
  final List<Widget>? actions;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: title != null
          ? AppBar(
              title: Text(title!),
              automaticallyImplyLeading: showBackButton,
              actions: actions,
            )
          : null,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(Dimensions.spacingMedium),
          child: child,
        ),
      ),
    );
  }
}
