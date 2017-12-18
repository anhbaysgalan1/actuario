import { Reducer } from 'redux';
import { combineReducers } from 'redux';

import { ActuarioState } from '../types/state';

import dataReducer from './data';
import uiReducer from './ui';
import userReducer from './user';

const reducer:  Reducer<ActuarioState> = combineReducers<ActuarioState>({
    data: dataReducer,
    user: userReducer,
    ui: uiReducer,
  });

export default reducer;
