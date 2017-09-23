import { createReducer } from 'redux-act';
import { fromJS } from 'immutable';

import goalActions from '../../../actions/user/goals';

const defaultGoals = fromJS({
  science: {
    enabled: true,
    packsPerMin: 16,
    enabledPacks: [
      'science-pack-1',
      'science-pack-2',
      'science-pack-3',
    ],
  },
  rocket: {
    enabled: false,
    rocketsPerHour: 6,
  },
  custom: {
    enabled: false,
    recipeRates: {},
  },
});

const actionsMap = {
  [goalActions.toggleGoal]: (state, goal) => state.setIn([goal, 'enabled'], !state.getIn([goal, 'enabled'], false)),

  [goalActions.setSciencePackRate]: (state, rate) => state.setIn(['science', 'packsPerMin'], rate),

  [goalActions.toggleSciencePackEnabled]: (state, packName) => {
    const enabledPacks = state.getIn(['science', 'enabledPacks']);

    let updater;
    if (enabledPacks.includes(packName))
      updater = ep => ep.delete(ep.indexOf(packName));
    else
      updater = ep => ep.push(packName);

    return state.updateIn(['science', 'enabledPacks'], updater);
  },

  [goalActions.setRocketRate]: (state, rate) => state.setIn(['rocket', 'rocketsPerHour'], rate),

  [goalActions.setRecipeRate]: (state, { recipe, rate }) =>
    state.updateIn(['custom', 'recipeRates'], rates => rates.set(recipe, rate)),

  [goalActions.removeRecipeGoal]: (state, recipe) =>
    state.updateIn(['custom', 'recipeRates'], rates => rates.delete(recipe)),
};

export default createReducer(actionsMap, defaultGoals);
