import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Action } from 'redux-act';

import { UiViewState } from '../types/state';

import App from './App';

const mockShowNavDrawer: () => Action<boolean> = () => ({
  type: 'show_nav_drawer',
  payload: true
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App viewState={UiViewState.Split} showNavDrawer={mockShowNavDrawer} />, div);
});
