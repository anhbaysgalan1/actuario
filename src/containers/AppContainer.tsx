import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { setUiViewState } from '../actions/ui';
import App from '../components/App';
import { ActuarioState, UiViewState } from '../types/state';

const mapStateToProps = (state: ActuarioState) => ({
  viewState: state.ui.viewState,
});

const mapDispatchToProps = (dispatch: Dispatch<ActuarioState>) => ({
  setUiView: (view: UiViewState) => dispatch(setUiViewState(view)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
