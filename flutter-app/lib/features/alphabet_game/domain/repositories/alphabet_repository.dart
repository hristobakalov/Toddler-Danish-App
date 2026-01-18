import '../entities/alphabet_item.dart';

abstract class AlphabetRepository {
  List<AlphabetItem> getAlphabetItems();
}
