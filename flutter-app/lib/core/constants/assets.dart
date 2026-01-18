class Assets {
  Assets._();

  // Logo
  static const String logo = 'assets/images/logo.png';

  // Audio - Sentences
  static const String audioSentenceMorning = 'assets/audio/sentences/morning.mp3';
  static const String audioSentenceDance = 'assets/audio/sentences/dance.mp3';
  static const String audioSentenceHungry = 'assets/audio/sentences/hungry.mp3';
  static const String audioSentencePee = 'assets/audio/sentences/pee.mp3';
  static const String audioSentenceHelp = 'assets/audio/sentences/help.mp3';
  static const String audioSentenceLove = 'assets/audio/sentences/love.mp3';
  static const String audioSentenceTired = 'assets/audio/sentences/tired.mp3';
  static const String audioSentenceHurt = 'assets/audio/sentences/hurt.mp3';

  // Audio - Actions
  static const String audioActionEating = 'assets/audio/actions/eating.mp3';
  static const String audioActionDrinking = 'assets/audio/actions/drinking.mp3';
  static const String audioActionRunning = 'assets/audio/actions/running.mp3';
  static const String audioActionSleeping = 'assets/audio/actions/sleeping.mp3';
  static const String audioActionBrushing = 'assets/audio/actions/brushing.mp3';
  static const String audioActionHeavy = 'assets/audio/actions/heavy.mp3';
  static const String audioActionPlaying = 'assets/audio/actions/playing.mp3';
  static const String audioActionSad = 'assets/audio/actions/sad.mp3';
  static const String audioActionTraining = 'assets/audio/actions/training.mp3';
  static const String audioActionDrums = 'assets/audio/actions/drums.mp3';

  // Audio - Feedback
  static const String audioCorrect = 'assets/audio/feedback/rigtigt.mp3';
  static const String audioGoodJob = 'assets/audio/feedback/goodjob.mp3';
  static const String audioWhatDoing = 'assets/audio/feedback/what-doing.mp3';

  // Images - GIFs (Sentences)
  static const String gifMorning = 'assets/images/gifs/morning.gif';
  static const String gifDance = 'assets/images/gifs/dance.gif';
  static const String gifHungry = 'assets/images/gifs/hungry.gif';
  static const String gifPee = 'assets/images/gifs/pee.gif';
  static const String gifHelp = 'assets/images/gifs/help.gif';
  static const String gifLove = 'assets/images/gifs/love.gif';
  static const String gifTired = 'assets/images/gifs/tired.gif';
  static const String gifHurt = 'assets/images/gifs/hurt.gif';

  // Images - GIFs (Actions)
  static const String gifEating = 'assets/images/gifs/eating.gif';
  static const String gifDrinking = 'assets/images/gifs/drinking.gif';
  static const String gifRunning = 'assets/images/gifs/running.gif';
  static const String gifSleeping = 'assets/images/gifs/sleeping.gif';
  static const String gifBrushing = 'assets/images/gifs/brushing.gif';
  static const String gifHeavy = 'assets/images/gifs/heavy.gif';
  static const String gifPlaying = 'assets/images/gifs/playing.gif';
  static const String gifSad = 'assets/images/gifs/sad.gif';
  static const String gifTraining = 'assets/images/gifs/training.gif';
  static const String gifDrums = 'assets/images/gifs/drums.gif';

  // Images - Cars
  static const String carGreen = 'assets/images/cars/greencar.png';
  static const String carYellow = 'assets/images/cars/yellowcar.png';
  static const String carRed = 'assets/images/cars/redcar.png';
  static const String carBlue = 'assets/images/cars/bluecar.png';

  // All audio assets for preloading
  static const List<String> allAudioAssets = [
    // Sentences
    audioSentenceMorning,
    audioSentenceDance,
    audioSentenceHungry,
    audioSentencePee,
    audioSentenceHelp,
    audioSentenceLove,
    audioSentenceTired,
    audioSentenceHurt,
    // Actions
    audioActionEating,
    audioActionDrinking,
    audioActionRunning,
    audioActionSleeping,
    audioActionBrushing,
    audioActionHeavy,
    audioActionPlaying,
    audioActionSad,
    audioActionTraining,
    audioActionDrums,
    // Feedback
    audioCorrect,
    audioGoodJob,
    audioWhatDoing,
  ];

  // All image assets for preloading
  static const List<String> allImageAssets = [
    logo,
    // Sentences GIFs
    gifMorning,
    gifDance,
    gifHungry,
    gifPee,
    gifHelp,
    gifLove,
    gifTired,
    gifHurt,
    // Actions GIFs
    gifEating,
    gifDrinking,
    gifRunning,
    gifSleeping,
    gifBrushing,
    gifHeavy,
    gifPlaying,
    gifSad,
    gifTraining,
    gifDrums,
    // Cars
    carGreen,
    carYellow,
    carRed,
    carBlue,
  ];
}
