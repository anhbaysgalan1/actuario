import { combineReducers } from 'redux';

import goalsReducer from './factory/goals';
import { Factory } from '../../types/state';

export default combineReducers<Factory>({
  goals: goalsReducer,
});
