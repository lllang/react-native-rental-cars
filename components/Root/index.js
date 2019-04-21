import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import Toast from '../Toast';
import Picker from '../Picker';
import DatePicker from '../DatePicker';

import { Color } from '../Style';
import { scale } from '../Utils';
import styles from './styles';

class Root extends Component {

  static defaultProps = {
    backgroundColor: '#fff'
  }

  render() {
    return (
      <View style={[styles.container, {
        backgroundColor: this.props.backgroundColor,
      }]}>
        { this.props.children }
        <Toast ref={ ref => Toast.instance = ref }/>
        <Picker ref={ ref => Picker.instance = ref }/>
        <DatePicker ref={ ref => DatePicker.instance = ref }/>
      </View>
    )
  }
}

export default Root