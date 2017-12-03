import * as React from 'react';
import * as _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import { Drawer } from 'material-ui';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { ThemeOptions } from 'material-ui/styles/createMuiTheme';
import { StyleRulesCallback, WithStyles } from 'material-ui/styles/withStyles';
import { UiViewState } from '../types/state';
import { Action } from 'redux-act';

const styles: StyleRulesCallback = (theme: ThemeOptions) => ({
  navList: {
    minWidth: 140,
    maxWidth: 280,
    width: window.innerWidth - 56,
    background: _.get(theme, 'palette.background.paper'),
  },
});

const NavigationDrawer: React.SFC<NavigationDrawerProps & WithStyles> =
  ({ navDrawerOpen, setUiView, closeNavDrawer, classes }) => {
    const navItem: (view: UiViewState, caption: string) => JSX.Element = (view, caption) => (
      <ListItem button={true} onClick={() => setUiView(view)}>
        <ListItemText primary={caption} />
      </ListItem>
    );

    return (
      <Drawer open={navDrawerOpen} onRequestClose={closeNavDrawer}>
        <List className={classes.navList}>
          {navItem(UiViewState.Goals, 'Goals')}
          {navItem(UiViewState.Factory, 'Factory')}
        </List>
      </Drawer>
    );
  };

interface NavigationDrawerProps {
  readonly navDrawerOpen: boolean;
  readonly setUiView: (newViewState: UiViewState) => Action<UiViewState>;
  readonly closeNavDrawer: () => Action<boolean>;
}

export default withStyles(styles)(NavigationDrawer);
