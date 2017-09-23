/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import firebase from 'firebase';

import './index.css';
import defaults from './data/defaults';

import App from './components/App';
import reducers from './reducers/actuario';
import { fetchData } from './actions/data';

import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyBDRy0zKQYBfBOliA1mIwBJGQsJ03_dVAg',
  authDomain: 'actuario-564a6.firebaseapp.com',
  databaseURL: 'https://actuario-564a6.firebaseio.com',
  projectId: 'actuario-564a6',
  storageBucket: 'actuario-564a6.appspot.com',
  messagingSenderId: '1037389045389',
});

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
firebase.auth().onAuthStateChanged((user) => {
  if (user)
    store.dispatch(fetchData(defaults.versionKey));
  else
    firebase.auth().signInAnonymously();
});

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root'));

registerServiceWorker();
