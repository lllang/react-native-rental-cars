import ImagePicker from 'react-native-image-picker';
import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native'
import Toast from 'react-native-simple-toast';
import { connect } from 'react-redux';
import { format } from 'date-fns'
import DatePicker from '../components/DatePicker'
import { p } from '../utils/resolutions'
import { api } from '../utils/request';
import host from '../utils/config';

const IMAGES = {
  front: require('../assets/card/car-license.png'),
}

class DriveCardAuthScreen extends React.Component{
  static navigationOptions = {
    title: '驾驶证认证',
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
  cardInfo = this.props.navigation.getParam('cardInfo', [])
  state = {
    code: this.cardInfo.find(i => i.key === 'driver_license_id') && this.cardInfo.find(i => i.key === 'driver_license_id').value || '',
    driverFile: this.cardInfo.find(i => i.key === 'driver_license_url') && this.cardInfo.find(i => i.key === 'driver_license_url').value
    ? `${host}${this.cardInfo.find(i => i.key === 'driver_license_url').value}` : '',
    front: '',
    driverLicenseStartTime: this.cardInfo.find(i => i.key === 'driver_license_start_time') && this.cardInfo.find(i => i.key === 'driver_license_start_time').value || '',
    driverLicenseEndTime: this.cardInfo.find(i => i.key === 'driver_license_end_time') && this.cardInfo.find(i => i.key === 'driver_license_end_time').value || '',
  }
  submit = () => {
    const { code, front, driverLicenseStartTime, driverLicenseEndTime, driverFile } = this.state;
    if (!code || !driverFile || !driverLicenseStartTime || !driverLicenseEndTime) {
      Toast.show('请填写完整信息');
    }
    api('/api/dsUserInfo/saveDriverUpdate', {
      driverLicenseId: code,
      driverLicenseEndTime,
      driverLicenseStartTime,
      driverLicenseUrl: driverFile,
    }).then(res => {
      if (res.data.success) {
        Toast.show('提交成功');
        this.props.navigation.pop();
      } else {
        Toast.show(res.data && res.data.msg);
      }
    })
    
  }
  onButtonPress = (type) => {
    this.refs.datePicker.show({
      title: '请选择',
      mode: 'date',
      minuteInterval: 10,
      onSubmit: (date) => {
        this.setState({
          [type]: format(date, 'YYYY-MM-DD'),
        });
      },
    });
  }
  componentWillMount() {
    api('/api/dsUserInfo/info', {}).then((res) => {
      console.log(res);
    })
  }
  onPickPhotoClicked = () => {
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
        api('/api/dsUserInfo/addPhoto', {imgUrl: `data:image/jpeg;base64,${response.data}`, imgType: 'driverFile'}).then(res => {
          console.log(res);
          this.setState({
            driverFile: `data:image/jpeg;base64,${response.data}`,
            front: res.data.data
          });
        })
      }
    });
  };
  render() {
    const { driverFile, driverLicenseStartTime, driverLicenseEndTime, code } = this.state;
    return (
      <ScrollView style={styles.container}>
      <View style={{ backgroundColor: '#fff', paddingBottom: p(10)}}>
        <TextInput style={styles.input1} placeholder='请输入证件号码' value={code} onChangeText={(value) => { this.setState({ code: value }) }}/>
        <TouchableOpacity style={styles.input1} onPress={this.onButtonPress.bind(this, 'driverLicenseStartTime')}>
          <Text style={styles.date}>{driverLicenseStartTime || '请选择开始时间'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input1} onPress={this.onButtonPress.bind(this, 'driverLicenseEndTime')}>
          <Text style={styles.date}>{driverLicenseEndTime || '请选择开始时间'}</Text>
        </TouchableOpacity>
      </View>
        <Text style={styles.text}>驾驶证照片</Text>
        <TouchableOpacity onPress={this.onPickPhotoClicked.bind(this)}>
          <Image source={driverFile ? {uri: driverFile} : IMAGES.front} style={styles.image}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={this.submit}>
          <Text style={styles.submitText}>提交</Text>
        </TouchableOpacity>
        <DatePicker ref="datePicker" />
      </ScrollView>
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
}))(DriveCardAuthScreen)
