import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

import Game from '../../components/_game/index.weapp'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '时间模式'
  }

  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View >
        <Game mode="TIME"/>
      </View>
    )
  }
}
