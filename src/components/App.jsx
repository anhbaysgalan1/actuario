import React from 'react';

import { AppBar, Toolbar, Typography, Paper } from 'material-ui';
import { grey, deepOrange } from 'material-ui/colors';
import { createMuiTheme, MuiThemeProvider, withStyles } from 'material-ui/styles';

import GoalSheetContainer from '../containers/GoalSheetContainer';

const muiTheme = createMuiTheme({
  palette: {
    primary1Color: grey,
    accent1Color: deepOrange,
  },
});



export default () => (
  <MuiThemeProvider theme={muiTheme}>
    <div id="actuario-app">
      <AppBar position="static" color="default">
        <Toolbar><Typography type="title" color="inherit">Actuario</Typography></Toolbar>
      </AppBar>
      <div id="app-content">
        <GoalSheetContainer />
        <Paper id="results">
          Heres what I got
        </Paper>
      </div>
    </div>
  </MuiThemeProvider>
);
