import { List, Map } from 'immutable';
import * as _ from 'lodash';

import { FactorioData, Recipe } from '../types/factorio';
import { ProductionDetails } from '../types/props';

type Invoice = Map<string, number>;

function addInvoices(i1: Invoice, i2: Invoice): Invoice {
    return i1.mergeWith((r1, r2) => r1 + r2, i2);
}

export function calculateResources(targetInvoice: Invoice, data: FactorioData): Invoice {

    const resources = Map(data.resources);
    const recipes = Map(data.recipes);

    const isResource = (rate: number, recipe: string) => {
        if (resources.has(recipe))
            return true;

        if (recipes.filter(r => _.has(r.results, recipe)).size > 1)
            return true;

        return false;
    };

    const resourceTargets = targetInvoice.filter(isResource);
    const recipeTargets = targetInvoice.filterNot(isResource);

    if (recipeTargets.isEmpty())
        return resourceTargets;

    const recipeIngredientInvoice: Invoice = recipeTargets
        .flatMap((targetRate, targetName) => {

            const possibleRecipes = recipes.filter(r => _.has(r.results, targetName));
            const recipe = possibleRecipes.first() as Recipe;
            const recipeCount = recipe.results[targetName];

            return Map(recipe.ingredients)
                .map((iCount, iName) => targetRate * iCount / recipeCount);
        });

    return addInvoices(resourceTargets, calculateResources(recipeIngredientInvoice, data));
}

export function calculateAllResources(production: List<ProductionDetails>, data: FactorioData): Invoice {
    return production
        .reduce(
            (inv: Invoice, pd) => {
                const prodInvoice: Invoice = Map(pd.resultRates);
                return addInvoices(inv, calculateResources(prodInvoice, data));
            },
            Map());
}
