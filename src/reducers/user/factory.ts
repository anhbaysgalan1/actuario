import { combineReducers } from 'redux';

import goalsReducer from './factory/goals';
import { FactoryState } from '../../types/state';

export default combineReducers<FactoryState>({
  goals: goalsReducer,
});
