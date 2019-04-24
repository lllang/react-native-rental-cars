import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Modal } from 'react-native'
import { MapView, Marker } from 'react-native-amap3d'
import { p } from '../utils/resolutions'
import PropTypes from 'prop-types'
import { post, api } from '../utils/request'
import Picker from '../components/Picker';
import host from '../utils/config'
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'
import format from 'date-fns/format';

const IMAGES = {
  user: require('../assets/home/icon-user.png'),
  map: require('../assets/home/icon-map.png'),
  pin: require('../assets/home/start.png'),
  close: require('../assets/home/error.png'),
  right: require('../assets/home/icon-right.png'),
  oil: require('../assets/card/icon-electric.png'),
  clear: require('../assets/home/clear.png'),
}

class HomeScreen extends React.Component{
  static contextTypes = {
    actions: PropTypes.object
  }
  static navigationOptions = {
    header: null,
  }
  state = {
    lat: 39.91095,
    lng: 116.37296,
    netWorkList: [],
    zoomLevel: 15,
    showCarList: false, // 是否展示车辆列表
    showCar: false, // 是否展示车辆详情
    carInfo: {}, // 要展示的车辆详情信息
    startNetworkId: '',
    endNetworkId: '',
    getCar: '',
    refundCar: '',
    showUseCar: false,
    useCarInfo: {},
    psw: '',
    visible: false,
  }
  marker = [];
  openDrawer = () => {
    this.props.navigation.openDrawer();
  }
  componentDidMount() {
    this.props.navigation.closeDrawer();
  }
  componentWillMount() {
    this.getPosition();
  }
  getCars(coor) {
    post('/app/dsCarNetwork/getNetWork', {
      y: coor.lat,
      x: coor.lng,
      r: Math.pow(2, 21 - coor.zoomLevel) * 0.2
    }).then(res => {
      if (res.data && res.data.success) {
        this.setState({
          netWorkList: res.data.data
        })
      }
    })
  }
  getPosition() {
    navigator.geolocation.watchPosition((a) => {
      this.setState({
        lat: a.coords.latitude,
        lng: a.coords.longitude,
      })
      this.context.actions.updatePosition({
        lat: a.coords.latitude,
        lng: a.coords.longitude,
      })
    }, (b) => {
    }, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 2000,
      distanceFilter: 5,
    })
  }
  _logStatusChangeCompleteEvent = ({ nativeEvent }) => {
    this.getCars({
      lat: nativeEvent.latitude,
      lng: nativeEvent.longitude,
      zoomLevel: nativeEvent.zoomLevel,
    })
  }

  netWorkPress(item) {
    post('/app/dsCarNetworkUse/getNetCar', { networkId: item.id }).then(res => {
      if (res.data && res.data.success) {
        if (res.data.data.length) {
          this.setState({
            carList: res.data.data,
            showCarList: true,
            getCar: item.name,
            startNetworkId: item.id,
          })
        } else {
          Toast.show('当前网点无车辆')
        }
      }
    })
  }

  carPress(item) {
    this.setState({
      showCarList: false,
      showCar: true,
      carInfo: item,
    })
  }

  cancelPress = () => {
    this.setState({
      showCar: false,
      showCarList: true,
      refundCar: '',
      endNetworkId: '',
    })
  }

  confirmPress(item) {
    if(!this.state.endNetworkId) {
      Toast.show('请先选择还车网点');
      return;
    }
    api('/api/dsOrder/addOrder', {
      carId: item.dsCar.id,
      startNetworkId: this.state.startNetworkId,
      endNetworkId: this.state.endNetworkId,
      state: 1,
    }).then(res => {
      if (res.data && res.data.success) {
        Toast.show('用车成功');
        this.setState({
          showUseCar: true,
          showCar: false,
          useCarInfo: res.data.data,
        })
      } else {
        Toast.show(res.data && res.data.msg || '用车失败');
      }
    })
    // this.setState({
    //   showUseCar: true,
    //   showCar: false,
    //   useCarInfo: {carId :"3f78b9b2f58043f7a9404aa03cf20d95",
    //   carNumber :"闽C98SZ0",
    //   carTypeName :"宝骏510",
    //   carTypeSeat :5,
    //   createTime :1555594747000,
    //   dsCar :{areaId: "350503", carId: "闽C98SZ0", carType: "1", cityId: "350500", engineId: "undefined",id: '3f78b9b2f58043f7a9404aa03cf20d95', state: 1},
    //   dsCarType :{id: "1", maxMileageEndurance: "500", mileageBonus: "2", mileageCharge: "12", name: "宝骏510",photo: '/uploads/car/12416937758862.png', price: 150000, seat: 5, timeCharge: 9},
    //   endNetworkId :"065c1b018b3e46c7b0f41e20736df3a4",
    //   endNetworkName :"中骏世界城",
    //   id :"6a3aeb0e2977452e875dd38df762e11e",
    //   maxMileageEndurance :"500",
    //   mileageCharge :"12",
    //   page :0,
    //   returnCreateTime :"2019-04-18 21:39:07",
    //   returnStartTime :"2019-04-18 21:39:07",
    //   size :0,
    //   startMile :"126",
    //   startNetworkId :"b5fed486661e4a85b0726a1cc0acdcf3",
    //   startNetworkName :"东湖公园",
    //   startOil :"20.0",
    //   startTime :1555594747000,
    //   state :1,
    //   timeCharge :"9",
    //   userId :"",
    //   x :0,
    //   y:0}
    // });
  }
  
  getCar = () => {
    this.refs.picker.show({
      title: '请选择',
      options: this.state.netWorkList.map(i => ({ label: i.name, value: i.id })),
      onSubmit: (option) => {
        this.setState({
          startNetworkId: option.value,
          getCar: option.label,
        })
      },
    })
  }

  refundCar = () => {
    this.refs.picker.show({
      title: '请选择',
      options: this.state.netWorkList.map(i => ({ label: i.name, value: i.id })),
      onSubmit: (option) => {
        this.setState({
          endNetworkId: option.value,
          refundCar: option.label,
        })
      },
    })
  }

  op(type) {
    api('/api/dsCar/opCar', {
      id: this.state.useCarInfo.id,
      op: type
    }).then(res => {
      if(res.data && res.data.success) {
        Toast.show(type === 7 ? '开门成功' : '关门成功');
      } else {
        Toast.show(res.data && res.data.msg || type === 7 ? '开门失败' : '关门失败');
      }
    })
  }

  endOrder() {
    api('/api/dsOrder/endOrder', {
      id: this.state.useCarInfo.id,
    }).then(res => {
      if(res.data && res.data.success) {
        Toast.show('还车成功');
      } else {
        Toast.show(res.data && res.data.msg || '还车失败');
        this.props.navigation.push('orderDetail', { id: this.state.useCarInfo.id })
      }
    })
  }

  findCar() {
    api('/api/dsCar/findCar', {
      carId: this.state.useCarInfo.dsCar.id,
      op: 3,
      y: this.state.lat,
      x: this.state.lng,
    }).then(res => {
      if(res.data && res.data.success) {
        Toast.show('操作成功');
      } else {
        Toast.show(res.data && res.data.msg || '操作失败');
      }
    })
  }

  carPosition() {
    Toast.show('开发中');
  }

  showPsw() {
    Toast.show(this.state.psw || this.state.carInfo.password, Toast.LONG);
  }

  refresh() {
    api('/api/dsCar/refreshPaw', {
      carId: this.state.useCarInfo.dsCar.id,
    }).then(res => {
      if(res.data && res.data.success) {
        this.setState({
          psw: res.data.data,
        }, this.showPsw)
      } else {
        Toast.show(res.data && res.data.msg || '操作失败');
      }
    })
  }

  clear() {
    this.setState({
      showCarList: false, // 是否展示车辆列表
      showCar: false, // 是否展示车辆详情
      carInfo: {}, // 要展示的车辆详情信息
      startNetworkId: '',
      endNetworkId: '',
      getCar: '',
      refundCar: '',
      showUseCar: false,
      useCarInfo: {},
      psw: '',
      visible: false,
    })
  }

  load = (index) => {
    this.marker[index].componentDidUpdate()
    setTimeout(() => this.marker[index].componentDidUpdate(), 200)
  }

  render() {
    const coordinate = this.props && this.props.position && this.props.position.lat ? {
      latitude: this.props.position.lat,
      longitude: this.props.position.lng,
    } : {
      latitude: this.state.lat,
      longitude: this.state.lng
    }
    const { carList, netWorkList, showCarList, showCar, carInfo, getCar, refundCar, showUseCar, useCarInfo, psw, visible, lat, lng } = this.state
    return (
      <View style={styles.container}>
      
          <MapView
            ref="map"
            showsLocationButton = {true}
            rotateEnabled = {false}
            showsZoomControls = {true}
            zoomLevel = {15}
            style={{ height: '100%', height: '100%', backgroundColor: 'red', zIndex: 1 }}
            coordinate={{"latitude": lat,
            "longitude": lng}}
            onStatusChangeComplete={this._logStatusChangeCompleteEvent}
          >
            <Marker coordinate={{"latitude": lat,
            "longitude": lng}} icon={() => (
                <Image source={IMAGES.pin} style={{ width: p(22), height: p(33) }}>
                </Image>
            )}>
            </Marker>
            {netWorkList && netWorkList.length > 0 ? netWorkList.map((item, index) => 
              <Marker ref={ref => this.marker[index] = ref} onPress={this.netWorkPress.bind(this, item)} coordinate={{latitude: Number(item.latitude), longitude: Number(item.longitude)}} key={item.id} icon={() => (
                  <TouchableOpacity><ImageBackground onLoadEnd={this.load.bind(this, index)} source={IMAGES.map} style={{ width: p(36), height: p(36), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: p(15), color: '#fff', position: 'relative', top: p(-2) }}>{item.total}</Text>
                  </ImageBackground></TouchableOpacity>
              )}>
              <View></View>
            </Marker>
            ) : null}
            </MapView>
        {showCarList ? <View style={styles.mask}>
          <ScrollView style={styles.carList}>
            {carList.map(item =>
            <TouchableOpacity style={styles.car} key={item.dsCar.carId} onPress={this.carPress.bind(this, item)}>
              <View style={styles.top}>
                <Image source={{ uri: `${host}${item.dsCar && item.dsCar.photo}`}} style={styles.image}/>
                <View style={{ justifyContent: 'space-around' }}>
                  <View style={styles.row}>
                    <Text style={styles.name}>{item.dsCarType && item.dsCarType.name}   {item.dsCarType && item.dsCarType.seat}座  </Text>
                    <Text style={styles.state}>{['空闲', '出租中', '已预约', '异常', '临时停靠'][item.dsCar && item.dsCar.state || 0]}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.number}>{item.dsCar && item.dsCar.carId}  </Text>
                    <Image source={IMAGES.oil} style={styles.oil}/>
                    <Text style={styles.number}>{item.dsCar && item.dsCar.carInfoList && item.dsCar.carInfoList[0] && item.dsCar.carInfoList[0].soc}L  </Text>
                  </View>
                </View>
                <Image source={IMAGES.right} style={styles.right}/>
              </View>
              <View style={[styles.row, styles.margin20]}>
                <Text style={styles.fee}>车辆收费时长</Text>
                <Text style={[styles.fee, styles.fee1]}>{item.dsCarType.timeCharge}</Text>
                <Text style={styles.fee}>元/小时，</Text>
                <Text style={styles.fee}>车辆里程收费</Text>
                <Text style={[styles.fee, styles.fee1]}>{item.dsCarType.mileageCharge}</Text>
                <Text style={styles.fee}>元/公里</Text>
              </View>
            </TouchableOpacity>)}
          </ScrollView>
          <TouchableOpacity style={styles.closeOpacity} onPress={() => { this.setState({ showCarList: false }); }}>
            <Image style={styles.close} source={IMAGES.close}></Image>
          </TouchableOpacity>
        </View> : null}
        {showCar ? <View style={styles.mask}>
          <View style={styles.carInfo}>
          <TouchableOpacity style={styles.clearOpacity} onPress={this.clear.bind(this)}><Image source={IMAGES.clear} style={styles.clear} onPress={this.clear.bind(this)}/></TouchableOpacity>
            <Image source={{ uri: `${host}${carInfo.dsCar && carInfo.dsCar.photo}`}} style={styles.detailImage}/>
            <View style={styles.textView1}>
              <Text style={styles.name}>{carInfo.dsCarType && carInfo.dsCarType.name}   {carInfo.dsCarType && carInfo.dsCarType.seat}座  </Text>
              <View style={styles.row}>
                <Text style={styles.number}>{carInfo.dsCar && carInfo.dsCar.carId}  </Text>
                <Image source={IMAGES.oil} style={styles.oil}/>
                <Text style={styles.number}>{carInfo.dsCar && carInfo.dsCar.carInfoList && carInfo.dsCar.carInfoList[0] && carInfo.dsCar.carInfoList[0].soc}L  最大续航{carInfo.dsCarType.maxMileageEndurance}公里</Text>
              </View>
            </View>
            <View style={[styles.row, styles.margin20]}>
              <Text style={styles.fee}>车辆收费时长</Text>
              <Text style={[styles.fee, styles.fee1]}>{carInfo.dsCarType.timeCharge}</Text>
              <Text style={styles.fee}>元/小时，</Text>
              <Text style={styles.fee}>车辆里程收费</Text>
              <Text style={[styles.fee, styles.fee1]}>{carInfo.dsCarType.mileageCharge}</Text>
              <Text style={styles.fee}>元/公里</Text>
            </View>
            <TouchableOpacity style={[styles.point, styles.borderBottom]}>
              <Text style={styles.getCar}>取车点：</Text>
              <Text style={styles.getCarText}>{getCar || '请选择'}</Text>
              <Image source={IMAGES.right} style={styles.iconRight}/>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.point]} onPress={this.refundCar}>
              <Text style={styles.getCar}>还车点：</Text>
              <Text style={styles.getCarText}>{refundCar || '请选择'}</Text>
              <Image source={IMAGES.right} style={styles.iconRight}/>
            </TouchableOpacity>
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button, styles.cancel]} onPress={this.cancelPress}>
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.pass]} onPress={this.confirmPress.bind(this, carInfo)}>
                <Text style={styles.passText}>确认订单</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> : null}
        {showUseCar ? <View style={styles.mask}>
          <View style={[styles.carInfo, styles.carInfo1]}>
            <TouchableOpacity style={styles.clearOpacity} onPress={this.clear.bind(this)}><Image source={IMAGES.clear} style={styles.clear} onPress={this.clear.bind(this)}/></TouchableOpacity>
            <Image source={{ uri: `${host}${useCarInfo.dsCar && useCarInfo.dsCar.photo}`}} style={styles.detailImage}/>
            <View style={styles.textView1}>
              <Text style={styles.name}>{useCarInfo.dsCarType && useCarInfo.dsCarType.name}   {useCarInfo.dsCarType && useCarInfo.dsCarType.seat}座  </Text>
              <View style={styles.row}>
                <Text style={styles.number}>{useCarInfo.dsCar && useCarInfo.dsCar.carId}  </Text>
                <Image source={IMAGES.oil} style={styles.oil}/>
                <Text style={styles.number}>{useCarInfo.dsCar && useCarInfo.dsCar.carInfoList && useCarInfo.dsCar.carInfoList[0] && useCarInfo.dsCar.carInfoList[0].soc}L  最大续航{useCarInfo.dsCarType.maxMileageEndurance}公里</Text>
              </View>
            </View>
            <View style={[styles.row, styles.margin20, styles.margin30]}>
              <Text style={styles.fee}>车辆收费时长</Text>
              <Text style={[styles.fee, styles.fee1]}>{useCarInfo.dsCarType.timeCharge}</Text>
              <Text style={styles.fee}>元/小时，</Text>
              <Text style={styles.fee}>车辆里程收费</Text>
              <Text style={[styles.fee, styles.fee1]}>{useCarInfo.dsCarType.mileageCharge}</Text>
              <Text style={styles.fee}>元/公里</Text>
            </View>
            <TouchableOpacity style={[styles.point, styles.point1]}>
              <Text style={styles.getCar}>取车点：</Text>
              <Text style={styles.getCarText}>{useCarInfo.startNetworkName}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.point, styles.point1]}>
              <Text style={styles.getCar}>还车点：</Text>
              <Text style={styles.getCarText}>{useCarInfo.endNetworkName}</Text>
            </TouchableOpacity>
            <View style={styles.price}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.number}>订单总价： </Text>
                <Text style={styles.priceNum}>0元</Text>
              </View>
              <Text style={styles.number}>订单开始时间:  {format(useCarInfo.startTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity style={[styles.button1, styles.blue]} onPress={this.op.bind(this, 7)}>
                <Text style={styles.blueText}>开门</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.white]} onPress={this.op.bind(this, 8)}>
                <Text style={styles.whiteText}>关门</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.blue]} onPress={this.endOrder.bind(this)}>
                <Text style={styles.blueText}>还车</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.white]} onPress={this.findCar.bind(this)}>
                <Text style={styles.whiteText}>找车</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button1, styles.blue]} onPress={this.carPosition.bind(this)}>
                <Text style={styles.blueText}>车辆定位</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.blue]} onPress={this.showPsw.bind(this)}>
                <Text style={styles.blueText}>显示密码</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button1, styles.blue]} onPress={this.refresh.bind(this)}>
                <Text style={styles.blueText}>刷新密码</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View> : null}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconUserOpacity} onPress={this.openDrawer}>
            <Image source={IMAGES.user} style={styles.iconUser}/>
          </TouchableOpacity>
        </View>
        <Modal visible={visible} onPress={() => {this.setState({visible: false})}}>
          <Text>最新密码为{psw || useCarInfo.password}</Text>
        </Modal>
        <Picker ref="picker" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  header: {
    height: p(40),
    position: 'absolute',
    zIndex: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: '100%',
  },
  iconUser: {
    height: p(20),
    width: p(20),
  },
  iconUserOpacity: {
    height: p(20),
    width: p(20),
    marginLeft: p(12),
    marginTop: p(9),
  },
  mask: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex:99,
  },
  carList: {
    position: 'absolute',
    top: p(100),
    padding: p(10),
    overflow: 'hidden',
    height: p(325),
    left: 0,
    right: 0,
    zIndex: 999,
  },
  car: {
    marginBottom: p(10),
    height: p(150),
    backgroundColor: '#fff',
    borderRadius: p(5),
    padding: p(10),
  },
  closeOpacity: {
    position: 'absolute',
    top: p(500),
    left: p(177.5),
    zIndex: 999,
    borderRadius: p(10),
    overflow: 'hidden',
  },
  close: {
    width: p(20),
    height: p(20),
  },
  top: {
    height: p(90),
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    width: '100%',
    padding: p(16),
    flexDirection: 'row',
  },
  image: {
    height: p(58),
    width: p(120),
    marginRight: p(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#2b2b2b',
    fontSize: p(14),
  },
  priceNum: {
    fontSize: p(14),
    color: '#f87c31',
  },
  number: {
    color: '#999',
    fontSize: p(12),
  },
  oil: {
    height: p(11),
    width: p(8),
  },
  state: {
    color: '#fff',
    backgroundColor: '#33c5ae',
    padding: p(2),
    fontSize: p(13),
  },
  right: {
    height: p(20),
    width: p(10),
    alignSelf: 'center',
    marginLeft: p(30),
  },
  fee: {
    fontSize: p(13),
    color: '#2b2b2b',
  },
  fee1: {
    color: '#71cbbf',
  },
  margin20: {
    marginTop: p(16),
    alignSelf: 'center',
    marginBottom: p(12),
  },
  margin30: {
    marginBottom: p(5),
    marginTop: p(10),
  },
  carInfo: {
    position: 'absolute',
    height: p(400),
    left: p(13),
    right: p(13),
    bottom: p(30),
    backgroundColor: '#fff',
    borderRadius: p(5),
    alignItems: 'center',
    padding: p(10),
  },
  clear: {
    width: p(20),
    height: p(20),
  },
  clearOpacity: {
    position: 'absolute',
    right: -p(10),
    top: -p(10),
    zIndex: 9999,
    backgroundColor: '#fff',
    borderRadius: p(20),
    
  },
  carInfo1: {
    height: p(500),
  },
  detailImage: {
    height: p(110),
    width: p(240),
    marginTop: p(20),
  },
  textView1: {
    marginTop: p(15),
    flexDirection: 'row',
  },
  point: {
    height: p(45),
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: p(8),
  },
  point1: {
    height: p(20),
  },
  borderBottom: {
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
  },
  getCarText: {
    fontSize: p(13),
    color: '#999',
  },
  getCar: {
    fontSize: p(13),
    color: '#2b2b2b',
    marginLeft: p(10),
  },
  iconRight: {
    width: p(12),
    height: p(12),
    position: 'absolute',
    right: p(20),
    top: p(20),
  },
  buttons: {
    marginTop: p(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button1: {
    flex: 1,
    margin: p(2),
    borderRadius: p(23),
    height: p(45),
    backgroundColor: '#fff',
    borderColor: '#dbdbdb',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blue: {
    backgroundColor: '#03c38d',
  },
  blueText: {
    color: '#fff',
  },
  whiteText: {
    color: '#999',
  },
  button: {
    width: p(140),
    height: p(45),
    borderRadius: p(23),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#dbdbdb',
    borderWidth: 1,
    marginLeft: p(10),
    marginRight: p(10),
  },
  cancel: {
    backgroundColor: '#fff',
  },
  cancelText: {
    fontSize: p(15),
    color: '#9c9c9c',
  },
  pass: {
    backgroundColor: '#00B1A0',
  },
  passText: {
    color: '#fff',
  },
  price: {
    margin: p(20),
    marginTop: p(5),
    marginBottom: p(5),
    width: '100%',
    padding: p(20),
    backgroundColor: '#f2f2f2',
  },
})

export default connect(state => ({
  position: state.app.position
}))(HomeScreen)