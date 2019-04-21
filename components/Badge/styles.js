import { StyleSheet } from 'react-native';
import { scale } from '../Utils';
import { Color } from '../Style';

const styles = StyleSheet.create({
  bandgeContainer: {
    borderRadius: scale(1000),
    overflow: 'hidden',
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
  },
  bandgeLabel: {
    color: 'white',
    fontSize: scale(24),
  },
  dot: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: scale(1000),
  },
});

export default styles;