import React from 'react';
import { TextInput, View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import { scale } from '../Utils';
import { Color } from '../Style';

class SearchBox extends React.Component {

  static propTypes = {
    onChangeText: PropTypes.func,
    autoFocus: PropTypes.bool,
    bounce: PropTypes.number,
  };

  static defaultProps = {
    style: {},
    bounce: 0,
    onFocus: () => {},
    onBlur: () => {},
    onClear: () => {},
    onValueChange: () => {},
    onSubmit: () => {},
  };

  state = {
    value: this.props.default,
  }

  submit({ nativeEvent }) {
    this.props.onSubmit(nativeEvent.text);
  }

  blur() {
    this.refs.input.blur();
  }

  setValue(value) {
    this.setState({ value });
  }

  clear() {
    this.setState({ value: undefined });
    this.props.onClear();
  }

  onValueChange(data = '') {
    this.setState({ value: data });
    if (this.props.bounce) {
      if (this.bounceTimer) {
        clearTimeout(this.bounceTimer);
        this.bounceTimer = null;
      }
      this.bounceTimer = setTimeout(this.props.onValueChange.bind(null, data), this.props.bounce);
    } else {
      this.props.onValueChange(data);
    }
  }

  render() {
    return (
      <View style={ styles.container }>
        <Icon style={ styles.icon } onPress={ this.submit.bind(this) } name="search"/>
        <TextInput multiline={ false }
          ref="input"
          placeholder="请输入..."
          returnKeyType="search"
          selectionColor={ Color.Brand }
          value={ this.state.value }
          defaultValue={ this.props.default }
          underlineColorAndroid="transparent"
          onFocus={ this.props.onFocus }
          onBlur={ this.props.onBlur.bind(this) }
          onChangeText={ this.onValueChange.bind(this) }
          onSubmitEditing={ this.submit.bind(this) }
          { ...this.props }
          style={[styles.input, this.props.style]}/>
        { this.renderIcon() }
      </View>
    )
  }

  renderIcon() {
    if (this.state.value) {
      return <Icon style={ styles.icon } onPress={ this.clear.bind(this) } name="close"/>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(6),
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    padding: scale(12),
    paddingVertical: scale(12),
  },
  input: {
    flex: 1,
    textAlignVertical: 'center',
    color: '#333',
    fontSize: Platform.OS === 'ios' ? scale(32) : scale(30),
    padding: 0,
    marginVertical: Platform.OS === 'ios' ? 0 : -scale(12),
    paddingVertical: scale(-10),
    marginLeft: scale(10),
  },
  icon: {
    fontSize: scale(34),
    color: '#aaa',
  },
});

export default SearchBox;
