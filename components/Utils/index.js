import { Dimensions } from 'react-native';

export const scale = (pix) => {
  const { width } = Dimensions.get('window');
  const scale = width / 750;
  return pix * scale;
};