import { AsyncStorage } from 'react-native';

export const getAuth = async () => {
  try {
    const str = await AsyncStorage.getItem('@app:auth');
    return JSON.parse(str) || {};
  } catch (e) {
    // empty

  }
  return {};
};

export const setAuth = async (res) => {
  try {
    await AsyncStorage.setItem('@app:auth', JSON.stringify(res));
  } catch (e) {

  }
};