import { combineReducers } from 'redux-immutable';

import prefsReducer from './user/prefs';
import factoryReducer from './user/factory';

export default combineReducers({ prefs: prefsReducer, factory: factoryReducer });
