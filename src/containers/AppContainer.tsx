import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { toggleNavDrawer } from '../actions/ui';
import App from '../components/App';
import { ActuarioState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => ({
  viewState: state.ui.viewState,
});

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  showNavDrawer: () => dispatch(toggleNavDrawer(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
