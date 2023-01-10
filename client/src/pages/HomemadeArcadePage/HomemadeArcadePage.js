import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import Layout from '../../layout/Layout';
import Cookies from 'js-cookie';

import './HomemadeArcadePage.scss';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import Typography from '../../ui/Typography/Typography';
import { Fade, useMediaQuery } from '@mui/material';

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
  const matches = useMediaQuery('(max-width:800px)');
  
  return (
    <Layout>
      <div className="HomemadeArcadePage">
        <Fade in timeout={{ enter: 3000 }}><div><Constellation>
          <Fade in timeout={{ enter: 5000 }}>
            <div>
              <Typography className="HomemadeArcadePage__title" font="2P" component="h1" variant={matches ? 'h4' : "h1"}>Homemade<br/> Arcade</Typography>
            </div>
          </Fade>
        </Constellation></div></Fade>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
