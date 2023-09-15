import './styles.css';
import withSpeedTest from '../../hoc/withSpeedTest';
import requireAuth from '../../hoc/requireAuth';
import { compose } from 'redux';
import { connect } from 'react-redux';

const InternetSpeedTestPage = () => {

};

const mapStateToProps = (state) => ({

});

export default compose(
  requireAuth,
  withSpeedTest,
  connect(mapStateToProps, { }))(InternetSpeedTestPage);
