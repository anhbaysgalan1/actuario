
import { FirebaseError } from 'firebase';
import { List, Map } from 'immutable';
import { RequestError } from 'request-promise/errors';

import { FactorioData } from './factorio';

export interface ActuarioState {
  readonly data: DataState;
  readonly ui: UiState;
  readonly user: UserState;
}

export interface DataState {
  readonly fetchingData: boolean;
  readonly dataFetchError?: FirebaseError | RequestError;
  readonly factorio?: FactorioData;
}

export enum UiViewState {
  Split = 'split',
  Goals = 'goals',
  Factory = 'factory'
}

export enum FactoryView {
  Overall = 'overall',
  Outposts = 'outposts' 
}

export interface UiState {
  readonly factoryView: FactoryView;
  readonly viewState: UiViewState;
  readonly navDrawerOpen: boolean;
}

export interface UserState {
  readonly prefs: UserPreferences;
  readonly factory: Factory;
}

export interface UserPreferences {
  readonly versionKey: string;
}

export interface Factory {
  readonly goals: Goals;
}

export interface Goals {
  readonly science: ScienceGoal;
  readonly rocket: RocketGoal;
  readonly custom: CustomGoal;
}

export interface ProductionGoal {
  readonly enabled: boolean;
}

export interface CrafterConfig {
    readonly name: string;
    readonly count: number;
    readonly modules: Array<string | null>;
}

export type ProductionManifest = Map<string, List<CrafterConfig>>;

export interface ScienceGoal extends ProductionGoal {
  readonly sciencePacks: ProductionManifest;
}

export interface RocketGoal extends ProductionGoal {
  readonly production: List<CrafterConfig>;
}

export interface CustomGoal extends ProductionGoal {
  readonly recipes: ProductionManifest;
}
