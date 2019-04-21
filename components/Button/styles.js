import { StyleSheet } from 'react-native';
import { scale } from '../Utils';
import { Color } from '../Style';

const styles = StyleSheet.create({
  container: {
    borderWidth: scale(2),
  },
  label: {
    width: '100%',
    textAlign: 'center',
  },
});

export default styles;