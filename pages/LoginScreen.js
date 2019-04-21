import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { p } from '../utils/resolutions';
import { post } from '../utils/request';
import { setAuth } from '../utils/storage';
import { isPhone } from '../utils/vali';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

export default class LoginScrren extends Component{
  state = {
    tel: '',
    password: '',
  }
  static contextTypes = {
    actions: PropTypes.object,
  };

  static navigationOptions = {
    header: null
  }

  login = () => {
    if (!isPhone(this.state.tel) || this.state.password === '') {
      Toast.show('请输入正确的手机号和密码');
      return;
    }
    post('/app/user/oauth', { tel: this.state.tel, password: this.state.password }).then(async (res) => {
      console.log(res)
      if (res.data && res.data.success) {
        Toast.show('登录成功')
        await setAuth(res.data.data)
        console.log(res.data.data)
        this.context.actions.updateUserInfo(res.data.data);
        this.props.navigation.replace('home');
      } else {
        Toast.show(res.data && res.data.msg || '登录失败')
      }
    }, (res) => {
      Toast.show('登录失败')
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>欢迎您</Text>
        <TextInput style={styles.input1} placeholder='请输入用户名' type='numeric' autoFocus onChangeText={(value) => { this.setState({ tel: value }) }}/>
        <TextInput style={[styles.input1, styles.input2]} secureTextEntry={true} placeholder='请输入密码' onChangeText={(value) => { this.setState({ password: value }) }}/>
        <TouchableOpacity style={styles.submit} onPress={this.login}>
          <Text style={styles.submitText}>登录</Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.opacity} onPress={() => { this.props.navigation.navigate('signUp', { type: 0 }) }}>
            <Text style={styles.text}>注册账号</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.opacity} onPress={() => { this.props.navigation.navigate('signUp', { type: 1 }) }}>
            <Text style={styles.text}>忘记密码？</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: p(30),
    marginTop: p(77),
    marginLeft: p(23),
  },
  input1: {
    marginTop: p(47),
    marginLeft: p(23),
    marginRight: p(23),
    fontSize: p(16),
    borderBottomWidth: p(1),
    borderBottomColor: '#e5e5e5',
    padding: 0,
    paddingBottom: p(11),
    paddingLeft: p(9), 
  },
  input2: {
    marginTop: p(30),
  },
  submit: {
    marginTop: p(40),
    width: p(300),
    height: p(50),
    backgroundColor: '#00B1A0',
    alignSelf: 'center',
    borderRadius: p(25),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  submitText: {
    color: '#fff',
    fontSize: p(20),
  },
  bottom: {
    marginTop: p(50),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: p(52),
    marginRight: p(52),
  },
  text: {
    color: '#00b49d',
    fontSize: p(16),
  },
})