import ImagePicker from 'react-native-image-picker';
import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { p } from '../utils/resolutions'
import { api } from '../utils/request';
import Picker from '../components/Picker'
import host from '../utils/config'

const IMAGES = {
  front: require('../assets/card/idcard-pos.png'),
  end: require('../assets/card/idcard-side.png'),
}

class CardAuthScreen extends React.Component{
  static navigationOptions = {
    title: '身份认证',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  cardInfo = this.props.navigation.getParam('cardInfo', [])
  state = {
    code: this.cardInfo.find(i => i.key === 'card_id') && this.cardInfo.find(i => i.key === 'card_id').value || '',
    front: this.cardInfo.find(i => i.key === 'card_front_url') && this.cardInfo.find(i => i.key === 'card_front_url').value
    ? `${this.cardInfo.find(i => i.key === 'card_front_url').value}` : '',
    end: this.cardInfo.find(i => i.key === 'card_back_url') && this.cardInfo.find(i => i.key === 'card_back_url').value
    ? `${this.cardInfo.find(i => i.key === 'card_back_url').value}` : '',
    cardType: this.cardInfo.find(i => i.key === 'card_type') && this.cardInfo.find(i => i.key === 'card_type').value || '',
    reason: this.cardInfo.find(i => i.key === 'card_id') && this.cardInfo.find(i => i.key === 'card_id').reason || '',
    isAuthentication: this.cardInfo.find(i => i.key === 'card_id') && this.cardInfo.find(i => i.key === 'card_id').isAuthentication || 0,
  }
  submit = () => {
    const { code, cardType, front, end } = this.state;
    if (!code || !end || !front || !cardType) {
      Toast.show('请填写完整信息');
      return;
    }
    if (!/[0-9xX]/g.test(code)) {
      Toast.show('请检查证件号码');
      return;
    }
    api('/api/dsUserInfo/saveUpdate', {
      cardId: this.state.code,
      cardType: cardType,
      cardFrontUrl: front,
      cardBackUrl: end
    }).then(res => {
      if (res.data && res.data.success) {
        Toast.show('提交成功');
        this.props.navigation.pop();
      } else {
        Toast.show(res.data && res.data.msg);
      }
    })
  }
  onButtonPress = () => {
    this.refs.picker.show({
      title: '请选择',
      options: [{label: '身份证', value: 1}, {label: '护照', value: 2}],
      onSubmit: (option) => {
        this.setState({
          cardType: option.value,
        })
      },
    });
  }
  componentWillMount() {
    api('/api/dsUserInfo/info', {}).then((res) => {
      console.log(res);
    })
  }
  onPickPhotoClicked = (type) => {
    const options = {
      title: '选择照片',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.6,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      permissionDenied: {
        title: '应用没权限选择照片',
        text: '请确认应用有权限访问照片以及用相机拍照',
        reTryTitle: '重试',
        okTitle: '确定',
      },
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '用手机拍照...',
      chooseFromLibraryButtonTitle: '从手机相册中找...',
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.data) {
        api('/api/dsUserInfo/addPhoto', {imgUrl: `data:image/jpeg;base64,${response.data}`, imgType: type}).then(res => {
          console.log(res);
          if (type === 'handleFile') {
            this.setState({
              front: `${res.data.data}`
            });
          } else {
            this.setState({
              end: `${res.data.data}`
            })
          }
        })
      }
    });
  };
  render() {
    const { userInfo } = this.props;
    const { front, end, cardType, code, isAuthentication, reason } = this.state;
    return (
      <View style={styles.container}>
      <ScrollView >
        <View style={{ backgroundColor: '#fff', paddingBottom: p(10)}}>
        {isAuthentication === 2 ? <Text style={{ color: '#df8889', alignSelf: 'center', marginTop: p(5) }}>驳回理由：{reason}</Text> : null}
        <TouchableOpacity style={styles.input1} onPress={this.onButtonPress.bind(this)}>
          <Text style={styles.date}>{['', '身份证', '护照'][cardType] || '请选择'}</Text>
        </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: '#fff', paddingBottom: p(10)}}>
          <TextInput style={styles.input1} placeholder='请输入证件号码' value={code} onChangeText={(value) => { this.setState({ code: value.replace(/[^0-9Xx]/g, '') }) }}/>
        </View>
        <Text style={styles.text}>身份证正面</Text>
        <TouchableOpacity onPress={this.onPickPhotoClicked.bind(this, 'handleFile')}>
          <Image source={front ? {uri: `${host}${front}`} : IMAGES.front} style={styles.image}/>
        </TouchableOpacity>
        <Text style={styles.text}>身份证反面</Text>
        <TouchableOpacity onPress={this.onPickPhotoClicked.bind(this, 'backFile')}>
          <Image source={end ? {uri: `${host}${end}`} : IMAGES.end} style={styles.image}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={this.submit}>
          <Text style={styles.submitText}>提交</Text>
        </TouchableOpacity>
      </ScrollView>
        <Picker ref="picker" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fcfc',
  },
  input1: {
    marginTop: p(23),
    marginLeft: p(23),
    marginRight: p(23),
    fontSize: p(16),
    borderBottomWidth: p(1),
    borderBottomColor: '#e5e5e5',
    padding: 0,
    paddingBottom: p(11),
    paddingLeft: p(9), 
  },
  image: {
    height: p(228),
    width: p(347),
    marginLeft: p(15),
    marginRight: p(15),
  },
  text: {
    margin: p(15),
  },
  submit: {
    marginTop: p(40),
    marginBottom: p(40),
    width: p(300),
    height: p(50),
    backgroundColor: '#00B1A0',
    alignSelf: 'center',
    borderRadius: p(25),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  submitText: {
    color: '#fff',
    fontSize: p(20),
  },
  date: {
    fontSize: p(16),
    color: '#c9c9c9',
  },
})
export default connect(state => ({
  userInfo: state.app.userInfo
}))(CardAuthScreen)
