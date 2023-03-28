import React, { useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HomemadeArcadePage.scss';
import GameList from '../../app/gameModel/GameList/GameList';
import Button from '../../ui/Button/Button';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import Navbar from '../../layout/Navbar/Navbar';
import ConstellationHero from '../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import { Container } from '@mui/material';

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

const HomemadeArcadePage = () => {
  const gameListRef = useRef()
  
  return <>
    <Navbar></Navbar>
    <div className="HomemadeArcadePage">
      <ConstellationHero>
        <Button variant="contained" onClick={() => {
          gameListRef.current.scrollIntoView({ behavior: "smooth" })
        }}>Play Now</Button>
      </ConstellationHero>
      <Container><div ref={gameListRef}><GameList>{(game) => {
        if(!game.metadata.isPublished) return
        if(game.isRemoved) return
        return <GameCard canPlay game={game}/>
      }}</GameList></div></Container>
    </div>
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
