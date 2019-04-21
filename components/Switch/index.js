import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { scale } from '../Utils';

const Size = {
  big: {
    radius: scale(50),
    padding: scale(5),
    fontSize: scale(30),
  },
  middle: {
    radius: scale(45),
    padding: scale(5),
    fontSize: scale(28),
  },
  small: {
    radius: scale(40),
    padding: scale(5),
    fontSize: scale(26),
  },
}

class Switch extends React.Component {

  static defaultProps = {
    size: 'big',
    labels: {
      true: '是',
      false: '否',
    },
    default: false,
  }

  state = {
    value: this.props.default,
  }

  changeSwitch(value) {
    this.setState({ value });
    if (typeof this.props.onValueChange === 'function') {
      this.props.onValueChange(value)
    }
  }

  render() {
    const size = Size[this.props.size];
    const active = this.state.value;

    const style = [styles.container, {
      width: size.radius * 2,
      height: size.radius + size.padding * 2,
    }]

    const textStyle = [styles.text, {
      fontSize: size.fontSize,
    }];

    const iconStyle = [styles.icon, {
      width: size.radius,
      height: size.radius,
      marginHorizontal: size.padding,
    }];

    if (active) {
      style.push({
        backgroundColor: 'orange',
        justifyContent: 'flex-end',
      });
      textStyle.push({ color: 'orange' })
    };

    const label = this.props.labels[String(this.state.value)];
    return (
      <TouchableOpacity style={ style } onPress={ this.changeSwitch.bind(this, !this.state.value) }>
        <View style={ iconStyle }>
          <Text style={ textStyle }>{ label }</Text>
        </View>
      </TouchableOpacity>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    borderRadius: scale(300),
    backgroundColor: '#aaa',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: 'white',
    marginHorizontal: scale(5),
  },
  text: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: scale(30),
  },
})

export default Switch;