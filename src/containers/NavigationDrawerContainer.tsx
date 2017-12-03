import { connect, Dispatch } from 'react-redux';
import NavigationDrawer from '../components/NavigationDrawer';
import { setUiViewState, toggleNavDrawer } from '../actions/ui';
import { ActuarioState, UiViewState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => ({
  navDrawerOpen: state.ui.navDrawerOpen,
});

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  setUiView: (newView: UiViewState) => dispatch(setUiViewState(newView)),
  closeNavDrawer: () => dispatch(toggleNavDrawer(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigationDrawer);
