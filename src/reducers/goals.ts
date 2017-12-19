import { List, Map, Record } from 'immutable';
import { createReducer } from 'redux-act';

import { receiveData } from '../actions/data';
import goalActions from '../actions/goals';
import { FactorioData } from '../types/factorio';
import { ProductionDetails } from '../types/props';
import { CrafterConfig, Goals, ProductionManifest } from '../types/state';

const GoalsRecord = Record<Goals>({
    science: {
        enabled: true,
        sciencePacks: Map<string, List<CrafterConfig>>()
    },
    rocket: {
        enabled: false,
        production: List()
    },
    custom: {
        enabled: false,
        recipes: Map<string, List<CrafterConfig>>(),
    },
});

type GoalsState = Record<Goals> & Readonly<Goals>;

function handleToggleGoal(state: GoalsState, goal: keyof Goals): GoalsState {
    return state.update(goal, g => ({ ...g, enabled: !g.enabled }));
}

function handleReceiveData(state: GoalsState, data: FactorioData): GoalsState {

    const emptyProduction: ProductionManifest = Map(data.goals.science.sciencePacks
        .filter(pack => pack !== 'space-science-pack')
        .map<[string, List<CrafterConfig>]>(pack => [pack, List()]));

    return state.update('science', sci => ({ ...sci, sciencePacks: emptyProduction }));
}

function handleUpdateProduction(state: GoalsState, newProduction: ProductionDetails): GoalsState {

    const { name: recipe } = newProduction;

    const newCrafterConfig: List<CrafterConfig> = newProduction.crafters.map(
        ({ name, count, modules }) => ({
            name,
            count,
            modules: modules.map(m => m ? m.name : null).toArray()
        }));

    if (state.science.sciencePacks.has(recipe))
        return state.set('science', { ...state.science,
            sciencePacks: state.science.sciencePacks.set(recipe, newCrafterConfig) });

    else if (recipe === 'rocket-part')
        return state.set('rocket', { ...state.rocket,
            production: newCrafterConfig });
    else
        return state.set('custom', { ...state.custom,
            recipes: state.custom.recipes.set(recipe, newCrafterConfig) });
}

export default createReducer<GoalsState>({}, new GoalsRecord())
    .on(goalActions.toggleGoal, handleToggleGoal)
    .on(receiveData, handleReceiveData)
    .on(goalActions.updateProduction, handleUpdateProduction);
