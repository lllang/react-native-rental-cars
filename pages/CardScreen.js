import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { p } from '../utils/resolutions'
import { api } from '../utils/request';

const IMAGES = {
  check: require('../assets/card/icon-v.png'),
}

class CardScreen extends React.Component{
  static navigationOptions = {
    title: '身份认证',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  state = {
    cardInfo: [],
    cardStatus: 0,
    driveCardStatus: 0,
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      api('/api/dsUserInfo/info', {}).then((res) => {
        if(res.data && res.data.success) {
          this.setState({
            cardInfo: res.data.data,
            cardStatus: res.data.data.find(i => i.key === 'card_id') ? res.data.data.find(i => i.key === 'card_id').isAuthentication : 0,
            driveCardStatus: res.data.data.find(i => i.key === 'driver_license_id') ? res.data.data.find(i => i.key === 'driver_license_id').isAuthentication : 0,
          })
        } else {
          Toast.show(res.data && res.data.msg || '获取证件信息失败');
        }
      })
    })
  }
  componentWillUnmount() {
    // Remove the event listener
    this.focusListener && this.focusListener.remove();
  }
  render() {
    const { cardInfo, cardStatus, driveCardStatus } = this.state;
    const map = ['去认证', '审核中', '已驳回', '已认证'];
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <Image source={IMAGES.check} style={styles.image} />
          <Text style={styles.text}>身份证认证</Text>
          <Text style={styles.text1}>个人用户真实身份确认</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            if (cardStatus === 1) {
              Toast.show('请等待审核');
              return;
            }
            if (cardStatus === 3) {
              Toast.show('无须重复认证');
              return;
            }
            this.props.navigation.push('cardAuth', { cardInfo });
          }}>
            <Text style={styles.buttonText}>{map[cardStatus]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <Image source={IMAGES.check} style={styles.image} />
          <Text style={styles.text}>驾驶证认证</Text>
          <Text style={styles.text1}>有效证件真实身份确认</Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            if (driveCardStatus === 1) {
              Toast.show('请等待审核');
              return;
            }
            if (driveCardStatus === 3) {
              Toast.show('无须重复认证');
              return;
            }
            this.props.navigation.push('driveCardAuth', { cardInfo });
          }}>
            <Text style={styles.buttonText}>{map[driveCardStatus]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fcfc',
    position: 'relative',
    flexDirection: 'row',
    padding: p(15),
    justifyContent: 'space-between',
  },
  item: {
    width: p(165),
    height: p(210),
    backgroundColor: '#00B1A0',
    borderRadius: p(15),
    paddingTop: p(22),
    paddingBottom: p(22),
    alignItems: 'center',
  },
  image: {
    width: p(50),
    height: p(50),
    marginBottom: p(8),
  },
  text: {
    color: '#fff',
    fontSize: p(24),
    marginBottom: p(9),
  },
  text1: {
    color: '#fff',
    fontSize: p(12),
    marginBottom: p(22),
  },
  button: {
    width: p(140),
    height: p(42),
    borderWidth: p(1),
    borderColor: '#fff',
    borderRadius: p(21),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: p(15),
  }
})
export default connect(state => ({
  userInfo: state.app.userInfo
}))(CardScreen)
