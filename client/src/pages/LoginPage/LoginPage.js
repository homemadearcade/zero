import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import Login from '../../auth/Login/Login';
import Link from '../../ui/Link/Link';
import Divider from '../../ui/Divider/Divider';

const LoginPage = ({ match, auth, history }) => {
  useEffect(() => {
    if(auth.isAuthenticated) {
      history.push('/')
    }
  }, [])

  return <>
    <Login onLogin={() => {
      history.push('/')
    }}>
      <Divider/>
      Don't have an account?{' '}
      <Link to="/register">
        Register
      </Link>
    </Login>

  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  withRouter,
  connect(mapStateToProps, { })
)(LoginPage);
