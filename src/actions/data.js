import firebase from 'firebase';
import { createAction } from 'redux-act';
import request from 'request-promise';

export const waitingForData = createAction('waiting for data to load...');
export const receiveData = createAction('receive data from firebase storage');
export const failedDataFetch = createAction('there was a problem receiving the data from storage');

export function fetchData(versionKey) {
  return (dispatch) => {
    dispatch(waitingForData());

    return firebase.storage()
      .ref(`factorio-data/${versionKey}.json`)
      .getDownloadURL()
      .then(request.get)
      .then(data => dispatch(receiveData(data)))
      .catch(error => dispatch(failedDataFetch(error)));
  };
}
