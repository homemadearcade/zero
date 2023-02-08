import React, { useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './HomemadeArcadePage.scss';
import GameList from '../../app/homemadeArcade/arcadeGame/GameList/GameList';
import Button from '../../ui/Button/Button';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';
import Navbar from '../../layout/Navbar/Navbar';
import ConstellationHero from '../../app/homemadeArcade/ConstellationHero/ConstellationHero';

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
      <div ref={gameListRef}><GameList>{(game) => {
        if(!game.metadata.isPublished) return
        return <GameCard canPlay game={game}/>
      }}</GameList></div>
    </div>
  </>
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(HomemadeArcadePage);
