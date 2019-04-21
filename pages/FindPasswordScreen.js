import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { p } from '../utils/resolutions';
import { post } from '../utils/request';
import Toast from 'react-native-simple-toast';

export default class SignUpScreen extends Component{
  state = {
    tel: '',
    password: '',
    repassword: '',
    code: '',
  }
  static navigationOptions = {
    header: null
  }
  signUp = () => {
    post('/app/user/resetPassword', { tel: this.state.tel, password: this.state.password, code: this.state.code }).then((res) => {
      console.log(res)
      this.props.navigation.navigate('login');
    });
  }
  postCode = () => {
    if (this.state.tel === '') {
      Toast.show('请先填写手机号');
      return;
    }
    post('/app/user/redisAdd', { tel: this.state.tel, type: 1 }).then((res) => {
      Toast.show('验证码已发送');
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>忘记密码</Text>
        <TextInput style={styles.input1} placeholder='请输入手机号' onChangeText={(value) => { this.setState({ tel: value }) }}/>
        <TextInput style={[styles.input1, styles.input2]} secureTextEntry={true} placeholder='请输入密码' onChangeText={(value) => { this.setState({ password: value }) }}/>
        <TextInput style={[styles.input1, styles.input2]} secureTextEntry={true} placeholder='再次请输入密码' onChangeText={(value) => { this.setState({ repassword: value }) }}/>
        <View style={{ position: 'relative' }}>
          <TextInput style={[styles.input1, styles.input2]} placeholder='请输入验证码' onChangeText={(value) => { this.setState({ code: value }) }}/>
          <TouchableOpacity style={styles.getCode} onPress={this.postCode}>
            <Text style={styles.getCodeText}>获取验证码</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.submit} onPress={this.signUp}>
          <Text style={styles.submitText}>重置</Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.opacity} onPress={() => { this.props.navigation.navigate('login')}}>
            <Text style={styles.text}>返回登录</Text>
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
    justifyContent: 'center',
    marginLeft: p(52),
    marginRight: p(52),
  },
  text: {
    color: '#00b49d',
    fontSize: p(16),
  },
  getCode: {
    position: 'absolute',
    right: p(33),
    top: p(24),
  },
  getCodeText: {
    fontSize: p(16),
    color: '#2b2b2b',
  },
})