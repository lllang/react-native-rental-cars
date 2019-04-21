import React from 'react';
import styles from './styles';
import { Text } from 'react-native';

class FormLabel extends React.Component {

  required = this.props.required;

  render() {
    return (
      <Text style={ styles.formLabel }>
        { this.required ? <Text style={ styles.red }>*</Text> : null } 
        { this.props.label } :
      </Text>
    )
  }

}

export default FormLabel;