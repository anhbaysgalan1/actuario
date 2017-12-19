import { createReducer } from 'redux-act';

import { setUiViewState } from '../actions/ui';
import { UiState, UiViewState } from '../types/state';

const initialState: UiState = {
  viewState: UiViewState.Goals
};

function handleSetUiViewState(state: UiState, viewState: UiViewState): UiState {
  return { viewState };
}

export default createReducer<UiState>({}, initialState)
  .on(setUiViewState, handleSetUiViewState);
