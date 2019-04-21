import React, { Component } from "react";
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from '../Icon';
import Mask from '../Mask';

import styles from './styles';

const baseConfig = {
  title: '请选择',
  multi: false,
  options: [],
  optionLabelKey: 'label',
  optionValueKey: 'value',
  withAll: false,
  onSubmit: () => {},
}

class Picker extends Component {

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
    selected: [],
  }

  labelKey = 'label';
  valueKey = 'value';

  show(config) {
    let selected = [];
    if (config.default) {
      selected = selected.concat(config.default);
    }
    this.setState({
      show: true,
      title: config.title,
      options: [...config.options],
      multi: config.multi,
      withAll: config.withAll,
      selected,
      onSubmit: config.onSubmit,
    });

    if (config.optionLabelKey) {
      this.labelKey = config.optionLabelKey;
    }
    if (config.optionValueKey) {
      this.valueKey = config.optionValueKey;
    }
  }

  hide() {
    this.setState({ show: false });
  }

  submit() {
    if (typeof this.state.onSubmit === 'function') {
      const data = this.state.multi ? this.state.selected : this.state.selected[0];
      this.state.onSubmit(data);
    }
    this.hide();
  }

  onOptionPress(target) {
    const index = this.hasSelected(target);
    if (index === -1) {
      if (this.state.multi) {
        this.state.selected.push(target);
      } else {
        this.state.selected = [target];
      }
    } else {
      if (this.state.multi) {
        this.state.selected.splice(index, 1);
      }
    }
    this.setState({ selected: this.state.selected });
  }

  hasSelected(target) {
    return this.state.selected.findIndex(option => option[this.valueKey] === target[this.valueKey]);
  }

  selectAll() {
    if (this.state.options.length === this.state.selected.length) {
      this.setState({ selected: [] });
    } else {
      this.setState({ selected: [...this.state.options] });
    }
  }

  render() {
    if (!this.state.show) return null;
    const disabledSubmit = !this.state.selected.length;
    return (
      <Mask onPress={ this.hide.bind(this) }>
        <View style={ styles.container }>
          <TouchableOpacity onPress={() =>{}} activeOpacity={ 1 } style={ styles.header }>
            <TouchableOpacity style={ styles.actionButton } onPress={ this.hide.bind(this) }>
              <Text style={ [styles.actionLabel, { color: '#222'}] }>取消</Text>
            </TouchableOpacity>
            <Text style={ styles.headerLabel }>{ this.state.title }</Text>
            <TouchableOpacity disabled={ !this.state.selected.length } style={ styles.actionButton } onPress={ this.submit.bind(this) }>
              <Text style={ [styles.actionLabel, { color: disabledSubmit ? '#ddd' : 'orange'}] }>确定</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <ScrollView style={ styles.body }>
            { this.renderAllButton() }
            { this.state.options.map(this.renderOption.bind(this)) }
          </ScrollView>
        </View>
      </Mask>
    )
  }

  renderAllButton() {
    if (!this.state.multi || !this.state.withAll) return null;
    const active = this.state.options.length === this.state.selected.length;
    const containerStyle = [styles.optionContianer, { justifyContent: 'space-between' }];
    const labelStyle = [styles.optionLabel];
    const iconStyle = active ? [styles.check, styles.activeCheck] : styles.check;
    return (
      <TouchableOpacity key="*" style={ containerStyle }
        onPress={ this.selectAll.bind(this) }>
        <Text style={ labelStyle }>全部</Text>
        { this.state.multi && <Icon style={ iconStyle } name="check"/> }
      </TouchableOpacity>
    )
  }

  renderOption(option, index) {
    const active = this.hasSelected(option) > -1;
    const containerStyle = [styles.optionContianer];
    const labelStyle = [styles.optionLabel];
    const iconStyle = active ? [styles.check, styles.activeCheck] : styles.check;
    if (this.state.multi) {
      containerStyle.push({ justifyContent: 'space-between' });
    } else {
      labelStyle.push({ color: active ? 'orange' : undefined })
    }
    return (
      <TouchableOpacity disabled={ option.disabled } key={ option[this.valueKey] || option[this.labelKey] || index } style={ containerStyle }
        onPress={ this.onOptionPress.bind(this, option) }>
        <Text style={ labelStyle }>{ option[this.labelKey] }</Text>
        { this.state.multi && <Icon style={ iconStyle } name="check"/> }
      </TouchableOpacity>
    )
  }
}

export default Picker;