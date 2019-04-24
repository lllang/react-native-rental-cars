import React from 'react'
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { p } from '../utils/resolutions'
import Toast from 'react-native-simple-toast'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { post } from '../utils/request'
import { setAuth } from '../utils/storage'
import { actions } from '../reducers'
import { navigate } from '../utils/navigatorService'

const IMAGES = {
  back: require('../assets/home/bg-pic.png'),
  money: require('../assets/home/icon-money.png'),
  trip: require('../assets/home/icon-trip.png'),
  deposit: require('../assets/home/icon-deposit.png'),
  cart: require('../assets/home/icon-cart.png'),
  right: require('../assets/home/icon-right.png'),
}

class LeftDrawer extends React.Component{
  static contextTypes = {
    actions: PropTypes.object,
  };
  async logout() {
    console.log(this);
    actions.updateUserInfo({});
    await setAuth({});
    Toast.show('退出登录成功');
    navigate('login')
  }
  componentDidMount() {
    console.log(this.props);
  }
  jump = (route) => {
    this.props.navigation.navigate(route);
  }
  render() {
    const { userInfo } = this.props
    return (
      <View style={styles.container}>
        <Image source={IMAGES.back} style={styles.back}/>
        <Text style={styles.phone}>{userInfo && userInfo.name || ''}</Text>
        <TouchableOpacity style={styles.vip}>
          <TouchableOpacity style={[styles.vipOpacity, userInfo && !userInfo.isUserCar && !userInfo.partner ? {} : styles.disabledVipOpacity]}>
            <Text style={[styles.vipText, userInfo && !userInfo.isUserCar && !userInfo.partner ? {} : styles.disabledVipText]}>普通会员</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.vipOpacity, userInfo && userInfo.isUserCar ? {} : styles.disabledVipOpacity]}>
            <Text style={[styles.vipText, userInfo && userInfo.isUserCar ? {} : styles.disabledVipText]}>车主会员</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.vipOpacity, userInfo && userInfo.partner ? {} : styles.disabledVipOpacity]}>
            <Text style={[styles.vipText, userInfo && userInfo.partner ? {} : styles.disabledVipText]}>城市合伙人</Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { this.jump('wallet') }}>
          <Image style={styles.itemIcon} source={IMAGES.money}/>
          <Text style={styles.itemTitle}>我的钱包</Text>
          <Image style={styles.right} source={IMAGES.right}/>
        </TouchableOpacity>
        <Text style={styles.amount}>余额 {userInfo && userInfo.money} 元  去充值</Text>
        <TouchableOpacity style={styles.item} onPress={() => { this.jump('order') }}>
          <Image style={styles.itemIcon} source={IMAGES.trip}/>
          <Text style={styles.itemTitle}>我的行程</Text>
          <Image style={styles.right} source={IMAGES.right}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { this.jump('card') }}>
          <Image style={styles.itemIcon} source={IMAGES.cart}/>
          <Text style={styles.itemTitle}>身份认证</Text>
          <Image style={styles.right} source={IMAGES.right}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { this.jump('deposit') }}>
          <Image style={styles.itemIcon} source={IMAGES.deposit}/>
          <Text style={styles.itemTitle}>我的押金</Text>
          <Image style={styles.right} source={IMAGES.right}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutOpacity} onPress={this.logout}>
          <Text style={styles.logout}>退出登录</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  back: {
    position: 'relative',
    width: p(298),
    left: -5,
    top: -100,
  },
  phone: {
    fontSize: p(18),
    alignSelf: 'center',
  },
  vip: {
    marginTop: p(15),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: p(10),
  },
  vipText: {
    color: '#2b2b2b',
    fontSize: p(15),
  },
  disabledVipText: {
    color: '#c9c9c9',
  },
  vipOpacity: {
    borderWidth: 1,
    borderColor: '#1c1c1c',
    padding: p(12),
    paddingTop: p(4),
    paddingBottom: p(4),
    borderRadius: p(11),
    margin: p(3),
  },
  disabledVipOpacity: {
    borderColor: '#c9c9c9',
  },
  item: {
    paddingLeft: p(25),
    paddingRight: p(35),
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    position: 'relative',
    width: '100%',
    marginTop: p(13),
  },
  itemIcon: {
    width: p(30),
    height: p(30),
  },
  itemTitle: {
    fontSize: p(15),
    color: '#2b2b2b',
    marginLeft: p(12),
  },
  right: {
    width: p(12),
    height: p(12),
    position: 'absolute',
    right: p(35),
  },
  amount: {
    fontSize: p(13),
    color: '#2b2b2b',
    width: '100%',
    marginLeft: p(136),
  },
  logoutOpacity: {
    position: 'absolute',
    bottom: p(53),
    left: p(112),
  },
  logout: {
    fontSize: p(16),
    color: '#00b49d',
  },
})

export default connect(state => ({
  userInfo: state.app.userInfo
}))(LeftDrawer)
