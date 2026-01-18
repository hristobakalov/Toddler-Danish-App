import 'package:get_it/get_it.dart';
import '../services/audio_service.dart';
import '../services/tts_service.dart';
import '../services/storage_service.dart';

final getIt = GetIt.instance;

Future<void> setupDependencies() async {
  // Core Services (Singletons)
  getIt.registerLazySingleton<AudioService>(() => AudioService());
  getIt.registerLazySingleton<TtsService>(() => TtsService());

  // Storage Service (needs initialization)
  final storageService = StorageService();
  await storageService.init();
  getIt.registerSingleton<StorageService>(storageService);

  // TODO: Register game repositories as we build them
  // Example:
  // getIt.registerLazySingleton<AlphabetRepository>(
  //   () => AlphabetRepositoryImpl(
  //     dataSource: AlphabetLocalDataSource(),
  //   ),
  // );

  // TODO: Register game use cases
  // Example:
  // getIt.registerLazySingleton<GetAlphabetItems>(
  //   () => GetAlphabetItems(repository: getIt()),
  // );

  // TODO: Register BLoCs as factories (new instance each time)
  // Example:
  // getIt.registerFactory<AlphabetBloc>(
  //   () => AlphabetBloc(
  //     getAlphabetItems: getIt(),
  //     ttsService: getIt(),
  //   ),
  // );
}

/// Helper to get dependencies
T inject<T extends Object>() => getIt<T>();
