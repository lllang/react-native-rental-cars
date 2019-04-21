import React from 'react';
import { View, Text, Keyboard, Image, TouchableOpacity } from 'react-native';
import Picker from '../Picker';

import styles from './styles';
import FormLabel from './FormLabel';

class FormItemPicker extends React.Component {

  required = this.props.required;
  state = this.getDefaultOption();

  getDefaultOption() {
    if (typeof this.props.default === 'undefined') return {};
    if (typeof this.props.default === 'object') return this.props.default;
    return this.props.options.find(option => option.value === this.props.default);
  }

  onValueChange(option) {
    this.setState(option);
    this.props.valueChangeListener && this.props.valueChangeListener(option);
  }

  currentPageName() {
    return this.props.routing.routes[this.props.routing.index].name;
  }

  onPress() {
    Keyboard.dismiss();
    Picker.show({
      options: this.props.options,
      onValueChange: this.onValueChange.bind(this),
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
            <Image style={ styles.dropArrow } source={require('../Assets/unfold.png')} resizeMode="contain"></Image>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLabel() {
    if (!this.state) return this.renderPlacehold();

    let label = this.state.label;

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

export default FormItemPicker;
