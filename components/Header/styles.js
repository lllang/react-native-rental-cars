import { StyleSheet, Dimensions, Platform } from 'react-native';
import { scale } from '../Utils';
import { Color } from '../Style';

const { width, height } = Dimensions.get('window');

let statusBarHeight = scale(40);
if (Platform.OS === 'ios') {
  if (width === 375 && height === 812) {
    // iPhone X
    statusBarHeight = scale(80);
  }
}

const styles = StyleSheet.create({
  statusBar: { height: statusBarHeight },
  header: {
    backgroundColor: 'white',
    height: scale(100),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth * 3,
    shadowOffset: {
      height: StyleSheet.hairlineWidth * 5,
    },
    elevation: 3,
    position: 'relative',
    zIndex: 2,
  },
  headerButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  title: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: scale(34),
    fontWeight: '700',
  },
  submit: { color: Color.Brand },
});

export default styles;