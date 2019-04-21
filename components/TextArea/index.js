import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { scale } from '../Utils';

class TextArea extends React.Component {

  static propTypes = {
    onChangeText: PropTypes.func,
    autoFocus: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
  };

  render() {
    return (
      <View style={ styles.container }>
        <TextInput multiline={true}
          selectionColor="orange"
          numberOfLines={4}
          underlineColorAndroid="transparent"
          placeholder="请输入..."
          defaultValue={ this.props.default }
          { ...this.props }
          style={[styles.input, this.props.style]}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: scale(5),
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    padding: scale(24),
    paddingVertical: scale(16),
  },
  input: {
    textAlignVertical: 'top',
    height: scale(160),
  },
});

export default TextArea;
