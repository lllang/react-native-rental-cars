import axios from 'axios'
import Toast from 'react-native-simple-toast'
import store from '../utils/store'
import host from '../utils/config'
import { navigate } from '../utils/navigatorService'

export function get(url, params) {
  return axios.get(host + url, { params })
}

export function post (url, params) {
  return axios.post(host + url, params)
}

export function delay(time, ret, callback) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ret);
      if (callback) {
        callback();
      }
    }, time)
  })
}

export function api(url, params) {
  const state = store.getState();
  if (state.app.userInfo && state.app.userInfo.token) {
    return Promise.race([axios.post(host + url, params, {
      headers: {
        Authorization: state.app.userInfo.token
      }
    }), delay(5000, { data: { success: false, msg: '请求超时' } })]);
  }
  Toast.show('请先登录');
  navigate('login');
  return Promise.reject({});
}
