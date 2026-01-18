import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/services/tts_service.dart';
import '../../domain/usecases/get_alphabet_items.dart';
import 'alphabet_event.dart';
import 'alphabet_state.dart';

class AlphabetBloc extends Bloc<AlphabetEvent, AlphabetState> {
  AlphabetBloc({
    required this.getAlphabetItems,
    required this.ttsService,
  }) : super(const AlphabetInitial()) {
    on<LoadAlphabetItems>(_onLoadAlphabetItems);
    on<LetterCardTapped>(_onLetterCardTapped);
    on<WordTapped>(_onWordTapped);
  }

  final GetAlphabetItems getAlphabetItems;
  final TtsService ttsService;

  Future<void> _onLoadAlphabetItems(
    LoadAlphabetItems event,
    Emitter<AlphabetState> emit,
  ) async {
    emit(const AlphabetLoading());

    try {
      final items = getAlphabetItems();
      emit(AlphabetLoaded(items: items));
    } catch (e) {
      emit(AlphabetError(e.toString()));
    }
  }

  Future<void> _onLetterCardTapped(
    LetterCardTapped event,
    Emitter<AlphabetState> emit,
  ) async {
    if (state is AlphabetLoaded) {
      final currentState = state as AlphabetLoaded;
      final item = currentState.items[event.index];

      // Speak the letter
      await ttsService.speak(item.letter);

      // Mark card as clicked (to show words section)
      final newClickedCards = Set<int>.from(currentState.clickedCards)
        ..add(event.index);

      emit(currentState.copyWith(clickedCards: newClickedCards));
    }
  }

  Future<void> _onWordTapped(
    WordTapped event,
    Emitter<AlphabetState> emit,
  ) async {
    // Speak the word
    await ttsService.speak(event.wordText);
  }
}
