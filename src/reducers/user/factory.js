import { combineReducers } from 'redux-immutable';

import goalsReducer from './factory/goals';

export default combineReducers({
  goals: goalsReducer,
});
