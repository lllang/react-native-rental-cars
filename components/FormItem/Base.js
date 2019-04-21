import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';

import { scale } from '../Utils';
import { Layout } from '../Style';
import Icon from '../Icon';

import FormLabel from './FormLabel';
import styles from './styles';

class Base extends React.Component {

  static defaultProps = {
    placeholder: '(空)',
    icon: undefined,
    required: false,
  }

  onPress() {
    this.props.onPress && this.props.onPress();
  }

  render() {
    return (
      <View style={[styles.formItemContainer, this.props.style]}>
        <FormLabel required={ this.props.required } label={ this.props.label }/>
        <View style={ [styles.formControlContainer] }>
          { this.renderValue() }
        </View>
      </View>
    )
  }

  renderValue() {
    if (this.props.onPress) {
      return (
        <TouchableOpacity activeOpacity={ 0.4 } style={ styles.formControlValueContainer }
          onPress={ this.onPress.bind(this) }>
          <Text style={ [styles.formControlValue] }>
            { this.props.value || this.renderPlacehold() }
          </Text>
          { this.renderIcon() }
        </TouchableOpacity>
      )
    } else {
      return (
        <Text numberOfLines={ 1 } style={ [styles.formControlContainerInput, Layout.pr20 ] }>
          { this.props.value || this.renderPlacehold() }
        </Text>
      )
    }
  }

  renderPlacehold() {
    return (
      <Text style={ [styles.formControlValue, styles.formControlPlaceholder] }>
        { this.props.placeholder }
      </Text>
    )
  }

  renderIcon() {
    if (!this.props.icon) return null;
    return <Icon style={[{ fontSize: scale(40) }, styles.dropArrow]} name={ this.props.icon }/>
  }
}

export default Base;
