import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Action } from 'redux-act';

import { UiViewState } from '../types/state';

import App from './App';

const setUiViewState: (v: UiViewState) => Action<UiViewState> = () => ({
  type: 'set_ui_view',
  payload: UiViewState.Goals
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App viewState={UiViewState.Goals} setUiView={setUiViewState} />, div);
});
