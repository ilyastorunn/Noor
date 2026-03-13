/**
 * Centralized image assets mapping
 * Use require() for local assets as per React Native standard
 */

export const OnboardingImages = {
  // Welcome Screen
  welcome: require('./onboarding-illustrations/WelcomeScreen.jpeg'),
  
  // Emotional States (Mood Screen)
  moods: {
    anxious: require('./onboarding-illustrations/Anxious.jpeg'),
    seeking: require('./onboarding-illustrations/Seeking.jpeg'),
    grateful: require('./onboarding-illustrations/Grateful.jpeg'),
    weary: require('./onboarding-illustrations/Weary.jpeg'),
  },
  
  // Goals
  goals: {
    growCloser: require('./onboarding-illustrations/GrowClosertoAllah.jpeg'),
    findPeace: require('./onboarding-illustrations/FindPeace.jpeg'),
    sleepBetter: require('./onboarding-illustrations/SleepBetter.jpeg'),
    focusPrayer: require('./onboarding-illustrations/FocusinPrayer.jpeg'),
    connectQuran: require('./onboarding-illustrations/ConnectwithQuran.jpeg'),
  },
  
  // Content Methods
  methods: {
    meditations: require('./onboarding-illustrations/Meditations.jpeg'),
    stories: require('./onboarding-illustrations/Stories.jpeg'),
    dhikrDua: require('./onboarding-illustrations/Dhikr&Dua.jpeg'),
    quran: require('./onboarding-illustrations/ConnectwithQuran.jpeg'),
  },
};

export default OnboardingImages;
