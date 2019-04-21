import { StyleSheet } from 'react-native';
import { scale } from '../Utils';
import { Color } from '../Style';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: scale(40),
    right: scale(40),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toastBox: {
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
  },
  textStyle: {
    fontSize: scale(34),
    color: 'white',
  },
});

export default styles;