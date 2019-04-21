/**
 * 常用表单控件
 * 基本参数说明：
 * props: {
 *   label: String                        # 控件的标签
 *   valueChangeListener: Function        # 当值发生变化的时候调用，会把当前的值或者当前选项作为参数传递过去。
 * }
 *
 * 其它参数可能因为控件不同而不同
 */

import Base from './Base';
import Input from './Input';
import Picker from './Picker';
import Selector from './Selector';
import TextArea from './TextArea';
import Static from './Static';
import DatePicker from './DatePicker';

export default {
  Base,
  Input,
  Picker,
  Selector,
  TextArea,
  Static,
  Date: DatePicker,
};
