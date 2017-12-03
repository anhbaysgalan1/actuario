import { createReducer } from 'redux-act';
import * as _ from 'lodash';
import * as _fp from 'lodash/fp';

import goalActions, { RecipeCrafter, RecipeModule } from '../../../actions/user/goals';
import { Goals, ProductionManifest, ProductionOptions, ProductionOption } from '../../../types/state';
import { FactorioData } from '../../../types/factorio';
import { receiveData } from '../../../actions/data';

const defaultGoals: Goals = {
  science: {
    enabled: false,
    sciencePacks: {}
  },
  rocket: {
    enabled: false,
    production: {
      crafters: {},
      modules: {}
    }
  },
  custom: {
    enabled: false,
    recipes: {},
  },
};

function handleToggleGoal(state: Goals, goal: keyof Goals): Goals {

  const newGoal = { ...state[goal], enabled: !state[goal].enabled };
  const newState = { ...state };
  newState[goal] = newGoal;

  return newState;
}

function handleReceiveData(state: Goals, data: FactorioData): Goals {

  const packProduction: ProductionManifest = _(data.goals.science.sciencePacks)
    .map(pack => [pack, { crafters: {}, modules: {} }])
    .fromPairs()
    .value();

  return { ...state, science: { ...state.science, sciencePacks: packProduction } };
}

function addOrCreate(option: ProductionOption, name: string): ProductionOption {

  if (_.has(option, name))
    return { ...option, name: option[name] + 1 };

  return { ...option, name: 1 };
}

function subtractOrRemove(option: ProductionOption, name: string): ProductionOption {

  if (!_.has(option, name))
    return option;

  if (option[name] === 1)
    return _.omit(option, [name]);

  return { ...option, name: option[name] - 1 };
}

function handleUpdateProduction(state: Goals,
                                rp: RecipeCrafter | RecipeModule,
                                f: ((o: ProductionOption, n: string) => ProductionOption)) {

  const { recipe } = rp;
  
  let optionKey: keyof ProductionOptions;
  let target: string;
  if ((<RecipeCrafter> rp).crafter) {
    optionKey = 'crafters';
    target = (<RecipeCrafter> rp).crafter;
  } else {
    optionKey = 'modules';
    target = (<RecipeModule> rp).module;
  }
                                  
  if (_.has(state.science.sciencePacks, recipe)) {
    const newScienceOpt = f(state.science.sciencePacks[recipe][optionKey], target);
    return _fp.set(state, `science.sciencePacks.${recipe}.${optionKey}`, newScienceOpt);
  }

  if (recipe === 'rocket-part') {
    const newRocketOpt = f(state.rocket.production[optionKey], target);
    return _fp.set(state, `rocket.production.${optionKey}`, newRocketOpt);
  }

  if (_.has(state.custom.recipes, recipe)) {
    const newRecipeOpt = f(state.custom.recipes[recipe][optionKey], target);
    return _fp.set(state, `custom.recipes.${recipe}.${optionKey}`, newRecipeOpt);
  }

  const newProduction = { crafters: {}, modules: {} };
  newProduction[optionKey][target] = 1;
  return _fp.set(state, `custom.recipes.${recipe}`, newProduction);
  
}

export default createReducer<Goals>({}, defaultGoals)
  .on(goalActions.toggleGoal, handleToggleGoal)
  .on(receiveData, handleReceiveData)
  .on(goalActions.addCrafter, (state, rc) => handleUpdateProduction(state, rc, addOrCreate))
  .on(goalActions.removeCrafter, (state, rc) => handleUpdateProduction(state, rc, subtractOrRemove))
  .on(goalActions.addModule, (state, rm) => handleUpdateProduction(state, rm, addOrCreate))
  .on(goalActions.removeModule, (state, rm) => handleUpdateProduction(state, rm, subtractOrRemove));
