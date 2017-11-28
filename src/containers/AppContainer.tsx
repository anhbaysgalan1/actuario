import { connect } from 'react-redux';
import App from '../components/App';
import { toggleNavDrawer } from '../actions/ui';
import { ActuarioState } from '../types/state';
import { Dispatch } from 'redux';

const mapStateToProps = (state: ActuarioState) => ({
  viewState: state.ui.viewState,
});

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  showNavDrawer: () => dispatch(toggleNavDrawer(true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
