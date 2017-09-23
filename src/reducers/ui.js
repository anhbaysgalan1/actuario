import { Map } from 'immutable';
import { createReducer } from 'redux-act';

import { setFactoryView, FactoryView } from '../actions/ui';

const initialState = Map({
  factoryView: FactoryView.Overall,
});

const actionsMap = {
  [setFactoryView]: (state, newView) => state.set('factoryView', newView),
};

export default createReducer(actionsMap, initialState);
