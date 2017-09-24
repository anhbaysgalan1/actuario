import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => ({
  uiWidth: state.getIn(['ui', 'uiWidth']),
});

export default connect(mapStateToProps)(App);
