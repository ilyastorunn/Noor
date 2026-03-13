import Constants from 'expo-constants';

const isExpoGo = Constants.executionEnvironment === 'storeClient';

export const firebaseConfigured = !isExpoGo;

export const firebaseConfigErrorMessage = firebaseConfigured
  ? null
  : 'React Native Firebase requires an iOS development build. Expo Go is not supported.';
