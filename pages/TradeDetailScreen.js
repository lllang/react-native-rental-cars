import RefreshListView, { RefreshState } from 'react-native-refresh-list-view';
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { p } from '../utils/resolutions'
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
  }
  search = () => {
    const { pn, ps } = this.state;
    api('/api/MoneyLog/getUserMoneyLog', { size: this.state.ps, page: this.state.pn }).then((res) => {
      if (res.data && res.data.data && res.data.data.rows && res.data.data.rows.records) {
        const list = pn === 1 ? res.data.data.rows.records : this.state.list.concat(res.data.data.rows.records);
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
  renderItem({item}) {
    return (
      <TouchableOpacity style={styles.item}>
        <View style={styles.itemTop}>
          <Text style={styles.type}>{['消费', '充值', '提现', '取消提现', '退押金成功', '退押金驳回', '交押金'][item.type] || ''}</Text>
          <Text style={styles.num}>{item.lastMoney}</Text>
        </View>
        <Text style={styles.time}>{format(item.createTime, 'YYYY/MM/DD HH:mm:ss')}</Text>
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
        renderItem={this.renderItem} /> : null}
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
})