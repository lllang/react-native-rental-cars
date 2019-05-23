import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView, Platform, AppState } from 'react-native'
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types'
import Alipay from 'react-native-yunpeng-alipay';
import { connect } from 'react-redux';
import timers from 'react-native-background-timer'
import { Loading } from '../utils/loading';
import { p } from '../utils/resolutions';
import { api } from '../utils/request';
import { pay } from 'react-native-wechat';

const IMAGES = {
  check: require('../assets/wallet/icon-check.png'),
  checked: require('../assets/wallet/icon-check-select.png'),
}

class WalletScreen extends React.Component{
  static contextTypes = {
    actions: PropTypes.object
  }
  static navigationOptions = {
    title: '我的钱包',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  state = {
    rechargeArray: [50, 100, 200, 300, 500, 1000],
    checked: true,
    show: true,
    payNum: '',
    recharge: 0,
    payType: 'wechat',
  }
  submit = () => {
    const { checked, payType, recharge, show, payNum } = this.state;
    if(!checked) {
      Toast.show('请选勾选协议');
      return;
    }
    if (show && !payNum) {
      Toast.show('请输入金额');
      return;
    }
    if (payType === 'wechat') {
      api('/api/pay/rechargePrePayInfo', {
        num: show ? payNum : recharge
      }).then(async (res) => {
        if(res.data && res.data.success) {
          const { partnerid, noncestr, prepayid, sign, timestamp } = res.data.data;
          let param = {}
          if (Platform.OS === 'android') {
            param = {
              partnerId: partnerid,
              prepayId: prepayid,
              nonceStr: noncestr,
              timeStamp: `${timestamp}`,
              sign,
              package: 'Sign=WXPay',
            }
          } else {
            param = {
              partnerId: partnerid,
              prepayId: prepayid,
              nonceStr: noncestr,
              timeStamp: timestamp,
              sign,
              package: 'Sign=WXPay',
            }
          }
          pay(param).then(r => {
            console.log(r);
            if (r.errCode === 0) {
              this.roll(res.data.order_id);
            } else {
              Toast.show('支付失败');
            }
          }, rej => {
            console.log(rej);
            Toast.show('支付失败');
          }).catch(e => {
            console.log(e);
            Toast.show('支付失败');
          })
        } else {
          Toast.show('支付失败');
        }
      })
    } else {
      api('/api/pay/rechargePrePayInfoByALiPay', {
        num: show ? payNum : recharge
      }).then((res) => {
        if (res.data && res.data.data) {
          this.alipay(res);
        } else {
          Toast.show(res.data && res.data.msg || '支付失败');
        }
      })
    }
  }
  async alipay(res) {
    const data = await Alipay.pay(res.data.data);
    console.log(data)
    if (data) {
      this.roll(res.data.order_id);
    } else {
      Toast.show('充值失败');
    }
  }
  roll(orderId) {
    Loading.show('充值中');
      this.codeBtnHandler = timers.setInterval(async () => {
        const data = await api('/api/pay/rechargeResult', {
          id: orderId
        })
        if (!data.data || !data.data.success) {
          Toast.show('充值失败');
          Loading.hidden();
          this.context.actions.getUserInfo();
          this.codeBtnHandler && timers.clearInterval(this.codeBtnHandler);
          this.timer && timers.clearTimeout(this.timer);
        }
        if (data.data && data.data.success && data.data.result) {
          Toast.show('充值成功');
          Loading.hidden();
          this.context.actions.getUserInfo();
          this.codeBtnHandler && timers.clearInterval(this.codeBtnHandler);
          this.timer && timers.clearTimeout(this.timer);
        }
      }, 1000);
      this.timer = timers.setTimeout(() => {
        Loading.hidden();
        Toast.show('超时未到账，请稍后查看余额');
        this.context.actions.getUserInfo();
        this.codeBtnHandler && timers.clearInterval(this.codeBtnHandler);
      }, 5000)
  }
  render() {
    const { userInfo } = this.props
    const { show, recharge, payType } = this.state
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.amount}>
            <Text style={styles.amountText}>账户余额</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={styles.amountNum1}>{userInfo && userInfo.money && Math.floor(userInfo.money)}</Text>
              <Text style={styles.amountNum2}>
              {userInfo && userInfo.money && userInfo.money !== Math.floor(userInfo.money)
                ? `${`${(userInfo.money - Math.floor(userInfo.money)).toFixed(2)}`.substr(1)}元`
                : ''
              }
              </Text>
            </View>
            <Text style={styles.amountText}>优先使用余额支付</Text>
          </View>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('tradeDetail')}} style={styles.detailOpacity}>
            <Text style={styles.detail}>交易明细</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.rechargeText}>快速充值</Text>
        <View style={styles.recharge}>
          {this.state.rechargeArray.map(item => <TouchableOpacity key={item} style={styles.rechargeItem} onPress={() => {
            this.setState({
              recharge: item,
              show: false,
            })
          }}>
            <Text style={recharge === item ? styles.rechargeNum : styles.disabledText}>{item}元</Text>
          </TouchableOpacity>)}
          <TouchableOpacity style={styles.rechargeItem} onPress={() => {
            this.setState({
              show: true,
              recharge: 0,
            })
          }}>
            <Text style={show ? styles.rechargeNum : styles.disabledText}>自定义</Text>
          </TouchableOpacity>
          {show ? <TextInput placeholder="请输入自定义金额" keyboardType="numeric" style={styles.input} onChangeText={(value) => {
            this.setState({
              payNum: value
            })
          }}></TextInput> : null}
        </View>
        <View style={styles.recharge}>
          <TouchableOpacity style={styles.rechargeItem} onPress={() => {
            this.setState({
              payType: 'wechat',
            })
          }}>
            <Text style={payType === 'wechat' ? styles.rechargeNum : styles.disabledText}>微信支付</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rechargeItem} onPress={() => {
            this.setState({
              payType: 'alipay',
            })
          }}>
            <Text style={payType === 'alipay' ? styles.rechargeNum : styles.disabledText}>支付宝支付</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.deal}>
          <TouchableOpacity onPress={() => { this.setState({ checked: !this.state.checked })} }>
          <Image
            source={this.state.checked ? IMAGES.checked : IMAGES.check}
            style={styles.check}
          />
          </TouchableOpacity>
          <Text style={styles.dealText}>确认充值即代表您同意蒂时</Text>
          <TouchableOpacity onPress={() => {
            this.props.navigation.push('webview', { url: 'https://www.dschuxing.com/agreement/recharge' });
          }}>
            <Text style={styles.dealText1}>《充值协议》</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.submit, this.state.checked ? {} : styles.disabled]} onPress={this.submit}>
          <Text style={styles.submitText}>确认充值</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: p(15),
    backgroundColor: '#f7fcfc',
    position: 'relative',
  },
  card: {
    height: p(140),
    backgroundColor: '#00b1a0',
    borderRadius: p(15),
    overflow: 'hidden',
    paddingTop: p(22),
    paddingLeft: p(21),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: p(23),
    paddingRight: p(15),
  },
  amount: {
    height: '100%',
    justifyContent: 'space-between',
  },
  amountText: {
    fontSize: p(15),
    color: '#fff',
  },
  amountNum1: {
    fontSize: p(36),
    color: '#fff',
  },
  amountNum2: {
    color: '#fff',
    fontSize: p(13),
    marginBottom: p(5),
  },
  detail: {
    color: '#fff',
    fontSize: p(13),
  },
  detailOpacity: {
    padding: p(10),
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: p(5),
  },
  rechargeText: {
    color: '#999',
    marginTop: p(26),
    marginBottom: p(20),
    fontSize: p(13),
  },
  recharge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rechargeItem: {
    width: p(110),
    borderColor: '#dbdbdb',
    borderWidth: 1,
    height: p(53),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: p(15),
    borderRadius: p(3),
    backgroundColor: '#fff',
  },
  rechargeNum: {
    color: '#00b1a0',
    fontSize: p(15),
  },
  disabledText: {
    color: '#999',
  },
  submit: {
    marginTop: p(10),
    height: p(45),
    width: p(322),
    borderRadius: p(23),
    backgroundColor: '#00b1a0',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: p(15),
  },
  deal: {
    marginTop: p(10),
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
  input: {
    fontSize: p(16),
    borderWidth: p(1),
    borderColor: '#e5e5e5',
    padding: 0,
    marginBottom: p(11),
    width: p(200),
    paddingLeft: p(9), 
  }
})
export default connect(state => ({
  userInfo: state.app.userInfo
}))(WalletScreen)
