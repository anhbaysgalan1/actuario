
export interface FactorioData {
  readonly recipes: { [name: string]: Recipe };
  readonly crafters: { [name: string]: Crafter };
  readonly inserters: { [name: string]: Inserter };
  readonly belts: { [name: string]: Belt };
  readonly drills: { [name: string]: Drill };
  readonly lab: { [name: string]: Lab };
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
  Crafting = 'crafting'
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
