import { createIconSet } from 'react-native-vector-icons';
import DIconJson from './Dior.json';
import { scale } from '../Utils';

const DiorIcon = createIconSet(DIconJson, 'Dior', 'Dior.ttf');

DiorIcon.defaultProps = {
  size: scale(40),
}

export default DiorIcon;
