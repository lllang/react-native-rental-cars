import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import ArrayToolkit from '../Utils/Array';
import Mask from '../Mask';

import styles from './styles';

class Dialog extends Component {

  static propTypes = {
    buttons: PropTypes.array.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    buttons: [{
      label: '知道了',
      color: 'orange',
    }],
  }

  state = {
    show: false,
  }

  show() {
    this.setState({ show: true });
  }

  hide() {
    this.setState({ show: false }); 
  }

  onPress(onPress) {
    this.setState({ show: false }, () => {
      if (onPress instanceof Function) onPress();
    });
  }

  render() {
    if (!this.state.show) return null;
    return (
      <Mask>
        <View style={ styles.container }>
          { this.renderHeader() }
          { this.renderBody() }
          { this.renderFooter() }
        </View>
        <View></View>
      </Mask>
    )
  }

  renderHeader() {
    if (!this.props.title) return;
    return (
      <View><Text style={ styles.title }>{ this.props.title }</Text></View>
    )
  }

  renderBody() {
    let content = this.props.children || this.props.content || this.props.info;
    if (!content) return;
    if (typeof content === 'string') {
      content = (
        <View style={ styles.infoContainer }>
          <Text style={ styles.info }>{ content }</Text>
        </View>
      );
    }
    if (this.props.info || this.props.content || this.props.children) {
      return (
        <View style={ styles.body }>{ content }</View>
      )
    }
  }

  renderFooter() {
    if (!this.props.buttons || !this.props.buttons.length) return null;
    const buttonGroups = ArrayToolkit.splitByCondition(this.props.buttons, button => button.block);
    return (
      <View style={ styles.footer }>
        { buttonGroups.map(this.renderButtonGroup.bind(this)) }
      </View>
    )
  }

  renderButtonGroup(buttonGroup, groupIndex) {
    return buttonGroup.map((button, index) => {
      const width =  100 / buttonGroup.length + '%';
      const border = index ? {} : { border: false };
      const color = button.color || '#333';
      const buttonContainerStyle = [styles.button, { width, border }];
      return (
        <TouchableOpacity key={ `${groupIndex}${index}` }
          style={ buttonContainerStyle }
          onPress={ this.onPress.bind(this, button.onPress) }>
          <Text style={ [styles.buttonLabel, { color }] }>{ button.label }</Text>
        </TouchableOpacity>
      )
    })
  }

}

export default Dialog;