import { StyleSheet } from 'react-native';
import { scale } from '../Utils';
import { Color } from '../Style';

console.log(StyleSheet);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'white',
    width: '80%',
    marginTop: '-50%',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  title: {
    textAlign: 'center',
    paddingVertical: scale(20),
    fontSize: scale(34),
    color: '#333',
  },
  body: {
    borderTopWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#ddd',
  },
  infoContainer: {
    minHeight: scale(200),
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    textAlign: 'center',
    fontSize: scale(32),
    paddingVertical: scale(20),
    lineHeight: scale(56),
    marginTop: scale(-20),
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: scale(24),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  buttonLabel: {
    textAlign: 'center',
  },
});

export default styles;