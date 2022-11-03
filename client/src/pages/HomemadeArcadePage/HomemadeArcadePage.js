import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../components/ui/Link/Link';

import Layout from '../../layout/Layout';

import './HomemadeArcadePage.scss';
import { Constellation } from '../../components/Constellation/Constellation';
import Typography from '../../components/ui/Typography/Typography';

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

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
