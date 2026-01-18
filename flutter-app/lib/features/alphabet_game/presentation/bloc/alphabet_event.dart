import 'package:equatable/equatable.dart';

abstract class AlphabetEvent extends Equatable {
  const AlphabetEvent();

  @override
  List<Object?> get props => [];
}

class LoadAlphabetItems extends AlphabetEvent {
  const LoadAlphabetItems();
}

class LetterCardTapped extends AlphabetEvent {
  const LetterCardTapped(this.index);

  final int index;

  @override
  List<Object?> get props => [index];
}

class WordTapped extends AlphabetEvent {
  const WordTapped(this.wordText);

  final String wordText;

  @override
  List<Object?> get props => [wordText];
}
