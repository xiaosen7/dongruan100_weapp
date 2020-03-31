import * as TYPES from '../action-types'

const initialState = {
    tm_rank: [],
    srv_rank: []
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case TYPES.UPDATE_TIME_RANK:
            state.tm_rank = payload;
            break;
        case TYPES.UPDATE_SURVIVE_RANK:
            state.srv_rank = payload;
            break;
    }
    return {...state};
};