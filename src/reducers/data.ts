import { FirebaseError } from 'firebase';
import { createReducer } from 'redux-act';
import { RequestError } from 'request-promise/errors';

import { waitingForData, receiveData, failedDataFetch } from '../actions/data';
import { FactorioData } from '../types/factorio';
import { DataState } from '../types/state';

function handleWaitingForData(): DataState {
  return { fetchingData: true };
}

function handleRecieveData(state: DataState, factorio: FactorioData): DataState {
  return { factorio, fetchingData: false };
}

function handleFailedDataFetch(state: DataState, dataFetchError: FirebaseError | RequestError): DataState {
  return { fetchingData: false, dataFetchError };
}

export default createReducer<DataState>({}, { fetchingData: false })
  .on(waitingForData, handleWaitingForData)
  .on(receiveData, handleRecieveData)
  .on(failedDataFetch, handleFailedDataFetch);
