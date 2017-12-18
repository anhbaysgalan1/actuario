import { combineReducers } from 'redux';

import { Factory } from '../types/state';

import goalsReducer from './goals';

export default combineReducers<Factory>({
  goals: goalsReducer,
});
