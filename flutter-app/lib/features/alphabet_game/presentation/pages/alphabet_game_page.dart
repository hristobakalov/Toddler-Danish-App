import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/dimensions.dart';
import '../../../../core/di/injection_container.dart';
import '../../../../core/widgets/game_container.dart';
import '../../../../core/widgets/loading_indicator.dart';
import '../../data/datasources/alphabet_local_datasource.dart';
import '../../data/repositories/alphabet_repository_impl.dart';
import '../../domain/usecases/get_alphabet_items.dart';
import '../bloc/alphabet_bloc.dart';
import '../bloc/alphabet_event.dart';
import '../bloc/alphabet_state.dart';
import '../widgets/letter_card.dart';

class AlphabetGamePage extends StatelessWidget {
  const AlphabetGamePage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AlphabetBloc(
        getAlphabetItems: GetAlphabetItems(
          repository: AlphabetRepositoryImpl(
            dataSource: AlphabetLocalDataSource(),
          ),
        ),
        ttsService: inject(),
      )..add(const LoadAlphabetItems()),
      child: const AlphabetGameView(),
    );
  }
}

class AlphabetGameView extends StatelessWidget {
  const AlphabetGameView({super.key});

  @override
  Widget build(BuildContext context) {
    return GameContainer(
      title: 'Alfabet',
      child: BlocBuilder<AlphabetBloc, AlphabetState>(
        builder: (context, state) {
          if (state is AlphabetLoading) {
            return const LoadingIndicator(message: 'Indlæser bogstaver...');
          }

          if (state is AlphabetError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Noget gik galt 😞',
                    style: TextStyle(fontSize: 24),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    state.message,
                    style: const TextStyle(fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            );
          }

          if (state is AlphabetLoaded) {
            return GridView.builder(
              padding: const EdgeInsets.all(Dimensions.spacingSmall),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: Dimensions.getGridCrossAxisCount(context),
                mainAxisSpacing: Dimensions.spacingMedium,
                crossAxisSpacing: Dimensions.spacingMedium,
                childAspectRatio: 0.75,
              ),
              itemCount: state.items.length,
              itemBuilder: (context, index) {
                final item = state.items[index];
                final isClicked = state.clickedCards.contains(index);

                return LetterCard(
                  item: item,
                  index: index,
                  isClicked: isClicked,
                  onLetterTap: () {
                    context.read<AlphabetBloc>().add(
                          LetterCardTapped(index),
                        );
                  },
                  onWordTap: (wordText) {
                    context.read<AlphabetBloc>().add(
                          WordTapped(wordText),
                        );
                  },
                );
              },
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }
}
