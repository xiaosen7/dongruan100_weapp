import Taro, { Component, useShareAppMessage,useEffect, useMemo, useLayoutEffect, useState, useRouter, useCallback } from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import * as TYPES from '../../store/action-types';
import './index.weapp.less';
import RankListItem from '../../components/rankListItem';
import { getUserRankIndex } from '../../api';
import ShareCanvas from '../../components/shareCanvas'


const modes = {
  'TIME': '时间模式',
  'SURVIVE': '生存模式'
}

const texts = {
  "TIME": require('../../static/gameRank/time-text.png'),
  "SURVIVE": require('../../static/gameRank/survive-text.png')
}

const titles = {
  "TIME": require('../../static/gameRank/time-title.png'),
  "SURVIVE": require('../../static/gameRank/survive-title.png'),
}

const rankKeys = {
  'TIME': 'tm_rank',
  'SURVIVE': 'srv_rank'
}

const scoreNames = {
  'TIME': 'tm_score',
  'SURVIVE': 'srv_score'
}

const GameOver = ({ }) => {

  const router = useRouter();
  const mode = useMemo(() => router.params.mode, []);

  const { user, rank } = useSelector(state => state);
  const { total, srv_score, tm_score } = user;

  const [isShowCanvas, setIsShowCanvas] = useState(false);
  const dispatch = useDispatch();

  useShareAppMessage(()=>{
    return {
      path:'/pages/index/index'
    }
  }) 

  //当前用户排名
  const [order, setOrder] = useState('——');

  const score = useMemo(() => mode === 'TIME' ? tm_score : srv_score, [mode]);

  const back = useCallback(() => {
    Taro.navigateBack();
  }, [])

  //获取当前用户排名
  useEffect(async () => {

    const { result: { order } } = await getUserRankIndex({
      score,
      scoreName: scoreNames[mode]
    });
    console.log("score:", score);
    console.log("order:", order);

    setOrder(order)

  }, [score, mode])


  const onCansel = useCallback(() => {
    setIsShowCanvas(false);

  }, [])

  const onShare = useCallback(() => {
    setIsShowCanvas(true);

  }, [])

  return (
    <View className="game-rank">
      <View className="decoraion" />
      <View className="text" style={{ background: `url(${texts[mode]}) left top / 100% 100% no-repeat` }}>
        {mode === 'SURVIVE' ? (
          <View className="text-wrapper">
            <View className="text-item" style={{ left: '62%' }}>{score}</View>
            <View className="text-item" style={{ left: '18%', bottom: '0' }}>{order}</View>
          </View>
        ) : (<View className="text-wrapper">
          <View className="text-item" style={{ left: '53%', top: '0' }}>{total}</View>
          <View className="text-item" style={{ left: '16%', bottom: '0' }}>{score}</View>
          <View className="text-item" style={{ left: '72%', bottom: '0' }}>{order}</View>
        </View>)}

      </View>
      <View className="rank-banner">
        <View className="rank-title" style={{ background: `url(${titles[mode]}) center / contain no-repeat` }} />
        <ScrollView scrollY className="rank-list">
          <RankListItem list={rank[rankKeys[mode]]} scoreName={scoreNames[mode]} />
        </ScrollView>
      </View>
      <Button className="back" onClick={back} />
      <Button openType="share" className="share" onClick={onShare} />
      {
        isShowCanvas &&
        <ShareCanvas
          text1={`我在 东软100问 ${modes[mode]} 中`}
          text2={`答对 ${score} 题,排名 ${order} ,快来一起挑战吧~`}
          user={user}
          onCansel={onCansel}
        />
      }
    </View>
  );
}
export default GameOver;

