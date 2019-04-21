import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import { Color } from '../Style';
import { scale } from '../Utils';
import styles from './styles';

class Header extends Component {

  static defaultProps = {
    noBackIcon: false, // 是否显示返回的图标
    backFunc: () => {},
    title: 'Title',
    leftButton: undefined,
    rightButton: undefined,
  }

  render() {
    return (
      <View style={ styles.header }>
        { this.renderBackButton() }
        { this.renderButton(this.props.leftButton, 'left') }
        <View style={ styles.title }>
          <Text style={ styles.titleText }>{ this.props.title }</Text>
        </View>
        { this.renderButton(this.props.rightButton, 'right') }
      </View>
    )
  }

  renderBackButton() {
    if (this.props.leftButton || this.props.noBackIcon) return null;
    return (
      <TouchableOpacity style={[styles.headerButton, { left: scale(20) }]} onPress={ this.props.backFunc.bind(this) }>
        <Icon style={{ fontSize: scale(40) }} name="left"></Icon>
      </TouchableOpacity>
    )
  }

  renderButton(button, position = 'right') {
    if (!button) return null;
    const disabled = button.disabled;
    const color = disabled ? '#ddd' : Color.Brand;
    return (
      <TouchableOpacity disabled={ disabled } style={[ styles.headerButton, { [position]: scale(20) } ]} onPress={ button.onPress.bind(this) }>
        <Text style={ [styles.submit, { color }] }>{ button.label }</Text>
      </TouchableOpacity>
    )
  }

}

export default Header;