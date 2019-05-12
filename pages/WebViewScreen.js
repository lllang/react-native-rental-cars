import React from 'react'
import { WebView } from 'react-native-webview'

export default class WebViewScreen extends React.Component {
  render() {
    return (
      <WebView source={{ uri: this.props.navigation.getParam('url', 'https://www.dschuxing.com/agreement/registration') }} />
    )
  }
}
