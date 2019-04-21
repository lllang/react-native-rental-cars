import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { scale } from '../Utils';

import styles from './styles';

const baseConfig = {
  text: 'Dior',
  position: 'center',
  duration: 3000,
  color: 'rgba(0,0,0,0.7)',
}

class Toast extends Component {

  static instance;

  static show(config = {}) {
    const customConfig = Object.assign({}, baseConfig, config);
    this.instance.show(customConfig);
  }

  static hide() {
    this.instance.hide();
  }

  state = {
    show: false,
    ...baseConfig,
  }

  show(config) {
    this.setState({
      show: true,
      text: config.text,
      position: config.position,
      color: config.color,
    });
    if (config.duration) {
      if (this.timeoutTimer) clearTimeout(this.timeoutTimer);
      this.timeoutTimer = setTimeout(() => {
        this.hide();
        this.timeoutTimer = undefined;
      }, config.duration);
    }
  }

  hide() {
    this.setState({ show: false });
  }

  render() {
    if (!this.state.show) return null;
    const containerStyle = [styles.container];
    if (this.state.position === 'center') {
      containerStyle.push({ top: '50%'});
    } else if (this.state.position === 'top') {
      containerStyle.push({ top: scale(220)});
    } else if (this.state.position === 'bottom') {
      containerStyle.push({ bottom: scale(120)});
    } else {
      containerStyle.push({ top: '50%'});
    }

    const toastBoxStyle = [styles.toastBox, { backgroundColor: this.state.color }];


    return (
      <View style={ containerStyle }>
        <View style={ toastBoxStyle }>
          <Text style={ styles.textStyle }>{ this.state.text }</Text>
        </View>
      </View>
    )
  }
}

export default Toast;