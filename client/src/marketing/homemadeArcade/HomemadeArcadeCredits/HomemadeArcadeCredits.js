import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HomemadeArcadeCredits.scss';
import GameList from '../../../app/gameModel/GameList/GameList';
import GameCard from '../../../app/gameModel/GameCard/GameCard';
import ConstellationHero from '../ConstellationHero/ConstellationHero';
import { Container } from '@mui/material';
import Typography from '../../../ui/Typography/Typography';
import Link from '../../../ui/Link/Link';

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

const HomemadeArcadeCredits = () => {
  const gameListRef = useRef()
  const parentRef = useRef()
  const [size, setSize] = useState(null);

  useEffect(() => {
    const { width, height } = parentRef.current.getBoundingClientRect()
    setSize({ width, height })
  }, [])
  
  function renderBody() {
    return <>
        <ConstellationHero width={size.width} height={size.height}>
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
        <Container><div ref={gameListRef}><GameList customFilter={(game) => {
          if(game.isRemoved) return false 
          return true
        }}>{(game) => {
          return <GameCard key={game.id} canPlay game={game}/>
        }}</GameList></div></Container>
      </>
  }
  
  return <>
    <div className="HomemadeArcadeCredits" ref={parentRef}>
      {parentRef.current && renderBody()}
    </div>
  </>
};

const mapStateToProps = (state) => ({

});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadeCredits);
