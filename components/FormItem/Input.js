import React from 'react';
import { View, Text, TextInput } from 'react-native';
import styles from './styles';
import FormLabel from './FormLabel';
import { Color, Layout } from '../Style';

class Input extends React.Component {

  static defaultProps = {
    disabled: false,
  }

  required = this.props.required;

  componentDidMount() {
    // 认为去 focus, 因为发现在某些手机上的 autoFocus 会不生效。
    if (this.props.autoFocus) {
      setTimeout(() => {
        this.refs.input.focus();
      }, 0);
    }
  }

  onValueChange(value) {
    this.props.valueChangeListener && this.props.valueChangeListener(value);
  }

  render() {
    return (
      <View style={[styles.formItemContainer, this.props.style]}>
        <FormLabel required={ this.props.required } label={ this.props.label }/>
        <View style={ styles.formControlContainer }>
        {
          this.props.disabled ?
          <Text style={ [styles.formControlContainerInput, Layout.pr20 ] }>
            { this.props.default }
          </Text>
          :
          <TextInput style={ styles.formControlContainerInput }
            ref="input"
            selectionColor={ Color.Brand }
            {...this.props}
            autoFocus={ false }
            defaultValue={ this.props.default && String(this.props.default) }
            onChangeText={ this.onValueChange.bind(this) }
            returnKeyType="done"
            underlineColorAndroid="transparent" />
        }
        </View>
        { this.renderUnit() }
      </View>
    )
  }

  renderUnit() {
    if (!this.props.unit) return null;
    return (
      <View style={ styles.InputUnitBox }>
        <Text style={ styles.InputUnit }>辆</Text>
      </View>
    )
  }
}

export default Input;
