import Taro, { Component } from '@tarojs/taro';
export function getUserRankIndex(data) {
    return Taro.cloud.callFunction({
        name: 'getUserRankIndex',
        data
    })
}