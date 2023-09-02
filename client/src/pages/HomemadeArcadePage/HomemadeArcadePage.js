import React, { useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HomemadeArcadePage.scss';
import GameList from '../../app/gameModel/GameList/GameList';
import Button from '../../ui/Button/Button';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import ConstellationHero from '../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import AppBar from '../../layout/AppBar/AppBar';
import { Container } from '@mui/material';
import { PLAY_GAME_SCOPE_FEATURED } from '../../game/constants';

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
    <AppBar/>
    <div className="HomemadeArcadePage">
      <ConstellationHero>
        <Button variant="contained" onClick={() => {
          gameListRef.current.scrollIntoView({ behavior: "smooth" })
        }}>Play Now</Button>
      </ConstellationHero>
      <Container><div ref={gameListRef}><GameList customFilter={(game) => {
        if(game.playScope !== PLAY_GAME_SCOPE_FEATURED) return false
        if(game.isRemoved) return false
        return true
      }}>{(game) => {
        return <GameCard key={game.id} canPlay game={game}/>
      }}</GameList></div></Container>
    </div>
  </>
};

const mapStateToProps = (state) => ({

});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
