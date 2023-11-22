import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { APP_ADMIN_ROLE } from '../constants';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';
import Login from '../auth/Login/Login';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    render() {
      if (this.props.auth.isAuthenticated && this.props.auth.me?.roles[APP_ADMIN_ROLE]) {
        return <ChildComponent {...this.props} />;
      } else if(!this.props.auth.isAuthenticated) {
        return <Login/>
      } else {
        return <UnauthorizedPage/>
      }
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth };
  }

  return connect(mapStateToProps)(ComposedComponent);
};
