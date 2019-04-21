## Button

### props

| props | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| label | `String` | Y | 'Button' | 按钮上的文案 |
| onPress | `Function` | Y | `() => {}` | 点击按钮的回调 |
| type | `Enum('solid', 'outline')` | N | 'solid' | 按钮的类型：<br> solid(实体) <br> outline(线框) |
| size | `Enum('small', 'middle', 'big', 'large')` | N | 'big' | 按钮的尺寸 |
| color | `String[CSS-Color]` | N | '#14D0B4' | 按钮的颜色。 |
| radius | `Bool` or `Number` | N | `false` | 按钮的倒角样式。可以传入数字来设置倒角的大小，也可以穿入 `true`, 使用圆角按钮。 |
| disabled | `Bool` | N | `false` | 是否禁止点按 |
| style| `Object` | N | `{}` | 自定义覆盖按钮的样式 |