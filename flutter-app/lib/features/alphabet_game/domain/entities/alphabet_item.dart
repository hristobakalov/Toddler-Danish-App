import 'package:equatable/equatable.dart';
import 'word.dart';

class AlphabetItem extends Equatable {
  const AlphabetItem({
    required this.letter,
    required this.words,
  });

  final String letter;
  final List<Word> words;

  @override
  List<Object?> get props => [letter, words];
}
