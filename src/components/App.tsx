import { AppBar, IconButton, Toolbar, Typography } from 'material-ui';
import Menu from 'material-ui-icons/Menu';
import { StyleRules, withStyles } from 'material-ui/styles';
import { WithStyles } from 'material-ui/styles/withStyles';
import * as React from 'react';
import { Action } from 'redux-act';

import NavigationDrawerContainer from '../containers/NavigationDrawerContainer';
import ScienceGoalContainer from '../containers/ScienceGoalContainer';
import { UiViewState } from '../types/state';

const styles: StyleRules = {
  appContainer: {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    alignContent: 'flex-start',
    '& > $content': {
      margin: 16,
    },
  },
  splitContent: {
    flex: 1,
    padding: 16,
    marginLeft: -16,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'stretch',
    alignContent: 'space-between',
    '& > $content': {
      padding: 16,
      marginLeft: 16,
    },
  },
  content: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

const App: React.SFC<AppProps & WithStyles> = ({ viewState, showNavDrawer, classes }) => {
  const goalCards = (
    <div className={classes.content}>
      <ScienceGoalContainer />
    </div>
  );
  const resultSheet = <div className={classes.content}>Results go here</div>;

  let showMenuButton;
  let appContent;

  switch (viewState) {
    case UiViewState.Goals:
      showMenuButton = true;
      appContent = goalCards;
      break;
    case UiViewState.Factory:
      showMenuButton = true;
      appContent = resultSheet;
      break;
    case UiViewState.Split:
    default:
      showMenuButton = false;
      appContent = (
        <div className={classes.splitContent}>
          {goalCards}
          {resultSheet}
        </div>
      );
  }

  let menuButton = null;
  if (showMenuButton)
    menuButton = (
      <IconButton
        className={classes.menuButton}
        onClick={showNavDrawer}
        color="contrast"
        aria-label="Menu"
      >
        <Menu />
      </IconButton>
    );

  return (
    <div className={classes.appContainer}>
      <NavigationDrawerContainer />
      <AppBar position="static">
        <Toolbar >
          {menuButton}
          <Typography type="title">
            Actuario
          </Typography>
        </Toolbar>
      </AppBar>
      {appContent}
    </div>
  );
};

interface AppProps {
  readonly viewState: UiViewState;
  readonly showNavDrawer: () => Action<boolean>;
}

export default withStyles(styles)(App);
