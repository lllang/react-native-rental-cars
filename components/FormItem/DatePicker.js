import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import format from 'date-fns/format';
import Icon from '../Icon';

import DateTimePicker from './DateTimePicker';
import { scale } from '../Utils';

import styles from './styles';
import FormLabel from './FormLabel';

class DatePicker extends React.Component {

  mode = this.props.mode || 'date';
  state = {
    value: this.props.default,
  };

  async onPress() {
    const dateResult = await DateTimePicker.open({
      'default': this.state.value || new Date(),
      mode: this.mode,
    });
    if (dateResult.action === DateTimePicker.Submit) {
      this.setState({ value: dateResult.timeStamp });
    }
    this.props.valueChangeListener && this.props.valueChangeListener(this.state.value);
  }

  render() {
    return (
      <View style={[styles.formItemContainer, this.props.style]}>
        <FormLabel required={ this.props.required } label={ this.props.label }/>
        <View style={ styles.formControlContainer }>
          <TouchableOpacity activeOpacity={ 0.4 } style={ styles.formControlValueContainer }
            onPress={ this.onPress.bind(this) }>
            { this.renderLabel() }
            <Icon name="calendar" style={[{ fontSize: scale(42) }, styles.dropArrow, { textAlign: 'center' }]}/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLabel() {
    if (!this.state.value) return this.renderPlacehold();

    const style = this.mode === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm';
    let label = format(this.state.value, style);

    if (this.props.getLabel) {
      label = this.props.getLabel(this.state);
    }

    if (!label) return this.renderPlacehold();

    return (
      <Text style={ styles.formControlValue }>{ label }</Text>
    )
  }

  renderPlacehold() {
    return (
      <Text style={ [styles.formControlValue, styles.formControlPlaceholder] }>{ this.props.placeholder || '点击选择 ...' }</Text>
    )
  }
}


export default DatePicker;
