import React, { Component } from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';

class Mask extends Component {

  static defaultProps = {
    onPress: () => {},
    backgroundColor: 'rgba(0,0,0,0.4)',
  }

  render() {
    return (
      <TouchableOpacity onPress={ this.props.onPress.bind(this) } style={ [styles.mask, {
        backgroundColor: this.props.backgroundColor,
      }] }>
        { this.props.children }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10000,
    zIndex: 100,
  },
});

export default Mask;