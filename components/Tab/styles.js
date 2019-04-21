import { StyleSheet } from 'react-native';
import { scale } from '../Utils';

const styles = StyleSheet.create({
  Tab_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#EEE',
    backgroundColor: 'white',
  },
  Tab_item: {
    position: 'relative',
    borderRightColor: '#eee',
    borderRightWidth: 1,
  },
  Tab_itemText: {
    paddingTop: scale(30),
    paddingBottom: scale(30),
    textAlign: 'center',
  },
  Tab_last: {
    borderRightWidth: 0,
  },
  Tab_activeItem: {
    position: 'absolute',
    bottom: scale(0),
    width: '100%',
    height: scale(10),
    backgroundColor: 'orange',
  },
});

export default styles;