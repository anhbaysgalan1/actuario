import * as firebase from 'firebase';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import { amber, grey } from 'material-ui/colors';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';

import * as _ from 'lodash';

import './index.css';
import { defaultPrefs } from './reducers/prefs';

import { fetchData } from './actions/data';
import { changeUiWidth } from './actions/ui';
import AppContainer from './containers/AppContainer';
import reducers from './reducers/actuario';

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
        store.dispatch(fetchData(defaultPrefs.versionKey));
    else
        firebase.auth().signInAnonymously();
});

function handleResize(e: Event): void {
    const newWidth = (e.target as Window).innerWidth;
    store.dispatch(changeUiWidth(newWidth));
}

window.addEventListener(
    'resize',
    _.throttle(handleResize, 500, { leading: true, trailing: true }));

const muiTheme = createMuiTheme({
    palette: {
        primary: amber,
        secondary: grey,
    },
});

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
            <AppContainer />
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'));

registerServiceWorker();