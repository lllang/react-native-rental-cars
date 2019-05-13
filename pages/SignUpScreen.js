import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import timers from 'react-native-background-timer'
import { p } from '../utils/resolutions';
import { post } from '../utils/request';
import { setAuth } from '../utils/storage';
import { isPhone } from '../utils/vali';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';
import { Loading } from '../utils/loading';

const CODE_TIMEOUT_SECONDS = 60;

const IMAGES = {
  check: require('../assets/wallet/icon-check.png'),
  checked: require('../assets/wallet/icon-check-select.png'),
}

export default class SignUpScreen extends Component{
  state = {
    tel: '',
    password: '',
    repassword: '',
    code: '',
    checked: false,
    codeBtnDisabled: true,
    codeBtnTxt: '获取验证码',
  }
  static contextTypes = {
    actions: PropTypes.object,
  };
  isSignUp = this.props.navigation.getParam('type', 0) === 0;
  static navigationOptions = {
    header: null
  }
  signUp = () => {
    if (!this.state.checked) {
      Toast.show('请先同意协议')
      return;
    }
    if (!isPhone(this.state.tel) || this.state.password === '') {
      Toast.show('请输入正确的手机号和密码')
      return;
    }
    if (this.state.password !== this.state.repassword) {
      Toast.show('请保证两次输入的密码是一样的');
      return;
    }
    Loading.show();
    post(this.isSignUp ? '/app/user/addUser' : '/app/user/resetPassword', { tel: this.state.tel, password: this.state.password, code: this.state.code }).then((res) => {
      if(res.data && res.data.success) {
        Toast.show(this.isSignUp ? '注册成功' : '找回成功');
        post('/app/user/oauth', { tel: this.state.tel, password: this.state.password }).then(async (res1) => {
          console.log(res1)
          if (res1.data && res1.data.success) {
            Loading.hidden();
            Toast.show('登录成功')
            await setAuth(res1.data.data)
            console.log(res1.data.data)
            this.context.actions.updateUserInfo(res1.data.data);
            this.props.navigation.replace('home');
          } else {
            Loading.hidden();
            Toast.show(res1.data && res1.data.msg || '登录失败')
          }
        }, (res1) => {
          Loading.hidden();
          Toast.show('登录失败')
        });
      } else {
        Loading.hidden();
        Toast.show(res.data && res.data.msg || '请求失败');
      }
    });
  }
  postCode = () => {
    if (this.state.codeBtnDisabled) {
      return;
    }
    if (!isPhone(this.state.tel)) {
      Toast.show('请输入正确的手机号');
      return;
    }
    post('/app/user/redisAdd', { tel: this.state.tel, type: this.props.navigation.getParam('type', 0) }).then((res) => {
      if(res.data && res.data.success) {
        Toast.show('验证码已发送');
        let counter = CODE_TIMEOUT_SECONDS;
        this.setState({ codeBtnDisabled: true, codeBtnTxt: `${counter}秒后可重试` });
        this.codeBtnHandler = timers.setInterval(() => {
          counter -= 1;
          if (counter === 0) {
            timers.clearInterval(this.codeBtnHandler);
            this.codeBtnHandler = null;
            this.setState({ codeBtnTxt: '获取验证码', codeBtnDisabled });
          } else {
            this.setState({ codeBtnTxt: `${counter}秒后可重试` });
          }
        }, 1000);
      } else {
        Toast.show(res.data && res.data.msg || '验证码发送失败');
      }
    })
  }

  componentWillUnmount() {
    if (this.codeBtnHandler) {
      timers.clearInterval(this.codeBtnHandler);
      this.codeBtnHandler = null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.isSignUp ? '注册' : '忘记密码'}</Text>
        <TextInput style={styles.input1} placeholder='请输入手机号' onChangeText={(value) => { this.setState({ tel: value, codeBtnDisabled: !isPhone(value) }) }}/>
        <TextInput style={[styles.input1, styles.input2]} secureTextEntry={true} placeholder='请输入密码' onChangeText={(value) => { this.setState({ password: value }) }}/>
        <TextInput style={[styles.input1, styles.input2]} secureTextEntry={true} placeholder='再次请输入密码' onChangeText={(value) => { this.setState({ repassword: value }) }}/>
        <View style={{ position: 'relative' }}>
          <TextInput style={[styles.input1, styles.input2]} placeholder='请输入验证码' onChangeText={(value) => { this.setState({ code: value }) }}/>
          <TouchableOpacity style={styles.getCode} onPress={this.postCode}>
            <Text style={[styles.getCodeText, this.state.codeBtnDisabled ? { color: '#999' } : {}]}>{this.state.codeBtnTxt}</Text>
          </TouchableOpacity>
        </View>
        {this.isSignUp ? <View style={styles.deal}>
          <TouchableOpacity onPress={() => { this.setState({ checked: !this.state.checked })} }>
          <Image
            source={this.state.checked ? IMAGES.checked : IMAGES.check}
            style={styles.check}
          />
          </TouchableOpacity>
          <Text style={styles.dealText}>我已经详细阅读并同意</Text>
          <TouchableOpacity onPress={() => {
            this.props.navigation.push('webview');
          }}>
            <Text style={styles.dealText1}>蒂时出行用户协议</Text>
          </TouchableOpacity>
        </View> : null}
        <TouchableOpacity style={styles.submit} onPress={this.signUp}>
          <Text style={styles.submitText}>{this.isSignUp ? '注册' : '重置'}</Text>
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
  deal: {
    marginTop: p(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: p(50),
    marginRight: p(50),
  },
  check: {
    width: p(20),
    height: p(20),
    marginRight: p(5),
  },
  dealText: {
    color: '#2b2b2b',
    fontSize: p(13),
  },
  dealText1: {
    color: '#00b1a0',
    fontSize: p(13),
  },
  disabled: {
    backgroundColor: '#999',
  },
})