import * as TYPES from '../action-types'
import Taro, { Component } from '@tarojs/taro';

const initialState = {
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case TYPES.UPDATE_USER:
            return { ...state, ...payload };

        case TYPES.UPDATE_SCORE:
            const { scoreName, score, total } = payload;
            state[scoreName] = score;
            scoreName === 'tm_score' ? state.total = total : null;
    }

    return { ...state };
};