## Picker

### 使用方式

```jsx
import React, {Component} from 'react';
import { View } from 'react-native';
import { Button, Picker } from 'dior';

class App extends Component {

  onButtonPress() {
    this.refs.picker.show({
      title: '请选择',
      multi: true,
      withAll: false, 
      options: [
        { label: '宝马', value: 1 },
        { label: '奥迪', value: 2 },
        { label: '兰博基尼', value: 3 },
      ],
      default: [
        { label: '宝马', value: 1 },
        { label: '奥迪', value: 2 },
      ],
      onSubmit: (option) => {
        console.log(option);
      },
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ margin:  10 }}>
          <Button label="你好" onPress={ this.onButtonPress.bind(this) }/>
        </View>
        <Picker ref="picker"></Picker>
      </View>
    );
  }
}

export default App;
```

### Options

| options | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| title | `String` | N | `'请选择` | 选择弹出框的标题 |
| multi | `Bool` | N | `false` | 是否是多选, 默认单选 |
| withAll | `Bool` | N | `false` | 是否带有全选按钮 |
| options | `Array[OptionObject]` | Y |  | 选项 |
| default | `Object` or `Array` | N |  | 默认选中 |
| onSubmit | `Function` | Y | `() => {}` | 用户确定选择时的回调 |
| optionLabelKey | `String` | N | `'label'` | 用来当作选项显示的字段 |
| optionValueKey | `String` | N | `'value'` | 用来当作选项值的字段 |
| ----- | ---- | -------- | ------- | ----------- |

### OptionObject

| options | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| label | `String` | Y | | 选项的名字 |
| value | `Number` or `String` or `Bool` | Y |  | 选项的值 |










