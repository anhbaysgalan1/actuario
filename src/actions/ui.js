import { createAction } from 'redux-act';

export default {
  FactoryView: {
    Overall: 'overall',
    Outposts: 'outposts',
  },

  setFactoryView: createAction('set factory view'),
};
