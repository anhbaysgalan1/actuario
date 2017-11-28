import { combineReducers } from 'redux';

import dataReducer from './data';
import userReducer from './user';
import uiReducer from './ui';
import { ActuarioState } from '../types/state';

export default combineReducers<ActuarioState>({
  data: dataReducer,
  user: userReducer,
  ui: uiReducer,
});
