import { createReducer } from 'redux-act';
import * as _ from 'lodash';

import goalActions, { RecipeRate } from '../../../actions/user/goals';
import { GoalsState } from '../../../types/state';

const defaultGoals: GoalsState = {
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
};

function handleToggleGoal(state: GoalsState, goal: keyof GoalsState): GoalsState {

  const newGoal = { ...state[goal], enabled: !state[goal].enabled };
  const newState = { ...state };
  newState[goal] = newGoal;

  return newState;
}

function handleSetSciencePackRate(state: GoalsState, packsPerMin: number): GoalsState {
  return { ...state, science: { ...state.science, packsPerMin } };
}

function handleToggleSciencePackEnabled(state: GoalsState, packName: string): GoalsState {

  const enabledPacks = state.science.enabledPacks;
  if (_.includes(enabledPacks, packName))
    _.pull(enabledPacks, packName);
  else
    enabledPacks.push(packName);

  return { ...state, science: { ...state.science, enabledPacks } };
}

function handleSetRocketRate(state: GoalsState, rocketsPerHour: number): GoalsState {
  return { ...state, rocket: { ...state.rocket, rocketsPerHour } };
}

function handleSetRecipeRate(state: GoalsState, { recipe, rate }: RecipeRate): GoalsState {
  const recipeRates = state.custom.recipeRates;
  recipeRates[recipe] = rate;

  return { ...state, custom: { ...state.custom, recipeRates } };
}

function handleRemoveRecipeGoal(state: GoalsState, recipe: string): GoalsState {
  const recipeRates = _.omit(state.custom.recipeRates, [recipe]);
  return { ...state, custom: { ...state.custom, recipeRates } };
}

export default createReducer<GoalsState>({}, defaultGoals)
  .on(goalActions.toggleGoal, handleToggleGoal)
  .on(goalActions.setSciencePackRate, handleSetSciencePackRate)
  .on(goalActions.toggleSciencePackEnabled, handleToggleSciencePackEnabled)
  .on(goalActions.setRocketRate, handleSetRocketRate)
  .on(goalActions.setRecipeRate, handleSetRecipeRate)
  .on(goalActions.removeRecipeGoal, handleRemoveRecipeGoal);
