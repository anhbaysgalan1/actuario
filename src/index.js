/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import firebase from 'firebase';
import _ from 'lodash';

import './index.css';

import App from './components/App';
import reducers from './reducers/app';

import registerServiceWorker from './registerServiceWorker';

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyBDRy0zKQYBfBOliA1mIwBJGQsJ03_dVAg',
  authDomain: 'actuario-564a6.firebaseapp.com',
  databaseURL: 'https://actuario-564a6.firebaseio.com',
  projectId: 'actuario-564a6',
  storageBucket: 'actuario-564a6.appspot.com',
  messagingSenderId: '1037389045389',
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

if (_.isNil(firebase.auth().currentUser)) {
  firebase.auth().signInAnonymously();
}

const store = createStore(combineReducers(reducers), applyMiddleware(thunkMiddleware));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
