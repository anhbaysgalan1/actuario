
import { FirebaseError } from 'firebase';
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
  readonly factory: FactoryState;
}

export interface UserPreferences {
  readonly versionKey: string;
}

export interface FactoryState {
  readonly goals: GoalsState;
}

export interface GoalsState {
  readonly science: ScienceGoalState;
  readonly rocket: RocketGoalState;
  readonly custom: CustomGoalState;
}

export interface GoalState {
  readonly enabled: boolean;
}

export interface ScienceGoalState extends GoalState {
  readonly packsPerMin: number;
  readonly enabledPacks: string[];
}

export interface RocketGoalState extends GoalState {
  readonly rocketsPerHour: number;
}

export interface CustomGoalState extends GoalState {
  readonly recipeRates: { [name: string]: number };
}
