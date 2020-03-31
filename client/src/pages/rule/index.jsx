import Taro, { Component, useEffect, useShareAppMessage,useCallback, useLayoutEffect } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import './index.weapp.less';


const Login = (props) => {
  const back = useCallback(
    () => {
      Taro.redirectTo({ url: "/pages/index/index" });
    },
    [],
  )
  useShareAppMessage(()=>{
    return {
      path:'/pages/index/index'
    }
  })
  return (
    <View className="rule">
      <View className="back" onClick={back} />
      <View className="rule-text" />
      <View className="rule-title" />
      <View className="decoration" />
      <View className="runman" />
    </View>
  )
}
export default Login;

