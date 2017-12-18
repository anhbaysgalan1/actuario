import { createAction } from 'redux-act';

export const setVersionKey = createAction<string>('set the key specifying a Factorio version');
