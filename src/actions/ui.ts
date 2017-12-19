import { createAction } from 'redux-act';

import { UiViewState } from '../types/state';

export const setUiViewState = createAction<UiViewState>('set ui view state');
