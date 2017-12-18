import { createReducer } from 'redux-act';

import { setVersionKey } from '../actions/prefs';
import { UserPreferences } from '../types/state';

export const defaultPrefs: UserPreferences = {
  versionKey: 'v0_15_37'
};

function handleSetVersionKey(state: UserPreferences, versionKey: string) {
  return { ...state, versionKey };
}

export default createReducer({}, defaultPrefs)
  .on(setVersionKey, handleSetVersionKey);
