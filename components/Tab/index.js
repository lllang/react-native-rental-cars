import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles'

class Tab extends React.Component {

  static propTypes = {
    tabs: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  state = {
    value: null,
  };

  onTabPressed(key) {
    if (this.state.value === key) return;
    this.setState({ value: key });
    this.props.onChange && this.props.onChange(key);
  }

  componentWillMount() {
    const defaultValue = this.props.default || Object.keys(this.props.tabs)[0];
    this.setState({ value: defaultValue });
  }

  setTabs(tabs) {
    this.setState({ tabs });
  }

  active(key) {
    this.onTabPressed(key);
  }

  render() {
    const tabs = this.props.tabs;
    const keys = Object.keys(tabs);
    return (
      <View style={styles.Tab_container}>
        {
          keys.map((key, index, arr) => {
            let active = this.state.value === key;
            return (
              <View key={ key }
                style={[
                  styles.Tab_item,
                  { width: (100/arr.length).toString() + '%' },
                  index + 1 === arr.length ? styles.Tab_last : null,
                ]}>
                <Text style={[styles.Tab_itemText, { color: active ? 'orange' : 'black' }]}
                  onPress={ this.onTabPressed.bind(this, key) }>
                  { tabs[key] }
                </Text>
                <View style={active ? styles.Tab_activeItem : null }></View>
              </View>
            )
          })
        }
      </View>
    )
  }

}


export default Tab;
