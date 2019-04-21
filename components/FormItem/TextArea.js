import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { scale } from '../Utils';

class TextArea extends React.Component {

  static propTypes = {
    onChangeText: PropTypes.func,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    style: {}
  };

  render() {
    return (
      <TextInput multiline={true}
        numberOfLines={4}
        maxLength={100}
        underlineColorAndroid="transparent"
        placeholder="请输入..."
        defaultValue={ this.props.default }
        { ...this.props }
        style={[styles.input, this.props.style]}/>
    )
  }

}

const styles = StyleSheet.create({
  input: {
    marginTop: scale(20),
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(5),
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    height: scale(250),
    padding: scale(20),
  },
})

export default TextArea;
