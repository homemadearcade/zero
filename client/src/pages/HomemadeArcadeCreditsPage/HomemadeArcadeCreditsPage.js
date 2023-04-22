import React, { useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HomemadeArcadeCreditsPage.scss';
import GameList from '../../app/gameModel/GameList/GameList';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import ConstellationHero from '../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import { Container } from '@mui/material';
import Typography from '../../ui/Typography/Typography';
import Link from '../../ui/Link/Link';

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

const HomemadeArcadeCreditsPage = () => {
  const gameListRef = useRef()
  
  return <>
    <div className="HomemadeArcadeCreditsPage">
      <ConstellationHero>
        <br></br>
        <br></br>
        <Typography variant="h5">By Spencer Williams and Jonathan Pedigo</Typography>
        <br></br>
        <br></br>
        <Typography variant="h5">
          A collaboration between<br></br>
          <Link href="https://towalkthenight.com" newTab>
            To Walk The Night
          </Link> 
          <br></br>
          and<br></br>
          <Link to={'/wishlabs'} newTab>
            Wish Labs
          </Link>
        </Typography>
      </ConstellationHero>
      <Container><div ref={gameListRef}><GameList>{(game) => {
        if(game.isRemoved) return
        return <GameCard key={game.id} canPlay game={game}/>
      }}</GameList></div></Container>
    </div>
  </>
};

const mapStateToProps = (state) => ({

});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadeCreditsPage);
