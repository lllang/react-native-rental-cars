/**
 * 此控件满足各种单选场景
 * props: {
 *   options: Array<Option>,    # 供选择的选项
 *   page: String,              # 实现了选择的页面
 *   getLabel: Function,        # 标签生成函数，参数为可选项数据。
 * }
 *
 * Option: {
 *   label: String,             # 显示的选项字符串
 *   value: Number/String       # 选项的 value ，可选，如果不填，则为自定义
 *   type: [Time|Input|Api]     # 自定义的选项内容，接受选择日期，输入内容，和从 Api 请求数据
 *   api: Function              # 一个能返回 { data, error } 的 Api 请求数据函数，当 type 为 'Api' 时，必填。
 *   getLabel: Function         # 当 Api 返回的数据选项中不存在 label 字段时，使用此函数来生成 label, 参数为可选项数据。
 * }
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import FormLabel from './FormLabel';

class Selector extends React.Component {

  state = this.getDefaultOption();

  getDefaultOption() {
    if (typeof this.props.default === 'undefined') return null;
    if (typeof this.props.default === 'object') {
      return this.props.default;
    }
    const defaultOption =  this.props.options.find((option) => option.value === this.props.default);
    return defaultOption;
  }

  onPress() {
    const pageName = this.props.page || 'HtwBasicSelect';
    store.dispatch({
      type: 'navigation/push',
      payload: {
        name: pageName,
        params: {
          ...this.props,
          onBack: (data) => {
            this.setState(data);
            this.props.valueChangeListener && this.props.valueChangeListener(data);
          },
        },
      },
    });
  }

  render() {
    return (
      <View style={[styles.formItemContainer, this.props.style]}>
        <FormLabel required={ this.props.required } label={ this.props.label }/>
        <View style={ styles.formControlContainer }>
          <TouchableOpacity activeOpacity={ 0.4 } style={ styles.formControlValueContainer }
            onPress={ this.onPress.bind(this) }>
            { this.renderLabel() }
            <Image style={ styles.dropArrow } source={require('../Assets/right.png')} resizeMode="contain"></Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLabel() {
    if (!this.state) return this.renderPlacehold();

    let label = this.state.label;

    if (!label && this.props.getLabel) {
      label = this.props.getLabel(this.state);
    }

    if (!label) return this.renderPlacehold();

    return (
      <Text style={ styles.formControlValue }>{ label }</Text>
    )
  }

  renderPlacehold() {
    return (
      <Text style={ [styles.formControlValue, styles.formControlPlaceholder] }>
        { this.props.placeholder || '点击选择 ...' }
      </Text>
    )
  }
}


export default Selector;
