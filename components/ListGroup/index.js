/**
 * 列表按钮组
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '../Icon';
import PropTypes from 'prop-types';
import { scale } from '../Utils';

class ListGroup extends React.Component {

  static propTypes = {
    list: PropTypes.array.isRequired,
    containerStyle: PropTypes.object,
  };

  static defaultProps = {
    list: [],
    containerStyle: {}
  };

  render() {
    const list = this.props.list;

    return (
      <View style={ [styles.btnGroup, this.props.containerStyle] }>
        {
          list.map((item, index) => {
            const btnStyle = !index ? [styles.button, { borderTopWidth: 0 }] : styles.button;
            return (
              <TouchableOpacity key={ index } style={ btnStyle } onPress={ item.onPress }>
                <Text style={ styles.btnLabel }>{ item.label }</Text>
                <View style={ styles.flex }>
                  <Icon name="right" size={ scale(30) }/>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnGroup: {
    backgroundColor: 'white',
    marginHorizontal: scale(20),
    borderRadius: scale(10),
    marginBottom: scale(20),
  },
  button: {
    paddingHorizontal: scale(30),
    paddingVertical: scale(35),
    borderTopWidth: 1,
    borderColor: '#F3F4F5',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: { fontSize: scale(32) },
  dropArrow: { width: scale(30) },
});

export default ListGroup;
