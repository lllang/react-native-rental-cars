import React from 'react';
import { View, Text } from 'react-native';
import { scale } from '../Utils';
import styles from './styles';

class Badge extends React.Component {

  static defaultProps = {
    style: {},
    label: undefined,
    size: scale(20),
    color: '#FF525E',
  }

  render() {
    if (typeof this.props.label === 'undefined' || // undefined
        (typeof this.props.label === 'object' && !this.props.label) // null
      ) {
      return <View style={[styles.dot, {
        width: this.props.size,
        height: this.props.size,
        backgroundColor: this.props.color,
      }]} />;
    } else {
      return (
        <View key={ this.props.label } style={ [styles.bandgeContainer, this.props.style, {
          backgroundColor: this.props.color,
        }] }>
          <Text style={ styles.bandgeLabel }>{ this.props.label }</Text>
        </View>
      );
    }
  }
}

export default Badge;
