import { createAction } from 'redux-act';

import { ProductionDetails } from '../types/props';
import { Goals } from '../types/state';

export default {
  toggleGoal: createAction<keyof Goals>('enable or disable a goal'),

  setSciencePacks: createAction<[string]>('specify which science packs are available for this factory'),

  updateProduction: createAction<ProductionDetails>('update production details for a recipe')
};
