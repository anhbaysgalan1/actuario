import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';

import App from './components/App';
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

// eslint-disable-next-line react/jsx-filename-extension
ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
