import Taro, { Component, useEffect, useMemo, useLayoutEffect, useCallback ,useShareAppMessage} from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import * as TYPES from '../../store/action-types';
import './index.weapp.less';

const GameOver = ({ list ,scoreName}) => {

 

  return (
    <View>
      {list.map((user, index) => {
        return (
          <View className="rank-list-item" key={index}>
            <Image className="avatar" src={user.avatarUrl} />
            <Text className="name">{`No.${index + 1}:${user.nickName}(${user[scoreName]})`}</Text>
          </View>

        )
      })}
    </View>
  )
}
export default GameOver;

