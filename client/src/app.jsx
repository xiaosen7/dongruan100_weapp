import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import { Provider, connect } from '@tarojs/redux'
import './app.less'
import store from './store'
import * as TYPES from './store/action-types';
import './static/css/index.less'
import './static/css/animate.css'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

if (process.env.TARO_ENV === 'weapp') {
  Taro.cloud.init()
}
@connect(state => state, (dispatch) => ({
  login() {
    return dispatch({ type: TYPES.LOGIN_SG })
  }
}))
class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/rule/index',
      'pages/rank/index',
      'pages/srvgame/index',
      'pages/tmgame/index',
      'pages/gameover/index',
      'pages/gameRank/index'
    ],

    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    subPackages: []
  }

  componentDidMount() {

    const { user, login } = this.props;
    if (!user.openid) {
      login();
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }
  onShareAppMessage(){
    return {
      path:'/pages/index/index'
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(
  <Provider store={store}><App /></Provider>
  , document.getElementById('app'))
