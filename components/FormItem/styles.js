import { StyleSheet } from 'react-native';
import { scale } from '../Utils';
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  formItemContainer: {
    paddingTop: scale(0),
    paddingBottom: scale(10),
    marginHorizontal: scale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#f2f2f2',
  },
  formLabel: {
    textAlignVertical: 'center',
    color: '#666',
    fontSize: scale(32),
    fontWeight: 'bold',
    marginRight: scale(20),
    paddingTop: scale(30),
    paddingBottom: scale(15),
  },
  formControlContainer: {
    flex: 1,
  },
  formControlContainerInput: {
    color: 'black',
    fontSize: scale(32),
    paddingRight: scale(60),
    paddingVertical: 0,
    textAlign: 'right',
    paddingTop: scale(30),
    paddingBottom: scale(15),
    marginBottom: Platform.OS === 'ios' ? 0 : -scale(10),
  },
  formControlValueContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: scale(30),
    paddingBottom: scale(15),
  },
  formControlValue: {
    color: 'black',
    fontSize: scale(32),
    marginRight: scale(60),
    lineHeight: scale(32),
  },
  formControlPlaceholder: {
    color: '#c5c5c5',
  },
  dropArrow: {
    position: 'absolute',
    top: scale(25),
    right: scale(0),
    width: scale(34),
  },
  red: { color: 'red' },
});

export default styles;
