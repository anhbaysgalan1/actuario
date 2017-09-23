import { combineReducers } from 'redux-immutable';
import { Map } from 'immutable';

import goalsReducer from './factory/goals';

export default combineReducers(Map({
  goals: goalsReducer,
}));
