import Taro, { Component, useEffect, useLayoutEffect, useShareAppMessage, useCallback } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import './index.weapp.less';
import * as TYPES from '../../store/action-types';
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


const Login = ({ value }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

   useShareAppMessage(()=>{
    return {
      path:'/pages/index/index'
    }
  }) 

  const toRulePage = useCallback(
    () => {

      Taro.navigateTo({ url: '/pages/rule/index' })
    },
    [],
  )
  const toRankPage = useCallback(
    () => {

      Taro.navigateTo({ url: '/pages/rank/index' });
      dispatch({ type: TYPES.UPDATE_RANK_SG })
    },
    [],
  )
  const onGetUserInfo = useCallback(
    () => {
      dispatch({ type: TYPES.LOGIN_SG });
    },
    [],
  )
  const toTmGame = useCallback(() => {

    Taro.redirectTo({ url: '/pages/tmgame/index' });
  },
    [Taro])
  const toSrvGame = useCallback(() => {

    Taro.redirectTo({ url: '/pages/srvgame/index' });
  },
    [Taro])

  const result = Object.keys(user).length == 0 ? (
    <Button onGetUserInfo={onGetUserInfo} openType="getUserInfo">授权登录</Button>
  ) : (<View className="home page">
    <View className="wrapper" />
    <View className="menu">
      <View className="menu-item" onClick={toTmGame} />
      <View className="menu-item" onClick={toSrvGame} />
      <View className="menu-item" onClick={toRulePage} />
      <View className="menu-item" onClick={toRankPage} />
    </View>
    <View className="runman"></View>
  </View>);

  return result;
}
export default Login;

