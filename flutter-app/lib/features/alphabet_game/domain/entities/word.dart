import 'package:equatable/equatable.dart';

class Word extends Equatable {
  const Word({
    required this.text,
    required this.emoji,
  });

  final String text;
  final String emoji;

  @override
  List<Object?> get props => [text, emoji];
}
