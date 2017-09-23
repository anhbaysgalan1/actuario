import { createReducer } from 'redux-act';
import { Map } from 'immutable';

import { waitingForData, receiveData, failedDataFetch } from '../actions/data';

function fetchState(isFetching, error) {
  return Map({ _fetchingData: isFetching, _dataFetchError: error });
}

const actionMappings = {
  [waitingForData]: state => state.clear().merge(fetchState(true)),

  [receiveData]: (state, data) => state.clear().merge(fetchState(false), data),

  [failedDataFetch]: (state, error) => state.clear().merge(fetchState(false, error)),
};

export default createReducer(actionMappings, new Map());
