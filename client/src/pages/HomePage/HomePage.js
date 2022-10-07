import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../app/ui/Link/Link';

import Layout from '../../layout/Layout';

import './HomePage.scss';
import { Constellation } from '../../app/Constellation/Constellation';
import Typography from '../../app/ui/Typography/Typography';

// {!auth.isAuthenticated ? (
//   <div>
//     Welcome guest!{' '}
//     <Link to="/login">
//       Log in
//     </Link>{' '}
//     or{' '}
//     <Link to="/register">
//       Register
//     </Link>
//   </div>
// ) : (
//   <>
//       <Constellation/>
//   </>
// )}

const HomePage = ({ auth, reseedDatabase }) => {
  return (
    <Layout>
      <div className="HomePage">
        <Constellation>
          <Typography font="2P" component="h1" variant="h1">Homemade Arcade</Typography>
        </Constellation>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomePage);
