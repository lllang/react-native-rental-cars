import React from 'react';
import {
  Dimensions, Platform
} from 'react-native';

export const scale = pix => {
  const { width } = Dimensions.get('window');
  const scale = width / 750;
  if (pix === 1 && Platform.OS === 'ios') {
    return pix;
  } else {
      return pix * scale;
  }
};

export const pscale = pix => {
  const { width } = Dimensions.get('window');
  const scale = width / 375;
  return pix * scale;
};

export const p = pscale;

export const s = scale;

export const bestScale = pix => {
  const times = 1;
  const { width } = Dimensions.get('window');
  const scale = width / 750;
  return pix * scale * times;
};
