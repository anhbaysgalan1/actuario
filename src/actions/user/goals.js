import { createAction } from 'redux-act';

export default {
  toggleGoal: createAction('enable or disable a goal'),

  setSciencePackRate: createAction('set the desired science pack production rate'),
  toggleSciencePackEnabled: createAction('enable or disable a particular science pack'),

  setRocketRate: createAction('set the desired rate of rocket launches'),

  setRecipeRate: createAction('set the desired production rate for a particular recipe'),
  removeRecipeGoal: createAction('remove a particular recipe from the desired production schedule'),
};
