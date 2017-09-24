import { combineReducers } from 'redux-immutable';

import factorioDataReducer from './factorio';
import userReducer from './user';
import uiReducer from './ui';

export default combineReducers({
  factorio: factorioDataReducer,
  user: userReducer,
  ui: uiReducer,
});
