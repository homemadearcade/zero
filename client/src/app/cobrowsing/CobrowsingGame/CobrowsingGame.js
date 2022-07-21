import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import GameEditor from '../../../game/GameEditor/GameEditor';
import VideoLayoutHA from '../../VideoLayoutHA/VideoLayoutHA';
import Onboarding from '../Onboarding/Onboarding';
import GameClassList from '../../../game/ClassList/ClassList';
import GameBrushList from '../../../game/BrushList/BrushList';
import withCobrowsing from '../../../hoc/withCobrowsing';
import withGame from '../../../hoc/withGame';
import { mapCobrowsingState } from '../../../utils/cobrowsing';

const CobrowsingGame = ({ game: { gameModel }, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing }, videoState: { isInsideVideoCall }, myTracks, userTracks}) => {    
  return <GameEditor 
    isHost={lobby.gameHostId === me.id}
    isNetworked
    lobbyId={lobby.id}
    gameModel={gameModel}
    leftColumn={<>
      {isInsideVideoCall && <VideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
      <GameBrushList/>
    </>}
    rightColumn={
      <GameClassList/>
    }
    overlay={!lobby.isGameStarted && <Onboarding/>}
  >
    {isSubscribedCobrowsing && <RemoteMouse userId={cobrowsingUser.id}/>}
    {me.role === 'ADMIN' && <CobrowsingStatus/>}
  </GameEditor>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  auth: state.auth,
  videoState: state.video.videoState,
  game: state.game,
  cobrowsing: state.cobrowsing
});

export default compose(
  withGame,
  withCobrowsing,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

