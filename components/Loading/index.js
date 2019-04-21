import React, { Component } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';

import Icon from '../Icon';
import { scale } from '../Utils';

class Loading extends Component {

  static defaultProps = {
    size: scale(60),
  }

  state = {
    rotateAnim: new Animated.Value(0)
  }

  componentDidMount () {
    this.startAnimation()
  }

  startAnimation () {
    this.state.rotateAnim.setValue(0);
    Animated.timing(
      this.state.rotateAnim,
      {
        toValue: 1,
        duration: 400,
        easing: Easing.linear,
        isInteraction: false,
      }
    ).start(() => {
      this.startAnimation()
    });
  }

  render() {
    return (
      <Animated.View
        style={[styles.container,
          {
            transform: [
              {
                rotate: this.state.rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              }
            ],
            width: this.props.size,
            height: this.props.size,
          }
        ]}>
          <Icon style={{
            color: 'grey',
            fontSize: this.props.size,
          }} name="loading"/>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10000,
    backgroundColor: 'transparent',
  }
});

export default Loading;