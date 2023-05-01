import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { getAppSettings } from '../store/actions/appSettingsActions';

// eslint-disable-next-line import/no-anonymous-default-export
class WithAppSettings extends Component {
  componentWillMount() {
    const { getAppSettings } = this.props

    getAppSettings()
  }


  render() {
    const { appSettings: { isLoading, appSettings }, children } = this.props;
    if(isLoading || !appSettings) {
      return <Loader text="Loading..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
};

const mapStateToProps = (state) => ({
  appSettings: state.appSettings,
  // cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { getAppSettings })
)(WithAppSettings)
