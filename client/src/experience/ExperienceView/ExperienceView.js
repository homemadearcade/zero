/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../store/actions/errorsActions';
import { CHATROOM_EXPERIENCE, CREDITS_EXPERIENCE, GAME_EDITOR_EXPERIENCE, MONOLOGUE_EXPERIENCE, WAITING_EXPERIENCE } from '../../constants';
import CobrowsingGame from '../../game/CobrowsingGame/CobrowsingGame';
import Typography from '../../ui/Typography/Typography';
import GameViewObscured from '../../game/view/GameViewObscured/GameViewObscured';
import Chatroom from '../Chatroom/Chatroom';
import AgoraUserVideo from '../agora/AgoraUserVideo/AgoraUserVideo';
import './ExperienceView.scss'
import GameCard from '../../app/arcadeGame/GameCard/GameCard';
import ConstellationHero from '../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import Link from '../../ui/Link/Link';
import { Container } from '@mui/system';
import ConstellationZoom from '../../marketing/homemadeArcade/ConstellationZoom/ConstellationZoom';

const ExperienceView = ({
  lobby: { lobby: { users, experienceState, guideId, editingGameId }, lobby },
  gameSession: { gameSession },
  myTracks,
  userTracks,
  cobrowsing: { cobrowsingUser }
}) => {
  const user = users.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  function renderExperience() {
    if(experienceState === WAITING_EXPERIENCE) {
      return <Container><div className="LobbyWaiting">
        <Typography variant="h4">Your experience will start shortly. For the best experience please spend this time closing all other browser tabs, closing other applications, and putting your notifications on quiet.</Typography>
      </div></Container>
    }

    if(experienceState === GAME_EDITOR_EXPERIENCE) {
      return <CobrowsingGame gameId={gameSession.gameId} myTracks={myTracks} userTracks={userTracks}>
        <GameViewObscured/>
      </CobrowsingGame>
    }

    if(experienceState === CHATROOM_EXPERIENCE) {
      return <Container><Chatroom hideAutomated></Chatroom></Container>
    }

    if(experienceState === CREDITS_EXPERIENCE) {
      return <div className="CreditsExperience"><ConstellationHero>
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
            <Link href={`${window.location.origin}/wishlabs`} newTab>
              Wish Labs
            </Link>
          </Typography>
        </ConstellationHero>
       {false && <GameCard canPlay gameId={editingGameId}/>}
        <Link newTab href={`${window.location.origin}/arcade`}>Browse Other Games To Play</Link>
      </div>
    }

    if(experienceState === MONOLOGUE_EXPERIENCE) {
      return <div className="MonologueExperience">
        <AgoraUserVideo
          hideOverlay
          className="MonologueExperience__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userId={guideId}
        ></AgoraUserVideo>
      </div>
    }
  }

  return <div className="ExperienceView">
    {user.inConstellationView && <ConstellationZoom/>}
    {renderExperience()}
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  gameSession: state.gameSession
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ExperienceView);
