import { createAction } from 'redux-act';
import { GoalsState } from '../../types/state';

export interface RecipeRate {
  readonly recipe: string;
  readonly rate: number;
}

export default {
  toggleGoal: createAction<keyof GoalsState>('enable or disable a goal'),

  setSciencePackRate: createAction<number>('set the desired science pack production rate'),
  toggleSciencePackEnabled: createAction<string>('enable or disable a particular science pack'),

  setRocketRate: createAction<number>('set the desired rate of rocket launches'),

  setRecipeRate: createAction<RecipeRate>('set the desired production rate for a particular recipe'),
  removeRecipeGoal: createAction<string>('remove a particular recipe from the desired production schedule'),
};
