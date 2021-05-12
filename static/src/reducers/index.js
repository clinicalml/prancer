import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import data from './data';

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    data,
});

export default rootReducer;
