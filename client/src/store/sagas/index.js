
import Taro, { Component } from '@tarojs/taro';
import * as TYPES from '../action-types';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { tm_rank, srv_rank, rank } from './rank'
let db;
/* 

callFunction(param: OQ<Taro.cloud.CallFunctionParam>): void

调用云函数

@supported — weapp

@example

假设已有一个云函数 add，在小程序端发起对云函数 add 的调用：

```tsx
Taro.cloud.callFunction({
// 要调用的云函数名称
name: 'add',
  // 传递给云函数的event参数
  data: {
    x: 1,
    y: 2,
  }
}).then(res => {
  // output: res.result === 3
}).catch(err => {
  // handle error
})
```

@see — https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/functions/Cloud.callFunction.html


*/


function* login() {
    try {
        let user;
        try {
            //从localStorage中获取
            const { data: id } = yield call([Taro, Taro.getStorage], { key: 'id' });
            db = db || Taro.cloud.database().collection('users');
            const context = db.doc(id);
            const { data } = yield call([context, context.get]);
            console.log(data);
            if (!data) {
                throw new Error(`${id}不存在`)
            }
            user = data
        } catch (e) {

            //获取用户openid去查数据库中有没有
            const { result: { openid } } = yield call([Taro.cloud, Taro.cloud.callFunction], { name: "login" });

            //查询用户是否在数据库中
            db = db || Taro.cloud.database().collection('users');

            const where = db.where({
                _openid: openid // 填入当前用户 openid
            });

            const db_user = (yield call([where, where.get])).data.shift();
            console.log("user是否存在", db_user);

            if (db_user) {
                //如果在
                user = db_user;

            } else {
                //不在 获取用户头像等信息注册到数据库中
                const { userInfo } = yield call([Taro, Taro.getUserInfo]);
                user = { ...userInfo, openid, srv_score: 0, tm_score: 0, total: 0 }
                yield call([db, db.add], { data: user });

                //再向数据库拉取自己的信息 本次拉取主要为了获取id
                const where = db.where({
                    _openid: openid // 填入当前用户 openid
                });
                user = (yield call([where, where.get])).data.shift();
            }

            //将id写入localStorage中
            yield call([Taro, Taro.setStorage], { key: 'id', data: user._id });

            console.log('----------getUserInfo----------');

        } finally {

            //更新用户信息 头像 、昵称 ...
            const { userInfo } = yield call([Taro, Taro.getUserInfo]);

            db = db || Taro.cloud.database().collection('users');

            const context = db.doc(user._id);

            yield call([context, context.update], {
                // data 传入需要局部更新的数据
                data: userInfo
            });

            //加入到store
            yield put({ type: TYPES.UPDATE_USER, payload: { ...user, ...userInfo } });

            //显示欢迎信息
            Taro.showToast({
                title: `欢迎回来 ${user.nickName}`,
                icon: 'none'
            });
        }
    } catch (e) {
        console.log(e);

    }
}
/* 

(fieldPath: string, string: "asc" | "desc"): Taro.DB.Collection

指定查询排序条件

@supported — weapp

@example

按一个字段排序：按进度排升序取待办事项

```tsx
db.collection('todos').orderBy('progress', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
按多个字段排序：先按 progress 排降序（progress 越大越靠前）、再按 description 排升序（字母序越前越靠前）取待办事项

db.collection('todos')
  .orderBy('progress', 'desc')
  .orderBy('description', 'asc')
  .get()
  .then(console.log)
  .catch(console.error)
```

@see — https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.orderBy.html


*/

function* score({ payload: { score, total, mode, id } }) {
    console.log("score, mode, id", score, mode, id);

    db = db || Taro.cloud.database().collection('users');

    const scoreObj = mode === 'TIME' ? { total } : {}, scoreName = mode === "TIME" ? "tm_score" : "srv_score";
    scoreObj[scoreName] = +score;

    const context = db.doc(id);


    console.log("更新数据库分数中...", scoreObj, context);
    yield call([context, context.update], {
        data: scoreObj
    })
    console.log("数据库更新分数成功");
    yield put({ type: TYPES.UPDATE_SCORE, payload: { scoreName, score, total } });

}

export default function* sagas() {
    yield takeEvery(TYPES.LOGIN_SG, login);
    yield takeEvery(TYPES.UPDATE_RANK_SG, rank);
    yield takeEvery(TYPES.UPDATE_SURVIVE_RANK_SG, srv_rank);
    yield takeEvery(TYPES.UPDATE_TIME_RANK_SG, tm_rank);
    yield takeEvery(TYPES.UPDATE_SCORE_SG, score);
}