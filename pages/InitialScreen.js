import React from 'react'
import { StyleSheet, View, Image, PermissionsAndroid, Platform } from 'react-native'
// import { Geolocation } from "react-native-amap-geolocation"
import Toast from 'react-native-simple-toast'
import { getAuth } from '../utils/storage'
import PropTypes from 'prop-types'
import { post } from '../utils/request'
import Wxpay from '../utils/wxpay'


export default class InitialScreen extends React.Component{
  static contextTypes = {
    actions: PropTypes.object
  }
  static navigationOptions = {
    header: null
  }
  async componentDidMount () {
    Wxpay.registerApp('wxd678efh567hg6787');
    // console.log(111, Wxpay);
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   await Geolocation.init({
      //     ios: "9bd6c82e77583020a73ef1af59d0c759",
      //     android: "043b24fe18785f33c491705ffe5b6935"
      //   })
      
      //   Geolocation.setOptions({
      //     interval: 8000,
      //     distanceFilter: 20
      //   })
      
      //   Geolocation.addLocationListener(location => console.log(location))
      //   Geolocation.start()
      // }
    }
    
    let userInfo = await getAuth();
    setTimeout(() => {
      if(userInfo && userInfo.token) {
        post(`/app/user/getUserInfo`, {
          token: userInfo.token
        }).then(res => {
          if (res.data && res.data.success) {
            userInfo = {...userInfo, ...res.data.data}
            this.props.navigation.replace('home');
            this.context.actions.updateUserInfo(userInfo);
          } else {
            this.props.navigation.replace('home');
            this.context.actions.updateUserInfo(userInfo);
          }
        })
      } else {
        this.props.navigation.replace('login');
      }
    }, 1000);
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={{width: '100%', height: '100%'}} source={require('../assets/home/png-star.png')}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 40,
    color: '#000',
  }
})
