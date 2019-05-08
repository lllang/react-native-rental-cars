import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native'
import { MapView, Marker, Polygon } from 'react-native-amap3d'
import { p } from '../utils/resolutions'
import PropTypes from 'prop-types'
import Dialog from "react-native-dialog";
import { post } from '../utils/request'
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux'
import Toast from 'react-native-simple-toast'

const IMAGES = {
  user: require('../assets/home/icon-user.png'),
  map: require('../assets/home/icon-map.png'),
  pin: require('../assets/home/start.png'),
  close: require('../assets/home/error.png'),
  right: require('../assets/home/icon-right.png'),
  oil: require('../assets/card/icon-electric.png'),
  clear: require('../assets/home/clear.png'),
}

class SelectMap extends React.Component{
  static contextTypes = {
    actions: PropTypes.object
  }
  static navigationOptions = {
    header: null,
  }
  state = {
    lat: 39.91095,
    firstLat: '',
    firstLng: '',
    lng: 116.37296,
    netWorkList: [],
    zoomLevel: 15,
    centerLat: '',
    centerLng: '',
    item: {},
  }
  marker = [];
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
  _logStatusChangeCompleteEvent = ({ nativeEvent }) => {
    this.setState({
      centerLat: nativeEvent.latitude,
      centerLng: nativeEvent.longitude,
    })
    this.getCars({
      lat: nativeEvent.latitude,
      lng: nativeEvent.longitude,
      zoomLevel: nativeEvent.zoomLevel,
    })
  }

  load = (index) => {
    this.marker[index].componentDidUpdate()
    setTimeout(() => this.marker[index].componentDidUpdate(), 200)
  }

  showDialog = (item) => {
    this.setState({ dialogVisible: true, item });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false, item: {} });
  };

  selectNetwork = () => {
    if (this.props.navigation.getParam('edit')) {
      post('/api/dsOrder/modifyNet', {
        id: this.props.navigation.getParam('id'),
        endNetworkId: this.state.item.id
      }).then(res => {
        if (res.data && res.data.success) {
          this.context.actions.updateSelected({ endNetworkId: this.state.item.id, endNetworkName: this.state.item.name })
          this.props.navigation.pop()
        } else {
          Toast.show(res.data && res.data.msg || '修改失败');
        }
      })
    } else {
      this.props.navigation.pop()
      this.context.actions.updateSelected({ endNetworkId: this.state.item.id, endNetworkName: this.state.item.name })
    }
  }

  render() {
    const { firstLat, firstLng, netWorkList, item } = this.state
    return (
      <SafeAreaView style={styles.container}>
      <MapView
        ref="map"
        locationEnabled
        onLocation={({ nativeEvent }) => {
          this.setState({
            lat: nativeEvent.latitude,
            lng: nativeEvent.longitude,
            firstLat: firstLat ? firstLat : nativeEvent.latitude,
            firstLng: firstLng ? firstLng : nativeEvent.longitude,
          })
        }}
        showsLocationButton = {true}
        rotateEnabled = {false}
        showsZoomControls = {true}
        zoomLevel = {15}
        style={{ position: 'absolute', top: p(40), bottom: 0, left: 0, right: 0, zIndex: 1 }}
        coordinate={{ latitude: Number(firstLat), longitude: Number(firstLng) }}
        onStatusChangeComplete={this._logStatusChangeCompleteEvent}
      >
        {netWorkList && netWorkList.length > 0 ? netWorkList.map((item, index) => 
          <Marker ref={ref => this.marker[index] = ref} onPress={this.showDialog.bind(this, item)} coordinate={{latitude: Number(item.latitude), longitude: Number(item.longitude)}} key={item.id} icon={() => (
              <TouchableOpacity><ImageBackground onLoadEnd={this.load.bind(this, index)} source={IMAGES.map} style={{ width: p(36), height: p(36), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: p(15), color: '#fff', position: 'relative', top: p(-2) }}>{item.num}</Text>
              </ImageBackground></TouchableOpacity>
          )}>
          <View></View>
        </Marker>
        ) : null}
        {netWorkList && netWorkList.length > 0 ? netWorkList.map((item, index) => 
          <Polygon key={index} coordinates={item.apiNetWorkPointList.map(i => ({latitude: Number(i.latitude), longitude: Number(i.longitude)}))} strokeWidth={3} strokeColor="#999" fillColor="transparent"/>
        ) : null}
        </MapView>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>提醒</Dialog.Title>
          <Dialog.Description>
            确定要选择{item.name}作为停车点吗？
          </Dialog.Description>
          <Dialog.Button label="确定" onPress={this.selectNetwork} />
          <Dialog.Button label="取消" onPress={this.handleCancel} />
        </Dialog.Container>
      </SafeAreaView>
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
    zIndex: 2,
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
    zIndex:3,
  },
  carList: {
    position: 'absolute',
    top: p(100),
    padding: p(10),
    overflow: 'hidden',
    height: p(325),
    left: 0,
    right: 0,
    zIndex: 4,
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
    zIndex: 4,
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
    marginLeft: p(10),
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
    zIndex: 5,
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
    marginTop: p(10),
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
  tips: {
    position: 'absolute',
    top: p(50),
    zIndex: 10,
    left: p(50),
    padding: p(5),
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: p(20),
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }
})

export default connect(state => ({
  position: state.app.position
}))(SelectMap)