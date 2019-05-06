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
    ? `${this.cardInfo.find(i => i.key === 'driver_license_url').value}` : '',
    copyDriverLicenseUrl: this.cardInfo.find(i => i.key === 'copy_driver_license_url') && this.cardInfo.find(i => i.key === 'copy_driver_license_url').value
    ? `${this.cardInfo.find(i => i.key === 'copy_driver_license_url').value}` : '',
    fileNumber: this.cardInfo.find(i => i.key === 'file_number') && this.cardInfo.find(i => i.key === 'file_number').value || '',
    driverLicenseStartTime: this.cardInfo.find(i => i.key === 'driver_license_start_time') && this.cardInfo.find(i => i.key === 'driver_license_start_time').value || '',
    driverLicenseEndTime: this.cardInfo.find(i => i.key === 'driver_license_end_time') && this.cardInfo.find(i => i.key === 'driver_license_end_time').value || '',
    reason: this.cardInfo.find(i => i.key === 'driver_license_id') && this.cardInfo.find(i => i.key === 'driver_license_id').reason || '',
    isAuthentication: this.cardInfo.find(i => i.key === 'driver_license_id') && this.cardInfo.find(i => i.key === 'driver_license_id').isAuthentication || 0,
  }
  submit = () => {
    const { code, driverLicenseStartTime, driverLicenseEndTime, driverFile, fileNumber, copyDriverLicenseUrl } = this.state;
    if (this.state.isAuthentication === 1) {
      Toast.show('请等待审核');
      return;
    }
    if (this.state.isAuthentication === 3) {
      Toast.show('已认证，无须重复认证');
      return;
    }
    if (!code || !driverFile || !driverLicenseStartTime || !driverLicenseEndTime || !fileNumber || !copyDriverLicenseUrl) {
      Toast.show('请填写完整信息');
      return;
    }
    if (!/[0-9a-zA-Z]/g.test(code) || !/[0-9a-zA-Z]/g.test(fileNumber)) {
      Toast.show('请检查证件号码');
      return;
    }
    api('/api/dsUserInfo/saveDriverUpdate', {
      driverLicenseId: code,
      driverLicenseEndTime,
      driverLicenseStartTime,
      copyDriverLicenseUrl,
      fileNumber,
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
    if (this.state.isAuthentication === 1 || this.state.isAuthentication === 3) {
      return;
    }
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
  onPickPhotoClicked = (type) => {
    if (this.state.isAuthentication === 1 || this.state.isAuthentication === 3) {
      return;
    }
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
          if (type === 'copyDriverLicenseUrl') {
            this.setState({
              copyDriverLicenseUrl: `${res.data.data}`
            });
          } else {
            this.setState({
              driverFile: `${res.data.data}`
            });
          }
        })
      }
    });
  };
  render() {
    const { driverFile, driverLicenseStartTime, driverLicenseEndTime, code, copyDriverLicenseUrl, fileNumber, isAuthentication, reason } = this.state;
    return (
      <View style={styles.container}>
      <ScrollView>
      <View style={{ backgroundColor: '#fff', paddingBottom: p(10)}}>
      {isAuthentication === 2 ? <Text style={{ color: '#df8889', alignSelf: 'center', marginTop: p(5) }}>驳回理由：{reason}</Text> : null}
        {
          this.state.isAuthentication === 1 || this.state.isAuthentication === 3
            ? <Text style={styles.input1}>{code}</Text>
            : <TextInput style={styles.input1} placeholder='请输入证件号码' value={code} onChangeText={(value) => { this.setState({ code: value.replace(/[^0-9a-zA-Z]/g, '') }) }}/>
        }
        {
          this.state.isAuthentication === 1 || this.state.isAuthentication === 3
            ? <Text style={styles.input1}>{fileNumber}</Text>
            : <TextInput style={styles.input1} placeholder='请输入档案编号' value={fileNumber} onChangeText={(value) => { this.setState({ fileNumber: value.replace(/[^0-9a-zA-Z]/g, '') }) }}/>
        }
        <TouchableOpacity style={styles.input1} onPress={this.onButtonPress.bind(this, 'driverLicenseStartTime')}>
          <Text style={styles.date}>{driverLicenseStartTime || '有效期开始时间'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input1} onPress={this.onButtonPress.bind(this, 'driverLicenseEndTime')}>
          <Text style={styles.date}>{driverLicenseEndTime || '有效期结束时间'}</Text>
        </TouchableOpacity>
      </View>
        <Text style={styles.text}>驾驶证照片</Text>
        <TouchableOpacity onPress={this.onPickPhotoClicked.bind(this, 'driverFile')}>
          <Image source={driverFile ? {uri: `${host}${driverFile}`} : IMAGES.front} style={styles.image}/>
        </TouchableOpacity>
        <Text style={styles.text}>驾驶证照片</Text>
        <TouchableOpacity onPress={this.onPickPhotoClicked.bind(this, 'copyDriverLicenseUrl')}>
          <Image source={copyDriverLicenseUrl ? {uri: `${host}${copyDriverLicenseUrl}`} : IMAGES.front} style={styles.image}/>
        </TouchableOpacity>
        {this.state.isAuthentication === 1 || this.state.isAuthentication === 3
            ? null : <TouchableOpacity style={styles.submit} onPress={this.submit}>
          <Text style={styles.submitText}>提交</Text>
        </TouchableOpacity>}
      </ScrollView>
        <DatePicker ref="datePicker" />
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
