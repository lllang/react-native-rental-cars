import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';

import { scale } from '../Utils';
import { Layout } from '../Style';

import FormLabel from './FormLabel';
import styles from './styles';

class Static extends React.Component {

  onPress() {
    console.log('Static onPress');
    this.props.onPress && this.props.onPress();
  }

  render() {
    return (
      <View style={[styles.formItemContainer, this.props.style]}>
        <FormLabel required={ this.props.required } label={ this.props.label }/>
        <View style={ [styles.formControlContainer, { borderColor: 'white'}] }>
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
            { this.props.value }
          </Text>
          {
            this.props.icon ?
            (<Icon style={[{ fontSize: scale(42) }, styles.dropArrow]} { ...this.props.icon }/>) : 
            (<Image style={ styles.dropArrow } source={require('../Assets/right.png')} resizeMode="contain"></Image>)
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <Text onPress={ this.onPress.bind(this) } numberOfLines={ 1 }
          style={ [styles.formControlContainerInput, Layout.pr20 ] }>
          { this.props.value }
        </Text>
      )
    }
  }
}

export default Static;
