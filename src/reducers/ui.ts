import { createReducer } from 'redux-act';

import { changeUiWidth, setFactoryView, setUiViewState, toggleNavDrawer } from '../actions/ui';
import { FactoryView, UiState, UiViewState } from '../types/state';

const smallScreenThreshold = 700; // px

const initialState: UiState = {
  factoryView: FactoryView.Overall,
  viewState: window.innerWidth < smallScreenThreshold ? UiViewState.Goals : UiViewState.Split,
  navDrawerOpen: false,
};

function handleSetFactoryView(state: UiState, newView: FactoryView): UiState {
  return { ...state, factoryView: newView };
}

function handleChangeUiWidth(state: UiState, newWidth: number): UiState {
    const wasSplitView = state.viewState === UiViewState.Split;
    const nowSplitView = newWidth >= smallScreenThreshold;

    if (wasSplitView === nowSplitView)
      return state;

    const viewState = nowSplitView ? UiViewState.Split : UiViewState.Goals;

    return { ...state, viewState };
}

function handleSetUiViewState(state: UiState, viewState: UiViewState): UiState {
  return { ...state, viewState, navDrawerOpen: false };
}

function handleToggleNavDrawer(state: UiState, navDrawerOpen: boolean): UiState {
  return { ...state, navDrawerOpen };
}

export default createReducer<UiState>({}, initialState)
  .on(setFactoryView, handleSetFactoryView)
  .on(changeUiWidth, handleChangeUiWidth)
  .on(setUiViewState, handleSetUiViewState)
  .on(toggleNavDrawer, handleToggleNavDrawer);
