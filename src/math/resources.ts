import { List, Map } from 'immutable';

import { FactorioData, Recipe } from '../types/factorio';
import { ProductionDetails } from '../types/props';

type Invoice = Map<string, number>;

function addInvoices(i1: Invoice, i2: Invoice): Invoice {
    return i1.mergeWith((r1, r2) => r1 + r2, i2);
}

export function calculateResources(targetInvoice: Invoice, data: FactorioData): Invoice {

    const resources = Map(data.resources);
    const recipes = Map(data.recipes);

    const isResource = (rate: number, recipe: string) => resources.has(recipe);
    const resourceTargets = targetInvoice.filter(isResource);
    const recipeTargets = targetInvoice.filterNot(isResource);

    if (recipeTargets.isEmpty())
        return resourceTargets;

    const recipeIngredientInvoice: Invoice = recipeTargets
        .flatMap((recipeRate, recipeName) => {

            // todo: fluids
            const recipe = recipes.get(recipeName) as Recipe;

            const recipeCount = recipe.results[recipeName];

            return Map(recipe.ingredients)
                .map((iCount, iName) => recipeRate * iCount / recipeCount);
        });

    return addInvoices(resourceTargets, calculateResources(recipeIngredientInvoice, data));
}

export function calculateAllResources(production: List<ProductionDetails>, data: FactorioData): Invoice {
    return production.reduce(
        (inv: Invoice, pd) => {
            const prodInvoice: Invoice = Map(pd.resultRates);
            return addInvoices(inv, calculateResources(prodInvoice, data));
        },
        Map());
}
