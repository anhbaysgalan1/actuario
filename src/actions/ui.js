import { createAction } from 'redux-act';

export const FactoryView = { Overall: 'overall', Outposts: 'outposts' };

export const setFactoryView = createAction('set factory view');

export const setUiWidth = createAction('set ui width');
