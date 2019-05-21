import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { p } from '../utils/resolutions'
import Toast from 'react-native-simple-toast';
import { api } from '../utils/request'
import format from 'date-fns/format';

export default class TradeDetailScreen extends React.Component{
  static navigationOptions = {
    title: '资金明细',
  }
  state = {
    list: [],
    ps: 10,
    pn: 1,
    refreshState: RefreshState.Idle,
    hasNext: true,
    map: {0: "消费", 1: "充值", 2: "提现", 3: "取消提现", 4: "退押金成功", 5: "退押金驳回", 6: "交押金", 7: "车主收益", 8: "城市合伙人收益"},
  }
  search = () => {
    const { pn, ps } = this.state;
    api('/api/MoneyLog/getUserMoneyLog', { size: this.state.ps, page: this.state.pn }).then((res) => {
      if (res.data && res.data.data && res.data.data.rows) {
        const list = pn === 1 ? res.data.data.rows : this.state.list.concat(res.data.data.rows);
        console.log(list);
        const pn1 = pn + 1;
        if (res.data.data.total < pn * ps) {
          this.setState({ hasNext: false, refreshState: RefreshState.NoMoreData });
        } else {
          this.setState({ hasNext: true, refreshState: RefreshState.Idle });
        }
        this.setState({
          list,
          pn: pn1,
          map: res.data.data.moneyType
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
    console.log(item)
    return (
      <TouchableOpacity style={styles.item}>
        <View style={styles.itemTop}>
          <Text style={styles.type}>{this.state.map[item.type] || ''}</Text>
          <Text style={styles.num}>{item.num}</Text>
        </View>
        <View style={styles.itemTop}>
          <Text style={styles.time}>{format(item.createTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
          <Text style={styles.num}>{item.lastMoney}</Text>
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
    } = this.state;
    return (
      <View style={styles.container}>
        {list && list.length > 0 ? <RefreshListView style={styles.listMain}
        data={list}
        onHeaderRefresh={() => {
          this.setState({ pn: 1 }, () => {
            this.search();
          });
        }}
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
        renderItem={this.renderItem} /> :
        <View style={styles.empty}><Text style={styles.emptyText}>暂无记录</Text></View>}
        
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
    padding: p(24),
    paddingTop: p(14),
    paddingBottom: p(14),
    backgroundColor: '#fff',
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: p(10),
  },
  type: {
    color: '#2b2b2b',
    fontSize: p(13),
  },
  time: {
    color: '#2b2b2b',
    fontSize: p(12),
  },
  num: {
    color: '#F96E0F',
    fontSize: p(14),
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