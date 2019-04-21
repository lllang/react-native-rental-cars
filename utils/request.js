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

export function api(url, params) {
  const state = store.getState();
  if (state.app.userInfo && state.app.userInfo.token) {
    return axios.post(host + url, params, {
      headers: {
        Authorization: state.app.userInfo.token
      }
    })
  }
  Toast.show('请先登录');
  navigate('login');
}
