import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Layout from '../../layout/Layout';

import './styles.css';
import { Typography } from '@mui/material';

const Home = ({ auth, reseedDatabase }) => {
  return (
    <Layout>
      <div className="home-page">
        <Typography component="h1" variant="h1">Home page</Typography>
        {!auth.isAuthenticated ? (
          <div>
            <p>
              Welcome guest!{' '}
              <Link className="bold" to="/login">
                Log in
              </Link>{' '}
              or{' '}
              <Link className="bold" to="/register">
                Register
              </Link>
            </p>
          </div>
        ) : (
          <>
            <p>
              Welcome <span className="name">{auth.me.username}</span>!
            </p>
          </>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(Home);
