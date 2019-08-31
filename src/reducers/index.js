import {
    generalLayoutReducer
} from './generalLayoutReducer'
import { combineReducers } from 'redux';

export const Reducers = combineReducers({
    generalLayoutState: generalLayoutReducer
})