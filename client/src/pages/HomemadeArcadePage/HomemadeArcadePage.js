import React, { useEffect, useRef } from 'react';
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
import Link from '../../ui/Link/Link';
import ExperienceInstanceButton from '../../app/experienceInstance/ExperienceInstanceButton/ExperienceInstanceButton';
import { getAppSettings } from '../../store/actions/appSettingsActions';
import { APP_ADMIN_ROLE } from '../../constants';

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

const HomemadeArcadePage = ({appSettings: { appSettings }, getAppSettings, auth: { me }}) => {
  const gameListRef = useRef()

  useEffect(() => {
    getAppSettings()
  }, [])
  
  return <>
    <AppBar/>
    <div className="HomemadeArcadePage">
      <ConstellationHero>
        {/* <Button variant="contained" size="large" style={{marginTop: '1em'}} onClick={() => {
          gameListRef.current.scrollIntoView({ behavior: "smooth" })
        }}>Play Now</Button> */}
        <br/>
        {me?.roles[APP_ADMIN_ROLE] && <ExperienceInstanceButton experienceModelMongoId={appSettings.homemadeArcadeExperienceModelMongoId} variant="contained" size="large">
            Create a Lobby
        </ExperienceInstanceButton>}
      </ConstellationHero>
      <Container>
        <div className="HomemadeArcadePage__list">
        <div ref={gameListRef}><GameList hideSearch customFilter={(game) => {
          if(game.playScope !== PLAY_GAME_SCOPE_FEATURED) return false
          if(game.isRemoved) return false
          return true
        }}>{(game) => {
          return <GameCard key={game.id} canPlay game={game}/>
        }}</GameList></div>
        <Link
          to="/arcade"
        >
          Play More Games
        </Link>
        </div>
      </Container>
    </div>
  </>
};

const mapStateToProps = (state) => ({
  appSettings: state.appSettings,
  auth: state.auth
});

export default compose(connect(mapStateToProps, { getAppSettings }))(HomemadeArcadePage);
