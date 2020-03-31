import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas';
import rootReducer from './reducers'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

const middlewares = [
    thunkMiddleware,
    createLogger(),
    sagaMiddleware
]

const store = createStore(rootReducer, applyMiddleware(...middlewares));

sagaMiddleware.run(sagas);

export default store;