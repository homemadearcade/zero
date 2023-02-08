import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import Layout from '../../layout/Layout';
import Cookies from 'js-cookie';

import './HomemadeArcadePage.scss';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import Typography from '../../ui/Typography/Typography';
import { Fade, useMediaQuery } from '@mui/material';
import GameList from '../../app/homemadeArcade/arcadeGame/GameList/GameList';
import Button from '../../ui/Button/Button';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';

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

  const gameListRef = useRef()
  
  return (
    <Layout>
      <div className="HomemadeArcadePage">
        <div className="HomemadeArcadePage__placeholder">
        <Fade in timeout={{ enter: 3000 }}><div><Constellation>
          <Fade in timeout={{ enter: 5000 }}>
            <div>
              <Typography className="HomemadeArcadePage__title" font="2P" component="h3" variant={matches ? 'h4' : "h1"}>Homemade<br/> Arcade</Typography>
              <Button variant="contained" onClick={() => {
                gameListRef.current.scrollIntoView({ behavior: "smooth" })
              }} className="PlayNow" to="/#playnow">Play Now</Button>
            </div>
          </Fade>
        </Constellation></div></Fade>
        </div>
        <div  ref={gameListRef}><GameList>{(game) => {
          if(!game.metadata.isPublished) return
          return <GameCard canPlay game={game}/>
        }}</GameList></div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
