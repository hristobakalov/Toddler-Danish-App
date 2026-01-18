import 'package:equatable/equatable.dart';
import '../../domain/entities/alphabet_item.dart';

abstract class AlphabetState extends Equatable {
  const AlphabetState();

  @override
  List<Object?> get props => [];
}

class AlphabetInitial extends AlphabetState {
  const AlphabetInitial();
}

class AlphabetLoading extends AlphabetState {
  const AlphabetLoading();
}

class AlphabetLoaded extends AlphabetState {
  const AlphabetLoaded({
    required this.items,
    this.clickedCards = const {},
  });

  final List<AlphabetItem> items;
  final Set<int> clickedCards; // Track which cards have been clicked

  AlphabetLoaded copyWith({
    List<AlphabetItem>? items,
    Set<int>? clickedCards,
  }) {
    return AlphabetLoaded(
      items: items ?? this.items,
      clickedCards: clickedCards ?? this.clickedCards,
    );
  }

  @override
  List<Object?> get props => [items, clickedCards];
}

class AlphabetError extends AlphabetState {
  const AlphabetError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
