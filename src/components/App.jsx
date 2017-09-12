import React from 'react';

import { AppBar, Toolbar, Typography } from 'material-ui';
import { grey, deepOrange } from 'material-ui/colors';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';

import ItemIcon from './ItemIcon';

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
      <ItemIcon name="assembling-machine-1" description="Assembling machine 1" />
    </div>
  </MuiThemeProvider>
);
