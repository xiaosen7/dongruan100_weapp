import Taro, { Component, useEffect, useShareAppMessage,useCallback, useLayoutEffect, requirePlugin } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import './index.weapp.less';
import * as TYPES from '../../store/action-types';
import RankListItem from '../../components/rankListItem'


const Login = (props) => {
  const rank = useSelector(state => state.rank);

  useShareAppMessage(()=>{
    return {
      path:'/pages/index/index'
    }
  }) 

  const back = useCallback(
    () => {
      Taro.redirectTo({url:"/pages/index/index"});
    },
    [],
  )
  return (
    <View className="rank">
      <View className="back" onClick={back} />
      <View className="decoration" />
      <View className="rank-title" />
      <View className="rank-banner">
        <View className="rank-time">
          <View className="rank-time-title" />
          <ScrollView scrollY className="rank-list">
          <RankListItem list={rank.tm_rank} scoreName='tm_score'/>
          </ScrollView>
        </View>

        <View className="rank-survive">
          <View className="rank-survive-title" />
          <ScrollView scrollY className="rank-list">
            <RankListItem list={rank.srv_rank} scoreName='srv_score'/>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
export default Login;

