import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ADMIN_ROLE } from '../game/constants';
import Login from '../pages/Login/Login';
import UnauthorizedPage from '../pages/UnauthorizedPage/UnauthorizedPage';

function NoAuth() {
    if(!this.props.auth.isAuthenticated) {
      return <Login/>
    }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(NoAuth);
