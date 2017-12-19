import { AppBar, Toolbar, Typography } from 'material-ui';
import { StyleRules, withStyles } from 'material-ui/styles';
import { WithStyles } from 'material-ui/styles/withStyles';
import Tabs, { Tab } from 'material-ui/Tabs';
import * as React from 'react';
import { Action } from 'redux-act';

import RocketGoalContainer from '../containers/RocketGoalContainer';
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
    content: {
        flex: 1
    }
};

const App: React.SFC<AppProps & WithStyles> = ({ viewState, setUiView, classes }) => {
    const goalCards = (
        <div className={classes.content}>
            <ScienceGoalContainer />
            <RocketGoalContainer />
        </div>
    );
    const rawSheet = <div className={classes.content}>Raw stuff goes here</div>;
    const outpostsSheet = <div className={classes.content}>Outpost stuff goes here</div>;

    let appContent;

    switch (viewState) {
        case UiViewState.Raw:
            appContent = rawSheet;
            break;
        case UiViewState.Outposts:
            appContent = outpostsSheet;
            break;
        case UiViewState.Goals:
        default:
            appContent = goalCards;
            break;
    }

    return (
        <div className={classes.appContainer}>
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title">Actuario</Typography>
                </Toolbar>
                <Tabs
                    value={viewState}
                    onChange={(e, v: UiViewState) => setUiView(v)}
                >
                    <Tab label="Goals" value={UiViewState.Goals} />
                    <Tab label="Raw" value={UiViewState.Raw} />
                    <Tab label="Outposts" value={UiViewState.Outposts} disabled />
                </Tabs>
            </AppBar>
            {appContent}
        </div>
    );
};

export interface AppProps {
    readonly viewState: UiViewState;
    readonly setUiView: (newViewState: UiViewState) => Action<UiViewState>;
}

export default withStyles(styles)(App);
