## SearchBox

### Props

| props | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| bounce | `Number` | N | `0` | 防抖间隔 |
| onFocus | `Function` | N | `() => {}` | Focus 的回调 |
| onBlur | `Function` | N | `() => {}` | Blur 的回调 |
| onClear | `Function` | N | `() => {}` | Clear 的回调 |
| onValueChange | `Function` | N | `() => {}` | ValueChange 的回调 |
| onSubmit | `Function` | N | `() => {}` | Submit 的回调 |
| placeholder |`String` | N | `请输入...` | 空值占位符 |
| returnKeyType |`Enum('done', 'go', 'next', 'search', 'send')` | N | `search` | 键盘确认键的文案 |


### Method

#### blur()

失去焦点

#### setValue(value)

设置值

#### clear()

清空值