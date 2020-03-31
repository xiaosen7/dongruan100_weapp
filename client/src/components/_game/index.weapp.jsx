import Taro, { Component, useDidShow, useRef, useMemo, useScope, useState, useEffect, useCallback, useLayoutEffect, requirePlugin, initPxTransform } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'

import questionData from '../../utils/questionData.js';
import Count from './Count.weapp';

import '../index.weapp.less';


const SURVIVE = 'SURVIVE', TIME = 'TIME';

class Game extends Component {
    constructor(props) {
        super(props);

        const [choiceStyle, ...bannerStyle] = this.init();

        this.state = {
            //当前问题
            currentQuestionData: this.questionDataCopyed.shift(),
            //答题数量
            total: 0,
            //记录用户选择的索引,
            userChoice: -1,
            //得分
            score: 0,
            //选项动画
            choiceStyle,
            //面板动画
            bannerStyle,
            //播放音乐
            isPlay: true
        }
    }
    toGameOver() {
        const { score, total } = this.state
        Taro.redirectTo({ url: `/pages/gameover/index?score=${score}&mode=${this.mode}&total=${total}` });
    }
    componentDidMount() {
        //播放音乐
        this.mp3 = Taro.createInnerAudioContext();
        this.mp3.autoplay = true
        this.mp3.src = 'http://q801excwx.bkt.clouddn.com/bg.mp3';
        this.mp3.volume = 0.5;
    }
    componentWillUnmount() {
        this.mp3.pause();
    }
    //用户选择
    onChoose = (idx) => {

        let { userChoice, total, score, currentQuestionData } = this.state;
        //如果已经选择 返回
        if (this.isChoosed) return;

        this.isChoosed = true;

        //设置选择的索引 给用户反馈动画效果
        userChoice = idx;

        //答题数加1
        total += 1;

        //用户选对
        if (idx === currentQuestionData.key) {
            //用户选对 分数增加
            ++score;

        } else if (this.mode === SURVIVE) {

            //如果选错 并且 是生存模式 转到结果页面  结束

            //清除用户选择 

            this.setState({ userChoice, total, score })

            return setTimeout(() => this.toGameOver(), 1000);

        }

        this.setState({ userChoice, total, score })

        //延迟一秒等待反馈动画效果结束后进入下一题
        setTimeout(() => {

            //重置
            this.isChoosed = false;

            //清除用户选择  并刷新当前问题
            const [choiceStyle, ...bannerStyle] = this.getShuffleStyles();
            this.setState({
                userChoice: -1,
                currentQuestionData: this.questionDataCopyed.shift(),
                choiceStyle,
                bannerStyle
            })

        }, 1000);

    }
    //初始化
    init() {

        //上一次动画索引
        this.lastStylesIndex = [];

        //定时器的总时长
        this.duration = 20

        //当前模式

        this.mode = this.props.mode;

        //用户选择

        this.isChoosed = false;

        //洗牌
        this.questionDataCopyed = [...questionData].sort(() => Math.random() - 0.5);

        //定义动画名称集合
        this.animationNames = ['rubberBand', 'swing', 'tada', 'wobble', 'heartBeat', 'bounceIn', 'bounceInDown', 'bounceInLeft',
            'bounceInRight', 'bounceInUp', 'fadeInDownBig', 'fadeInLeftBig', 'fadeInUpBig', 'flipInY',
            'flip', 'flipInX', 'lightSpeedIn', 'rollIn'];

        this.animationNamesLen = this.animationNames.length - 1;

        return this.getShuffleStyles();

    }
    getRandomIndex = (notIndex) => {
        let index;
        do {
            index = Math.round(Math.random() * this.animationNamesLen);
        } while (index === notIndex);
        return index;
    }
    getShuffleStyles = () => {
        const { lastStylesIndex, getRandomIndex, animationNames } = this;
        return [0, 0, 0, 0, 0].map((_, index) => ({
            'animation-play-state': 'paused',
            animation: `${animationNames[lastStylesIndex[index] = getRandomIndex(lastStylesIndex[index])]} 1s`,
            'animation-play-state': 'running'
        }))
    }
    onTapSun = () => {
        
        const { isPlay } = this.state;
        isPlay ? this.mp3.pause() : this.mp3.play();

        this.setState({
            isPlay: !isPlay
        })
    }
    render() {

        const {
            currentQuestionData,
            score,
            bannerStyle,
            choiceStyle,
            userChoice,
            isPlay
        } = this.state;
        const { mode, toGameOver } = this;
        
        return currentQuestionData ? (
            <View className="game" >

                <View className="count">
                    <Count
                        mode={mode}
                        score={score}
                        onEnd={toGameOver.bind(this)} 
                        />
                </View>
                <View className={`sun ${isPlay ? 'play' : ''}`} onClick={this.onTapSun} />
                <View className="game-wrapper">
                    <View className="question-banner">
                        <View className="buildings question-banner-item" style={bannerStyle[0]} />
                        <View className="question-border question-banner-item" style={bannerStyle[1]} />
                        <View className="decoration question-banner-item" style={bannerStyle[2]} />
                        <View className="question question-banner-item" style={{ ...bannerStyle[3], background: `url(${currentQuestionData.question}) center / contain no-repeat` }} />
                    </View>
                    <View className="choice" >
                        {currentQuestionData.choice.map((url, index) => {
                            return (
                                <View className="choice-item" key="index">
                                    <View
                                        className="choice-item-bg"
                                        style={{ animation: userChoice === index ? 'bounce 1s' : choiceStyle.animation, background: `url(${url}) 0  / 100% 100% no-repeat` }}
                                    />
                                    <View
                                        className={`choice-item-tap ${userChoice !== -1 && userChoice === index ? (userChoice === currentQuestionData.key ? "selected-right" : "selected-wrong") : ""}`}

                                        onClick={this.onChoose.bind(this, index)} />
                                </View>
                            )
                        })}
                    </View>
                </View>
            </View >) : null;
    }
}
export default Game;

