import { combineReducers } from 'redux';

import { UserState } from '../types/state';

import factoryReducer from './factory';
import prefsReducer from './prefs';

export default combineReducers<UserState>({ prefs: prefsReducer, factory: factoryReducer });
