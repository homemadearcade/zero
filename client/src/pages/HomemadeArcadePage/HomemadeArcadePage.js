import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import Layout from '../../layout/Layout';

import './HomemadeArcadePage.scss';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import Typography from '../../ui/Typography/Typography';
import { Fade } from '@mui/material';

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

const HomemadeArcadePage = ({ auth, reseedDatabase }) => {
  return (
    <Layout>
      <div className="HomemadeArcadePage">
        <Fade in timeout={{ enter: 3000 }}><div><Constellation>
          <Fade in timeout={{ enter: 5000 }}><div><Typography font="2P" component="h1" variant="h1">Homemade Arcade</Typography></div></Fade>
        </Constellation></div></Fade>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
