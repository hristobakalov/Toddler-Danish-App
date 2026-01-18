import '../entities/alphabet_item.dart';
import '../repositories/alphabet_repository.dart';

class GetAlphabetItems {
  GetAlphabetItems({required this.repository});

  final AlphabetRepository repository;

  List<AlphabetItem> call() {
    return repository.getAlphabetItems();
  }
}
