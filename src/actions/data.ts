import * as firebase from 'firebase';
import { FirebaseError } from 'firebase';
import { Action, Dispatch } from 'redux';
import { createAction } from 'redux-act';
import * as request from 'request-promise';
import { RequestError } from 'request-promise/errors';

import { ActuarioState } from '../types/state';

export const waitingForData = createAction('waiting for data to load...');
export const receiveData = createAction<string>('receive data from firebase storage');
export const failedDataFetch =
  createAction<FirebaseError | RequestError>('there was a problem receiving the data from storage');

export function fetchData(versionKey: string) {
  return (dispatch: Dispatch<ActuarioState>): Promise<Action> => {
    dispatch(waitingForData());

    return firebase.storage()
      .ref(`factorio-data/${versionKey}.json.gz`)
      .getDownloadURL()
      .then(request.get)
      .catch((error: FirebaseError | RequestError) => dispatch(failedDataFetch(error)))
      .then((data: string) => dispatch(receiveData(data)));
  };
}
