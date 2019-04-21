## Header

### props

| props | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| title | `String` | Y | `Title` | 标题 |
| backFunc | `Function` | N | `() => {} ` | 绑定返回按钮的回调 |
| noBackIcon | `Bool` | N | `false` | 是否显示返回按钮 |
| leftButton | `Object[ButtonObject]` | N | `undefined` | 配置左边按钮 |
| rightButton | `Object[ButtonObject]` | N | `undefined` | 配置右边按钮 |
| ----- | ---- | -------- | ------- | ----------- |

### ButtonObject

| props | type | required | default | description |
| ----- | ---- | -------- | ------- | ----------- |
| label | `String` | Y |  | 按钮的文案 |
| onPress | `Function` | Y |  | 按钮的点击回调 |
| disabled| `Bool` | N | `false` | 按钮是否禁用 |

### Tips

> 1、 是否要每个 Header 都要传递 `backFunc` 属性 ？

```
答： 您可以在 Header 组件使用之前，通过如下方法：
    Header.defaultProps.backFunc = () => {};
    来全局设置 Header 组件的默认返回行为。
```