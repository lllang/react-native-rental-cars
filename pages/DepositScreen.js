import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { p } from '../utils/resolutions'
import { api } from '../utils/request'

class DepositScreen extends React.Component{
  static navigationOptions = {
    title: '我的押金',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  state = {
    deposit: {},
    isRefunded: false,
    depositAmount: 500,
  }
  submit = () => {
    if (this.state.deposit.idDeposit) {
      api('/api/dsDepositAudit/UserDepositAuditState', {}).then((res) => {
        if(res.data && res.data.success) {
          Toast.show('申请成功');
          this.getDeposit();
          this.isRefunded();
        } else {
          Toast.show(res.data && res.data.msg || '请求失败');
        }
      })
    } else {
      api('/api/dsDepositAudit/userPayDeposit1', {}).then((res) => {
        if(res.data && res.data.success) {
          this.setState({
            deposit: res.data.data,
          });
          this.getDeposit();
          this.isRefunded();
          Toast.show('押金提交成功');
        } else {
          Toast.show(res.data && res.data.msg || '请求失败');
        }
      })
    }
  }
  componentWillMount() {
    this.getDeposit();
    this.isRefunded();
    this.depositNum();
  }
  depositNum() {
    api('/api/dsDepositAudit/depositAmount', {}).then((res) => {
      if(res.data && res.data.success) {
        this.setState({
          depositAmount: res.data.data || 500,
        });
      }
    })
  }
  isRefunded() {
    api('/api/dsDepositAudit/isRefunded', {}).then((res) => {
      if(res.data && res.data.success) {
        this.setState({
          isRefunded: true,
        });
      } else {
        this.setState({
          isRefunded: false,
        });
      }
    })
  }
  getDeposit() {
    api('/api/dsUser/getMoney', {}).then((res) => {
      if(res.data && res.data.success) {
        this.setState({
          deposit: res.data.data,
        });
      }
    })
  }
  render() {
    const deposit = this.state.deposit;
    console.log(deposit)
    return (
      <View style={styles.container}>
        <View style={styles.card}>
        {deposit.idDeposit && !this.state.isRefunded ? 
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.renminbi}>￥</Text>
            <Text style={styles.deposit}>{deposit.deposit || 0}元</Text>
          </View>: <View>
            <Text>{this.state.isRefunded ? '押金退款中' : `您还未交押金，您需交押金${this.state.depositAmount}元`}</Text>
          </View>}
        </View> 
        {this.state.isRefunded ? null : <TouchableOpacity style={styles.submit} onPress={this.submit}>
          <Text style={styles.submitText}>{deposit.idDeposit ? '退押金' : '交押金'}</Text>
        </TouchableOpacity>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fcfc',
  },
  card: {
    height: p(80),
    backgroundColor: '#fff',
    marginTop: p(5),
    paddingTop: p(30),
    paddingLeft: p(46),
  },
  renminbi: {
    color: '#2b2b2b',
    fontSize: p(24),
  },
  deposit: {
    color: '#F96E0F',
    fontSize: p(24),
  },
  submit: {
    height: p(45),
    width: p(322),
    borderRadius: p(23),
    backgroundColor: '#00b1a0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: p(21),
  },
  submitText: {
    color: '#fff',
    fontSize: p(15),
  },
})
export default connect(state => ({
  userInfo: state.app.userInfo
}))(DepositScreen)
