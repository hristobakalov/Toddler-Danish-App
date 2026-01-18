class GameInfo {
  const GameInfo({
    required this.id,
    required this.name,
    required this.description,
    required this.emoji,
    required this.route,
    required this.color,
  });

  final String id;
  final String name;
  final String description;
  final String emoji;
  final String route;
  final int color; // Color value as int

  static const List<GameInfo> games = [
    GameInfo(
      id: 'alphabet',
      name: 'Alfabet',
      description: 'Lær bogstaverne',
      emoji: '🔤',
      route: '/alphabet',
      color: 0xFFFF6B6B,
    ),
    GameInfo(
      id: 'colors',
      name: 'Farver',
      description: 'Lær farverne',
      emoji: '🎨',
      route: '/colors',
      color: 0xFF4ECDC4,
    ),
    GameInfo(
      id: 'numbers',
      name: 'Tal',
      description: 'Lær tallene',
      emoji: '🔢',
      route: '/numbers',
      color: 0xFFFFD93D,
    ),
    GameInfo(
      id: 'sentences',
      name: 'Sætninger',
      description: 'Lær sætninger',
      emoji: '💬',
      route: '/sentences',
      color: 0xFF95E1D3,
    ),
    GameInfo(
      id: 'actions',
      name: 'Handlinger',
      description: 'Lær handlinger',
      emoji: '🏃',
      route: '/actions',
      color: 0xFFF38181,
    ),
    GameInfo(
      id: 'box',
      name: 'Gaveæske',
      description: 'Åbn gaver',
      emoji: '🎁',
      route: '/box',
      color: 0xFFAA96DA,
    ),
    GameInfo(
      id: 'tracing',
      name: 'Tegn Bogstaver',
      description: 'Tegn bogstaverne',
      emoji: '✏️',
      route: '/letter-tracing',
      color: 0xFFFCBAD3,
    ),
    GameInfo(
      id: 'parking',
      name: 'Parkering',
      description: 'Parker bilerne',
      emoji: '🚗',
      route: '/parking',
      color: 0xFFA8E6CF,
    ),
  ];
}
