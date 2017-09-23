import { createReducer } from 'redux-act';
import { fromJS } from 'immutable';
import _ from 'lodash';

import prefsActions from '../../actions/user/prefs';
import defaults from '../../data/defaults';

const defaultPrefs = fromJS(_.pick(defaults, ['versionKey']));

const actionsMap = {
  [prefsActions.setVersionKey]: (state, vk) => state.set('versionKey', vk),
};

export default createReducer(actionsMap, defaultPrefs);
