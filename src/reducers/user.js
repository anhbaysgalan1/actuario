import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

import prefsReducer from './user/prefs';
import factoryReducer from './user/factory';

export default combineReducers(Map({ prefs: prefsReducer, factory: factoryReducer }));
