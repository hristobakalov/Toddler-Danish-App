import 'package:go_router/go_router.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/alphabet_game/presentation/pages/alphabet_game_page.dart';

// TODO: Import other game pages as they are created
// import '../../features/colors_game/presentation/pages/colors_free_play_page.dart';
// etc.

class AppRouter {
  static const String home = '/';
  static const String alphabetGame = '/alphabet';
  static const String colorsGame = '/colors';
  static const String colorsQuiz = '/colors/quiz';
  static const String numbersGame = '/numbers';
  static const String numbersQuiz = '/numbers/quiz';
  static const String sentencesGame = '/sentences';
  static const String actionsGame = '/actions';
  static const String actionsQuiz = '/actions/quiz';
  static const String boxGame = '/box';
  static const String letterTracingGame = '/letter-tracing';
  static const String parkingGame = '/parking';

  static final GoRouter router = GoRouter(
    initialLocation: home,
    routes: [
      GoRoute(
        path: home,
        builder: (context, state) => const HomePage(),
      ),

      // Alphabet Game
      GoRoute(
        path: alphabetGame,
        builder: (context, state) => const AlphabetGamePage(),
      ),

      // TODO: Add other game routes as we build them
      // GoRoute(
      //   path: colorsGame,
      //   builder: (context, state) => const ColorsFreePlayPage(),
      // ),
      // GoRoute(
      //   path: colorsQuiz,
      //   builder: (context, state) => const ColorsQuizPage(),
      // ),
      // etc.
    ],

    // Error handling
    errorBuilder: (context, state) => HomePage(),
  );
}
