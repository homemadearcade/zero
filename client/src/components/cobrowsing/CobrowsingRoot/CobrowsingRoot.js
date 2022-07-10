import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingRoot.scss';
import { endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing } from '../../../store/actions/cobrowsingActions';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import GameEditor from '../../../game/GameEditor/GameEditor';
import VideoLayoutHA from '../../VideoLayoutHA/VideoLayoutHA';
import Onboarding from '../Onboarding/Onboarding';
import GameClassList from '../../../game/GameClassList/GameClassList';
import GameBrushList from '../../../game/GameBrushList/GameBrushList';

const CobrowsingRoot = ({ endCobrowsing, unsubscribeCobrowsing, game: { gameModel }, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingUser }, video: { isConnected }, myTracks, userTracks}) => {  
  const isSubscribed = cobrowsingUser.id !== me.id;
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function onClose() {
    if(isSubscribed) {
      unsubscribeCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
    } else {
      endCobrowsing({lobbyId: lobby.id})
    }
  }

  useEffect(() => {
    return () => {
      onClose()
    }
  }, [])

  return <GameEditor 
    isHost={lobby.gameHostId === me.id}
    isNetworked
    lobbyId={lobby.id}
    gameModel={gameModel}
    leftColumn={<>
      {isConnected && <VideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
      <GameBrushList/>
    </>}
    rightColumn={
      <GameClassList/>
    }
    overlay={!lobby.isGameStarted && <Onboarding/>}
  >
    {isSubscribed && <RemoteMouse userId={cobrowsingUser.id}/>}
    {me.role === 'ADMIN' && <CobrowsingStatus onClose={onClose}/>}
  </GameEditor>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
  video: state.video,
  game: state.game,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { endCobrowsing, updateLobbyCobrowsing, unsubscribeCobrowsing }),
)(CobrowsingRoot);

