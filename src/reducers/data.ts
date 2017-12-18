import { FirebaseError } from 'firebase';
import { Record } from 'immutable';
import { createReducer } from 'redux-act';
import { RequestError } from 'request-promise/errors';

import { failedDataFetch, receiveData, waitingForData } from '../actions/data';
import { FactorioData } from '../types/factorio';
import { DataState } from '../types/state';

const DataStateRecord = Record<DataState>({ fetchingData: false, factorio: undefined, dataFetchError: undefined });

function handleWaitingForData(): DataState {
    return new DataStateRecord({ fetchingData: true });
}

function handleRecieveData(state: DataState, factorio: FactorioData): DataState {
    return new DataStateRecord({ factorio, fetchingData: false });
}

function handleFailedDataFetch(state: DataState, dataFetchError: FirebaseError | RequestError): DataState {
    return new DataStateRecord({ fetchingData: false, dataFetchError });
}

export default createReducer<DataState>({}, new DataStateRecord())
    .on(waitingForData, handleWaitingForData)
    .on(receiveData, handleRecieveData)
    .on(failedDataFetch, handleFailedDataFetch);
