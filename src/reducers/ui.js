import { Map } from 'immutable';
import { createReducer } from 'redux-act';

import { setFactoryView, FactoryView, setUiWidth } from '../actions/ui';

const initialState = Map({
  factoryView: FactoryView.Overall,
  uiWidth: window.innerWidth,
});

const actionsMap = {
  [setFactoryView]: (state, newView) => state.set('factoryView', newView),
  [setUiWidth]: (state, newWidth) => state.set('uiWidth', newWidth),
};

export default createReducer(actionsMap, initialState);
