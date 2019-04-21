import { StyleSheet } from 'react-native';
import { scale } from '../Utils';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#ddd',
  },
  headerLabel: {
    fontSize: scale(38),
    fontWeight: '700',
    color: '#333',
  },
  actionButton: {
    paddingHorizontal: scale(40),
  },
  actionLabel: {
    paddingVertical: scale(40),
    fontSize: scale(32),
  },
  body: {
    maxHeight: scale(600),
    paddingBottom: scale(50),
  },
  optionContianer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(24),
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#eee',
    paddingHorizontal: scale(40),
  },
  optionLabel: {
    fontSize: scale(34),
  },
  check: {
    borderWidth: 2,
    borderColor: '#aaa',
    fontSize: scale(34),
    borderRadius: scale(6),
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  activeCheck: {
    color: '#14D0B4',
    borderColor: '#14D0B4',
  },
});

export default styles;