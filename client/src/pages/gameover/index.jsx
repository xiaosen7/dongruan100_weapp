import Taro, { Component, useShareAppMessage,useScope, useState, useRouter, useEffect, useMemo, useLayoutEffect, useCallback } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import * as TYPES from '../../store/action-types';
import './index.weapp.less';
import ShareCanvas from '../../components/shareCanvas'
const modes = {
  'TIME': '时间模式',
  'SURVIVE': '生存模式'
}


const GameOver = ({ }) => {

  const router = useRouter();
  const { score, mode, total } = useMemo(() => router.params, []);

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const scope = useScope();

  const [isShowCanvas, setIsShowCanvas] = useState(false);

  useShareAppMessage(()=>{
    return {
      path:'/pages/index/index'
    }
  }) 

  //检查是否要更新用户成绩
  useEffect(() => {
    if ((user.tm_score < score && mode === 'TIME') ||
      (user.srv_score < score && mode === 'SURVIVE')) {
      dispatch({ type: TYPES.UPDATE_SCORE_SG, payload: { score, total, mode, id: user._id } })
    }

  }, []);

  //绑定菜单事件
  const restart = useCallback(() => {
    Taro.redirectTo({ url: `/pages/${mode === "TIME" ? 'tmgame' : 'srvgame'}/index` })
  }, []);

  const home = useCallback(() => {
    Taro.redirectTo({ url: `/pages/index/index` })
  }, []);

  const rank = useCallback(() => {
    if (mode == 'SURVIVE') {
      dispatch({ type: TYPES.UPDATE_SURVIVE_RANK_SG })
    } else {
      dispatch({ type: TYPES.UPDATE_TIME_RANK_SG })
    }
    Taro.navigateTo({ url: `/pages/gameRank/index?mode=${mode}` })
  }, []);

  const onCansel = useCallback(() => {
    setIsShowCanvas(false);

  }, [])

  const onShare = useCallback(() => {
    setIsShowCanvas(true);

  }, [])

  return (
    <View className="gameover">

      <View className="score">{score}</View>
      <View className="menu">
        <View className="restart menu-item" onClick={restart} />
        <View className="home menu-item" onClick={home} />

        <Button className="share menu-item" openType="share" onClick={onShare} />
        <View className="rank menu-item" onClick={rank} />
        {
          isShowCanvas &&
          <ShareCanvas
            text1={`我在 东软100问 ${modes[mode]} 中`}
            text2={`答对 ${score} 题,快来一起挑战吧~`}
            user={user}
            onCansel={onCansel}
          />
        }
      </View>

    </View>
  );
}
export default GameOver;

