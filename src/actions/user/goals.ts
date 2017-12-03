import { createAction } from 'redux-act';
import { Goals } from '../../types/state';

export interface RecipeCrafter {
  readonly recipe: string;
  readonly crafter: string;
}

export interface RecipeModule {
  readonly recipe: string;
  readonly module: string;
}

export default {
  toggleGoal: createAction<keyof Goals>('enable or disable a goal'),

  setSciencePacks: createAction<[string]>('specify which science packs are available for this factory'),

  addCrafter: createAction<RecipeCrafter>('add a crafter for a recipe'),
  removeCrafter: createAction<RecipeCrafter>('remove a crafter from a recipe'),
  addModule: createAction<RecipeModule>('add a module for producing this recipe'),
  removeModule: createAction<RecipeModule>('remove a module from production of this recipe')
};
