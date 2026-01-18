import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../app/theme/colors.dart';
import '../../../../app/theme/text_styles.dart';
import '../../../../core/constants/dimensions.dart';
import '../../domain/models/game_info.dart';
import '../widgets/game_card.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Header with logo and title
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(Dimensions.spacingLarge),
                child: Column(
                  children: [
                    const SizedBox(height: Dimensions.spacingMedium),
                    // Logo placeholder (will add actual logo later)
                    Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(60),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text(
                          '👶',
                          style: TextStyle(fontSize: 64),
                        ),
                      ),
                    ),
                    const SizedBox(height: Dimensions.spacingMedium),
                    Text(
                      'Tøddler',
                      style: AppTextStyles.heading1.copyWith(
                        color: AppColors.primary,
                      ),
                    ),
                    const SizedBox(height: Dimensions.spacingSmall),
                    Text(
                      'Lær Dansk',
                      style: AppTextStyles.heading3.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Games grid
            SliverPadding(
              padding: const EdgeInsets.symmetric(
                horizontal: Dimensions.spacingMedium,
                vertical: Dimensions.spacingSmall,
              ),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: Dimensions.getGridCrossAxisCount(context),
                  mainAxisSpacing: Dimensions.spacingMedium,
                  crossAxisSpacing: Dimensions.spacingMedium,
                  childAspectRatio: 0.85,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final game = GameInfo.games[index];
                    return GameCard(
                      game: game,
                      onTap: () {
                        // Navigate to alphabet game, others coming soon
                        if (game.id == 'alphabet') {
                          context.go(game.route);
                        } else {
                          _showComingSoon(context, game.name);
                        }
                      },
                    );
                  },
                  childCount: GameInfo.games.length,
                ),
              ),
            ),

            // Bottom spacing
            const SliverToBoxAdapter(
              child: SizedBox(height: Dimensions.spacingLarge),
            ),
          ],
        ),
      ),
    );
  }

  void _showComingSoon(BuildContext context, String gameName) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          '$gameName kommer snart!',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textOnPrimary,
          ),
        ),
        backgroundColor: AppColors.primary,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 2),
      ),
    );
  }
}
