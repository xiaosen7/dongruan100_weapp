import { combineReducers } from 'redux';
import user from './user';
import rank from './rank';
export default combineReducers({
    user,
    rank
})