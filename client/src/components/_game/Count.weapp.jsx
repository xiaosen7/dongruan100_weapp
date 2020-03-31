import Taro, { Component, useDidShow, useRef, useMemo, useScope, useState, useEffect, useCallback, useLayoutEffect, requirePlugin } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
export default ({ mode, score, onEnd }) => {

    const [time, setTime] = useState(mode === 'TIME' ? 20 : score);

    useEffect(() => {
        if (mode === 'TIME') {
            let _time = 20;

            const timer = setInterval(() => {
                if (_time === 0) {
                    onEnd();
                    return clearInterval(timer);
                }
                setTime(--_time);
            }, 1000)

            return () => clearInterval(timer);
        }
    }, [])

    return (<Text>{mode === 'TIME' ? time : score}</Text>)
}