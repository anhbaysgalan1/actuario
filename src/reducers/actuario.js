import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

import factorioDataReducer from './factorio';
import userReducer from './user';
import uiReducer from './ui';

export default combineReducers(Map({
  factorio: factorioDataReducer,
  user: userReducer,
  ui: uiReducer,
}));
