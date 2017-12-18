
export interface FactorioData {
  readonly recipes: { readonly [name: string]: Recipe };
  readonly crafters: { readonly [name: string]: Crafter };
  readonly inserters: { readonly [name: string]: Inserter };
  readonly belts: { readonly [name: string]: Belt };
  readonly drills: { readonly [name: string]: Drill };
  readonly lab: { readonly [name: string]: Lab };
  readonly modules: { readonly [name: string]: Module };
  readonly goals: Goals;
}

export interface Entity {
  readonly name: string;
  readonly description: string;
}

export interface Modular {
  readonly moduleSlots: number;
}

export enum EnergyType {
  Chemical = 'chemical',
  Electric = 'electric'
}

export interface EnergyUsage {
  readonly type: EnergyType;
  readonly kwPower: number;
  readonly fuelEfficiency: number;
}

export interface Powered {
  readonly energyUsage: EnergyUsage;
}

export enum RecipeCategory {
  Crafting = 'crafting',
  AdvancedCrafting = 'advanced-crafting',
  Smelting = 'smelting',
  OilProcessing = 'oil-processing',
  Chemistry = 'chemistry',
  FluidCrafting = 'crafting-with-fluid',
  RocketBuilding = 'rocket-building',
  Centrifuging = 'centrifuging'
}

export interface Recipe extends Entity {
  readonly category: RecipeCategory;
  readonly effort: number;
  readonly ingredients: { [name: string]: number };
  readonly results: { [name: string]: number };
}

export interface Crafter extends Entity, Modular, Powered {
  readonly craftingCategories: RecipeCategory[];
  readonly craftingSpeed: number;
}

export interface Inserter extends Entity, Modular, Powered {
  readonly rotationSpeed: number;
  readonly extensionSpeed: number;
  readonly kjPerMovement: number;
  readonly kjPerRotation: number;
}

export interface Belt extends Entity, Powered {
  readonly speed: number;
}

export interface Drill extends Entity, Modular, Powered {
  readonly miningSpeed: number;
  readonly miningPower: number;
}

export interface Lab extends Entity, Modular, Powered {
  readonly researchSpeed: number;
}

export enum ModuleCategory {
    Speed = 'speed',
    Productivity = 'productivity',
    Efficiency = 'effectivity'
}

export interface ModuleEffect {
    readonly consumption?: number;
    readonly speed?: number;
    readonly productivity?: number;
}

export interface Module extends Entity {
    readonly category: ModuleCategory;
    readonly validRecipes: string[];
    readonly tier: number;
    readonly effect: ModuleEffect;
}

export interface Goals {
  science: ScienceGoal;
  rocket: RocketGoal;
}

export interface ScienceGoal {
  readonly sciencePacks: string[];
}

export interface RocketGoal {
  readonly rocketPartsRequired: number;
}
