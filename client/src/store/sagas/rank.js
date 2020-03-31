import Taro, { Component } from '@tarojs/taro';
import * as TYPES from '../action-types';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

let db ;

function* _rank(field) {
    db = db || Taro.cloud.database().collection('users');
    Taro.cloud.database().collection('users').orderBy(field, 'desc')
    const context = db.orderBy(field, 'desc').orderBy('nickName', 'desc');
    const { data } = yield call([context, context.get]);
    return data
}

export function* tm_rank() {
    const data  = yield call(_rank,'tm_score');
    yield put({ type: TYPES.UPDATE_TIME_RANK, payload: data });
}

export function* srv_rank() {
    const data  = yield call(_rank,'srv_score');
    console.log("data",data);
    
    yield put({ type: TYPES.UPDATE_SURVIVE_RANK, payload: data });
}
export function* rank() {
    yield call(tm_rank);
    yield call(srv_rank);
}