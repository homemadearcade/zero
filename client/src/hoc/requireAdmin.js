import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ADMIN_ROLE } from '../game/constants';
import Login from '../pages/Login/Login';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';

export default (ChildComponent) => {
  class ComposedComponent extends Component {
    // // Our component just got rendered
    // componentDidMount() {
    //   this.shouldNavigateAway();
    // }

    // // Our component just got updated
    // componentDidUpdate() {
    //   this.shouldNavigateAway();
    // }

    // shouldNavigateAway() {
    //     this.props.history.push('/');
    //   }
    // }

    render() {
      if (this.props.auth.isAuthenticated && this.props.auth.me?.role === ADMIN_ROLE) {
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
