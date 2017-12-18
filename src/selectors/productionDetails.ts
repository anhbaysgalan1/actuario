
import { List } from 'immutable';
import * as _ from 'lodash';

import { FactorioData, Module } from '../types/factorio';
import { CrafterDetails, ProductionDetails } from '../types/props';
import { ActuarioState, CrafterConfig, ProductionManifest } from '../types/state';

export function getFactorioData(state: ActuarioState): FactorioData | null {
    return state.data.factorio || null;
}

export function getSciencePackProduction(state: ActuarioState): ProductionManifest {
    return state.user.factory.goals.science.sciencePacks;
}

// returns the production rate for a configured crafter in effort/second
export function calculateProductionRate(crafter: CrafterDetails, recipeEffort: number): number {
    const baseSpeed = crafter.craftingSpeed;

    let speedBonus = 0.0;
    let productivityBonus = 0.0;

    crafter.modules
        .filter(m => m !== null)
        .forEach(({ effect }: Module) => {
            if (effect.speed) speedBonus += baseSpeed * effect.speed;
            if (effect.productivity) productivityBonus += effect.productivity;
        });

    const rpsWithSpeedBonus = (baseSpeed + speedBonus) / recipeEffort;
    const prodBonusRate = (rpsWithSpeedBonus * productivityBonus) / 100;

    return crafter.count * (rpsWithSpeedBonus + prodBonusRate);
}

export function calculateProductionDetails(
        recipeName: string, crafters: List<CrafterConfig>, data: FactorioData): ProductionDetails {

    const detailedCrafters: List<CrafterDetails> = crafters.map<CrafterDetails>(crafter => ({
        ...data.crafters[crafter.name],
        count: crafter.count,
        modules: List(crafter.modules)
            .map<Module | null>(moduleName => _.isNil(moduleName) ? null : data.modules[moduleName])
    }));

    const recipe = data.recipes[recipeName];

    const resultRates = _.mapValues(
        recipe.results,
        (count, resultName) =>
            count * _.sum(detailedCrafters.map(
                crafter => calculateProductionRate(crafter, recipe.effort)).toArray()));

    return { ...recipe, crafters: detailedCrafters, resultRates };

}
