import { combineReducers } from 'redux';

import { UserState } from '../types/state';
import prefsReducer from './user/prefs';
import factoryReducer from './user/factory';

export default combineReducers<UserState>({ prefs: prefsReducer, factory: factoryReducer });
