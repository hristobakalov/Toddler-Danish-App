import '../../domain/entities/alphabet_item.dart';
import '../../domain/repositories/alphabet_repository.dart';
import '../datasources/alphabet_local_datasource.dart';

class AlphabetRepositoryImpl implements AlphabetRepository {
  AlphabetRepositoryImpl({required this.dataSource});

  final AlphabetLocalDataSource dataSource;

  @override
  List<AlphabetItem> getAlphabetItems() {
    return dataSource.getAlphabetItems();
  }
}
