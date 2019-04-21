import React, { Component } from "react";
import DatePicker from 'react-native-date-picker';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import Icon from '../Icon';
import Mask from '../Mask';

import styles from './styles';

const baseConfig = {
  title: '请选择',
  locale: 'zh_CN',
  mode: undefined,
  maximumDate: undefined,
  minimumDate: undefined,
  minuteInterval: undefined,
  onSubmit: () => {},
}

class DiorDatePicker extends Component {

  state = {
    show: false,
    value: new Date(),
    ...baseConfig,
  }

  show(config) {
    const state = Object.assign({}, baseConfig, {
      show: true,
      value: config.default || new Date(),
    }, config);
    this.setState(state);
  }

  hide() {
    this.setState({ show: false });
  }

  submit() {
    if (typeof this.state.onSubmit === 'function') {
      this.state.onSubmit(this.state.value);
    }
    this.hide();
  }

  onDateChange(date) {
    this.setState({ value: date });
  }

  render() {
    if (!this.state.show) return null;
    return (
      <Mask onPress={ this.hide.bind(this) }>
        <View style={ styles.container }>
          <TouchableOpacity onPress={() =>{}} activeOpacity={ 1 } style={ styles.header }>
            <TouchableOpacity style={ styles.actionButton } onPress={ this.hide.bind(this) }>
              <Text style={ [styles.actionLabel, { color: '#222'}] }>取消</Text>
            </TouchableOpacity>
            <Text style={ styles.headerLabel }>{ this.state.title }</Text>
            <TouchableOpacity style={ styles.actionButton } onPress={ this.submit.bind(this) }>
              <Text style={ [styles.actionLabel, { color: 'orange'}] }>确定</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <View style={ styles.body }>
            <DatePicker date={ this.state.value }
              locale={ Platform.OS === 'ios' ? undefined : this.state.locale }
              hourMode={ 24 }
              mode={ this.state.mode }
              maximumDate={ this.state.maximumDate }
              minimumDate={ this.state.minimumDate }
              minuteInterval={ this.state.minuteInterval }
              onDateChange={ this.onDateChange.bind(this) }
            />
          </View>
        </View>
      </Mask>
    )
  }
}

export default DiorDatePicker;