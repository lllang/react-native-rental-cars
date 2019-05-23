/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types'
import { createDrawerNavigator, createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import LoginScreen from './pages/LoginScreen.js'
import HomeScreen from './pages/HomeScreen.js'
import LeftDrawer from './pages/LeftDrawer.js'
import WalletScreen from './pages/WalletScreen.js'
import TradeDetailScreen from './pages/TradeDetailScreen.js'
import { p } from './utils/resolutions'
import InitialScreen from './pages/InitialScreen'
import SignUpScreen from './pages/SignUpScreen'
import FindPasswordScreen from './pages/FindPasswordScreen'
import DepositScreen from './pages/DepositScreen'
import { actions } from './reducers'
import { setTopLevelNavigator } from './utils/navigatorService'
import store from './utils/store'
import OrderScreen from './pages/OrderScreen.js';
import CardScreen from './pages/CardScreen.js';
import CardAuthScreen from './pages/CardAuthScreen'
import DriveCardAuthScreen from './pages/DriveCardAuthScreen';
import OrderDetailScreen from './pages/OrderDetailScreen.js';
import SelectMap from './pages/SelectMap.js';
import WebViewScreen from './pages/WebViewScreen.js';

const AppDrawerNavigator = createDrawerNavigator({
  home: HomeScreen,
}, {
  contentComponent: LeftDrawer,
  drawerWidth: p(287),
})

const AppNavigator = createStackNavigator({
  login: LoginScreen,
  init: InitialScreen,
  home: {screen: AppDrawerNavigator, navigationOptions: {header: null}},
  wallet: WalletScreen,
  tradeDetail: TradeDetailScreen,
  signUp: SignUpScreen,
  findPsw: FindPasswordScreen,
  deposit: DepositScreen,
  order: OrderScreen,
  orderDetail: OrderDetailScreen,
  card: CardScreen,
  cardAuth: CardAuthScreen,
  selectMap: SelectMap,
  driveCardAuth: DriveCardAuthScreen,
  webview: WebViewScreen,
}, {
  initialRouteName: 'init',
  defaultNavigationOptions: {
    headerBackTitle: '返回',
    headerTruncatedBackTitle: '返回',
  }
})

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component{
  static childContextTypes = {
    actions: PropTypes.object.isRequired,
  };

  getChildContext() {
    return {
      actions: bindActionCreators(actions, store.dispatch),
    };
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer ref={navigatorRef => {
          setTopLevelNavigator(navigatorRef);
        }}/>
      </Provider>
    )
  }
}
