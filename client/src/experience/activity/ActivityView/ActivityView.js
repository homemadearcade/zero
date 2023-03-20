/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import { CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_EDITOR_ACTIVITY, MONOLOGUE_ACTIVITY, WAITING_ACTIVITY } from '../../../constants';
import CobrowsingGame from '../../cobrowsing/CobrowsingGame/CobrowsingGame';
import Typography from '../../../ui/Typography/Typography';
import GameViewObscured from '../../../game/view/GameViewObscured/GameViewObscured';
import Chatroom from '../../Chatroom/Chatroom';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import './ActivityView.scss'
import GameCard from '../../../app/arcadeGame/GameCard/GameCard';
import ConstellationHero from '../../../marketing/homemadeArcade/ConstellationHero/ConstellationHero';
import Link from '../../../ui/Link/Link';
import { Container } from '@mui/system';
import ConstellationZoom from '../../../marketing/homemadeArcade/ConstellationZoom/ConstellationZoom';
import AgoraVideoPreview from '../../agora/AgoraVideoPreview/AgoraVideoPreview';
import GameCardLoad from '../../../app/arcadeGame/GameCardLoad/GameCardLoad';

const ActivityView = ({
  lobby: { lobby: { members, currentActivity, guideId, editingGameId }, lobby },
  gameRoom: { gameRoom },
  myTracks,
  userTracks,
  auth: { me },
  video: { isInsideVideoCall},
  cobrowsing: { cobrowsingUser, isActivelyCobrowsing }
}) => {
  const user = members.filter(({id}) => {
    if(cobrowsingUser?.id === id) {
      return true
    }
    return false;
  })[0]

  function renderExperience() {
    if(currentActivity === WAITING_ACTIVITY) {
      return <Container><div className="LobbyWaiting">
        <Typography variant="h4">Your experience will start shortly. For the best experience please spend this time closing all other browser tabs, closing other applications, and putting your notifications on quiet.</Typography>
        {isInsideVideoCall && <AgoraVideoPreview tracks={myTracks}/>}
      </div></Container>
    }

    if(currentActivity === GAME_EDITOR_ACTIVITY) {
      return <CobrowsingGame gameId={gameRoom.gameId} myTracks={myTracks} userTracks={userTracks}>
        <GameViewObscured/>
      </CobrowsingGame>
    }

    if(currentActivity === CHATROOM_ACTIVITY) {
      return <Container><Chatroom hideAutomated></Chatroom></Container>
    }

    if(currentActivity === CREDITS_ACTIVITY) {
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
        <GameCardLoad canPlay gameId={editingGameId}/>
        <Link newTab href={`${window.location.origin}/arcade`}>Browse Other Games To Play</Link>
      </div>
    }

    if(currentActivity === MONOLOGUE_ACTIVITY) {
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

  return <div className="ActivityView">
    {user.inOverlayView && (isActivelyCobrowsing || cobrowsingUser.id === me.id) && <ConstellationZoom/>}
    {renderExperience()}
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  gameRoom: state.gameRoom,
  video: state.video,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(ActivityView);
