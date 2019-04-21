import React, { Component } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Color } from '../Style';
import { scale } from '../Utils';
import styles from './styles';

const sizeMap = {
  small: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(25),
    fontSize: scale(28),
  },
  middle: {
    paddingVertical: scale(14),
    paddingHorizontal: scale(30),
    fontSize: scale(32),
  },
  big: {
    paddingVertical: scale(18),
    paddingHorizontal: scale(35),
    fontSize: scale(36),
  },
  large: {
    paddingVertical: scale(22),
    paddingHorizontal: scale(40),
    fontSize: scale(40),
  },
}

class Button extends Component {

  static defaultProps = {
    onPress: () => {},
    lable: 'Button',
    type: 'solid',
    size: 'big',
    color: Color.Primary,
    radius: scale(4),
    round: false,
    disabled: false,
    style: {},
  }

  render() {
    const color = this.props.color;
    const contianerStyle = [styles.container];
    const labelStyle = [styles.label];

    contianerStyle.push({ borderColor: color, borderRadius: this.props.round ? scale(10000) : this.props.radius });
    labelStyle.push({ color });

    if (this.props.type === 'solid') {
      contianerStyle.push({ backgroundColor: color });
      labelStyle.push({ color: 'white' });
    }

    if (this.props.disabled) {
      contianerStyle.push({ opacity: 0.2 });
    }

    contianerStyle.push( { paddingVertical: sizeMap[this.props.size].paddingVertical, paddingHorizontal: sizeMap[this.props.size].paddingHorizontal });
    labelStyle.push({ fontSize: sizeMap[this.props.size].fontSize });

    return (
      <TouchableOpacity key={ Math.random() } disabled={ this.props.disabled } style={ contianerStyle.concat(this.props.style) } onPress={ this.props.onPress }>
        { this.props.children ? this.props.children : (<Text style={ labelStyle }>{ this.props.label }</Text>) }
      </TouchableOpacity>
    )
  }
}

export default Button