import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { p } from '../utils/resolutions'
import { api } from '../utils/request'
import host from '../utils/config'
import format from 'date-fns/format';

// const tabs = ['预约', '使用中', '待付款', '待到账', '已完成', '违章', '取消订单'];
const tabs = [{
  name: '使用中',
  value: 1,
}, {
  name: '待付款',
  value: 2,
}, {
  name: '违章待查询',
  value: 7,
}, {
  name: '已完成',
  value: 4,
}]

export default class OrderScreen extends React.Component{
  static navigationOptions = {
    title: '订单列表',
  }
  state = {
    list: [],
    ps: 10,
    pn: 1,
    refreshState: RefreshState.Idle,
    hasNext: true,
    status: 1,
  }
  search = () => {
    const { pn, ps, status } = this.state;
    api('/api/dsOrder/myOrder', { size: ps, page: pn, state: status }).then((res) => {
      if (res.data && res.data.data && res.data.data.rows) {
        const list = pn === 1 ? res.data.data.rows : this.state.list.concat(res.data.data.rows);
        // const list = [
        //   {
        //     "createTime":1553922577000,
        //     "dsCar":{
        //       "carId":"闽A00004",
        //       "page":0,
        //       "photo": '/uploads/userInfo/3e3cb8df-ae68-45a8-973e-f98fc26d560d.jpg',
        //       "size":0
        //     },
        //     "dsCarType":{
        //       "maxMileageEndurance":"400",
        //       "mileageCharge":"20",
        //       "name":"宝骏310",
        //       "price":"300000",
        //       "seat":5,
        //       "timeCharge":"10"
        //     },
        //     "endNetworkName":"育成基地",
        //     "endTime":1553922589000,
        //     "id":"b471420724b8465285df99c4f8c57c95",
        //     "money":"10.0",
        //     "page":0,
        //     "realMoney":"10.0",
        //     "returnBookingTime":"",
        //     "returnCreateTime":"2019-03-30 13:09:37",
        //     "returnEndTime":"",
        //     "returnStartTime":"2019-03-30 13:09:37",
        //     "size":0,
        //     "startNetworkName":"育成基地",
        //     "startTime":1553922577000,
        //     "state":4,
        //     "x":0,
        //     "y":0
        // }]
        const pn1 = pn + 1;
        if (res.data.data.total < pn * ps) {
          this.setState({ hasNext: false, refreshState: RefreshState.NoMoreData });
        } else {
          this.setState({ hasNext: true, refreshState: RefreshState.Idle });
        }
        this.setState({
          list,
          pn: pn1,
        });
      } else {
        Toast.show(res.data.msg);
      }
    })
  }
  componentDidMount() {
    this.search();
  }
  renderItem = ({item}) => {
    const colors = ['', '#00B1A0', '#00B1A0', '#00B1A0', '#C5C5C5', '#FF8F16']
    return (
      <TouchableOpacity style={styles.item} onPress={() => {this.props.navigation.push('orderDetail', { id: item.id })}}>
        <Image style={styles.image} source={item.dsCar && item.dsCar.photo ? { uri: `${host}${item.dsCar.photo}` } : require('../assets/home/icon-cart.png') }/>
        <View style={{ justifyContent: 'center' }}>
        <View style={styles.itemTop}>
          <Text style={styles.type}>车牌{item.dsCar && item.dsCar.carId}</Text>
          <View style={[styles.numView, {backgroundColor: colors[item.type]}]}><Text style={[styles.num]}>{tabs[item.type] && tabs[item.type].name || ''}</Text></View>
        </View>
        <Text style={styles.time}>开始时间：{format(item.returnStartTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    const {
      list,
      hasNext,
      ps,
      refreshState,
      status
    } = this.state;
    console.log(list)
    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          {tabs.map((item) =>
            <TouchableOpacity
              onPress={() => { this.setState({ status: item.value, pn: 1 }, this.search); }}
              key={item.value}
              style={item.value === status ? [styles.tab, styles.active] : styles.tab}>
              <Text style={styles.tabText}>{item.name}</Text>
            </TouchableOpacity>)}
        </View>
        {list && list.length > 0 ? <RefreshListView style={styles.listMain}
        data={list}
        onHeaderRefresh={() => {}}
        refreshState={refreshState}
        onFooterRefresh={() => {
          if (hasNext) {
            this.setState({ refreshState: RefreshState.FooterRefreshing }, () => {
              this.search();
            });
          }
        }}
        keyExtractor={(item) => item.id}
        initialNumToRender={ps}
        renderItem={this.renderItem} /> : <View style={styles.empty}><Text style={styles.emptyText}>暂无记录</Text></View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fcfc',
  },
  listMain: {
    marginTop: p(5),
  },
  item: {
    marginBottom: p(3),
    padding: p(20),
    paddingTop: p(13),
    paddingBottom: p(15),
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: p(10),
  },
  type: {
    color: '#2b2b2b',
    fontSize: p(15),
  },
  time: {
    color: '#999999',
    fontSize: p(12),
  },
  num: {
    color: '#fff',
    fontSize: p(13),
  },
  numView: {
    marginLeft: p(10),
    width: p(50),
    height: p(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: p(50),
    overflow: 'scroll',
  },
  tab: {
    height: p(50),
    paddingTop: p(19),
  },
  active: {
    borderBottomWidth: p(2),
    borderBottomColor: '#70C003',
  },
  tabText: {
    fontSize: p(13),
    color: '#333',
  },
  image: {
    width: p(120),
    height: p(72),
    marginRight: p(10),
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: p(20),
    color: '#2b2b2b',
  }
})