import React from 'react';
import PropTypes from 'prop-types';

import { AppBar, Toolbar, Typography } from 'material-ui';
import { grey, deepOrange } from 'material-ui/colors';
import { createMuiTheme, MuiThemeProvider, withStyles } from 'material-ui/styles';
import Slider from 'react-slick';

const muiTheme = createMuiTheme({
  palette: {
    primary1Color: grey,
    accent1Color: deepOrange,
  },
});

const styles = {
  appContainer: {
    height: '100vw',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    alignContent: 'flex-start',
  },
  carouselContent: {
    flex: 1,
    '& > $goals, & > $results': {
      width: '100vw',
    },
  },
  splitContent: {
    flex: 1,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'stretch',
    alignContent: 'space-between',
    '& > $goals, & > $results': {
      flex: 1,
    },
  },
  goals: {
    border: '1px dotted black',
    // padding: '16px',
  },
  results: {
    border: '1px dotted black',
    // padding: '16px',
  },
};

function App({ uiWidth, classes }) {
  const goalCards = <div className={classes.goals}>Goals go here</div>;
  const resultSheet = <div className={classes.results}>Results go here</div>;


  let appContent;
  if (uiWidth < 800) {
    const sliderOptions = {
      dots: true,
      infinite: false,
      slidesToShow: 1,
      centerMode: true,
    };

    appContent = (
      <Slider {...sliderOptions} className={classes.carouselContent}>
        {goalCards}
        {resultSheet}
      </Slider>);
  } else {
    appContent = <div className={classes.splitContent}>{goalCards}{resultSheet}</div>;
  }

  return (
    <MuiThemeProvider theme={muiTheme}>
      <div className={classes.appContainer}>
        <AppBar position="static" color="default" className={classes.appBar}>
          <Toolbar><Typography type="title" color="inherit">Actuario</Typography></Toolbar>
        </AppBar>
        {appContent}
      </div>
    </MuiThemeProvider>
  );
}

App.propTypes = {
  uiWidth: PropTypes.number.isRequired,
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(App);

