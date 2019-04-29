import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { p } from '../utils/resolutions'
import { api } from '../utils/request';
import host from '../utils/config';
import { Loading } from '../utils/loading';
import format from 'date-fns/format'

const IMAGES = {
  oil: require('../assets/card/icon-electric.png'),
}

export default class OrderDetailScreen extends React.Component{
  static navigationOptions = {
    title: '订单详情',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  state = {
    carInfo: {},
  }
  componentDidMount() {
    // this.setState({
    //   carInfo: {
    //     "carId":"1",
    //     "carNumber":"闽A00004",
    //     "carPhoto":"/uploads/userInfo/3e3cb8df-ae68-45a8-973e-f98fc26d560d.jpg",
    //     "carTypeName":"宝骏310",
    //     "carTypeSeat":5,
    //     "createTime":1554105432000,
    //     "endMile":"2901",
    //     "endNetworkId":"991652808ae64932a75b3dd366cb3efc",
    //     "endNetworkName":"育成基地",
    //     "endOil":"35.0",
    //     "endTime":1554105439000,
    //     "id":"a32b71f98741428fae05e3b10733ac39",
    //     "maxMileageEndurance":"400",
    //     "mileageCharge":"20",
    //     "money":"10.0",
    //     "page":0,
    //     "payType":"3",
    //     "realMoney":"10.0",
    //     "size":0,
    //     "startMile":"2901",
    //     "startNetworkId":"991652808ae64932a75b3dd366cb3efc",
    //     "startNetworkName":"育成基地",
    //     "startOil":"35.0",
    //     "startTime":1554105432000,
    //     "state":4,
    //     "timeCharge":"10",
    //     "totalMile":"0.0",
    //     "useTime":"7.0",
    //     "userId":"",
    //     "x":0,
    //     "y":0
    //   },
    // })
    this.getOrder();
  }

  getOrder() {
    api('/api/dsOrder/queryOrder', { id: this.props.navigation.getParam('id', '') }).then((res) => {
      if(res.data && res.data.success) {
        this.setState({
          carInfo: res.data.data
        })
      } else {
        Toast.show(res.data && res.data.msg || '获取订单信息失败');
      }
    })
  }


  endOrder() {
    Loading.show();
    api('/api/dsOrder/endOrder', {
      id: this.props.navigation.getParam('id', ''),
    }).then(res => {
      if(res.data && res.data.success) {
        Loading.hidden();
        Toast.show('还车成功');
        this.getOrder();
      } else {
        Loading.hidden();
        Toast.show(res.data && res.data.msg || '还车失败');
      }
    })
  }

  submit() {
    Loading.show();
    api('/api/dsOrder/payOrder', {
      id: this.props.navigation.getParam('id', ''),
      payType: 3,
    }).then(res => {
      if(res.data && res.data.success) {
        Loading.hidden();
        Toast.show('支付成功');
        this.getOrder();
      } else {
        Loading.hidden();
        Toast.show(res.data && res.data.msg || '支付失败');
      }
    })
  }

  render() {
    const { carInfo } = this.state;
    return (
      <ScrollView>
      <View style={styles.container}>
        <Image source={{ uri: `${host}${carInfo.carPhoto}` }} style={styles.photo}/>
        <View style={[styles.textView, styles.margin10]}>
          <Text style={styles.name}>{carInfo.carTypeName}  {carInfo.carTypeSeat}座  </Text>
          <Text style={styles.number}>{carInfo.carNumber}  </Text>
          <Image source={IMAGES.oil} style={styles.oil}/>
          <Text style={styles.number}>{carInfo.endOil}L  </Text>
          <Text style={styles.number}>最大续航{carInfo.maxMileageEndurance}公里</Text>
        </View>
        <View style={[styles.textView, styles.margin20]}>
          <Text style={styles.fee}>车辆收费时长</Text>
          <Text style={[styles.fee, styles.fee1]}>{carInfo.timeCharge}</Text>
          <Text style={styles.fee}>元/小时，</Text>
          <Text style={styles.fee}>车辆里程收费</Text>
          <Text style={[styles.fee, styles.fee1]}>{carInfo.mileageCharge}</Text>
          <Text style={styles.fee}>元/公里</Text>
        </View>
        <View style={[styles.textView, styles.textView1, styles.margin20]}>
          <Text style={styles.fee}>取车点：  </Text>
          <Text style={styles.number}>{carInfo.startNetworkName}</Text>
        </View>
        <View style={[styles.textView, styles.textView1, styles.margin10]}>
          <Text style={styles.fee}>还车点：  </Text>
          <Text style={styles.number}>{carInfo.endNetworkName}</Text>
        </View>
        <View style={styles.order}>
          <Text style={[styles.number]}>订单编号：{carInfo.id}</Text>
          <Text style={[styles.number, styles.margin10]}>订单开始时间：{carInfo.startTime && format(carInfo.startTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
          <Text style={[styles.number, styles.margin10]}>订单结束时间：{carInfo.endTime && format(carInfo.endTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
        </View>
        <View style={styles.items}>
          <View style={styles.item}>
            <Text style={styles.time}>{carInfo.useTime}</Text>
            <Text style={styles.number}>总时长/小时</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.time}>{carInfo.totalMile}</Text>
            <Text style={styles.number}>总行程/公里</Text>
          </View>
          <View style={styles.item}>
            <Text style={[styles.time, styles.money]}>{carInfo.money}</Text>
            <Text style={styles.number}>订单总价/元</Text>
          </View>
          <View style={styles.item}>
            <Text style={[styles.time, styles.state]}>{['预约', '使用中', '待付款', '待到账', '已完成', '违章', '取消订单', '违章待查询'][carInfo.state]}</Text>
            <Text style={styles.number}>订单当前状态</Text>
          </View>
        </View>
        {carInfo.state == 2 ? <TouchableOpacity style={styles.submit} onPress={this.submit.bind(this)}>
            <Text style={styles.submitText}>支付</Text>
          </TouchableOpacity> : null}
          {carInfo.state == 1 ? <TouchableOpacity style={styles.submit} onPress={this.endOrder.bind(this)}>
            <Text style={styles.submitText}>结束订单</Text>
          </TouchableOpacity> : null}
      </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  photo: {
    marginTop: p(13),
    width: p(240),
    height: p(120),
    marginBottom: p(13),
  },
  textView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: p(16),
    color: '#2b2b2b',
  },
  number: {
    fontSize: p(12),
    color: '#999',
  },
  oil: {
    height: p(11),
    width: p(8),
  },
  fee: {
    fontSize: p(13),
    color: '#2b2b2b',
  },
  fee1: {
    color: '#71cbbf',
  },
  margin20: {
    marginTop: p(20),
  },
  margin10: {
    marginTop: p(10),
  },
  textView1: {
    alignSelf: 'flex-start',
    marginLeft: p(30),
  },
  order: {
    margin: p(30),
    backgroundColor: '#f2f2f2',
    padding: p(16),
  },
  items: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  time: {
    color: '#2b2b2b',
    fontSize: p(18),
    marginBottom: p(11),
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  money: {
    color: '#F96E0F',
  },
  state: {
    color: '#00B1A0',
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
    marginBottom: p(10),
  },
  submitText: {
    color: '#fff',
    fontSize: p(20),
  },
})
