import { createAction } from 'redux-act';
import { FactoryView, UiViewState } from '../types/state';

export const setFactoryView = createAction<FactoryView>('set factory view');

export const changeUiWidth = createAction<number>('set ui width');

export const setUiViewState = createAction<UiViewState>('set ui view state');

export const toggleNavDrawer = createAction<boolean>('set nav drawer open/closed');
