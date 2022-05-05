import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingRoot.scss';
import { endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing } from '../../../store/actions/cobrowsingActions';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import GameView from '../../../game/GameView/GameView';
import VideoLayoutHA from '../../VideoLayoutHA/VideoLayoutHA';
import Onboarding from '../Onboarding/Onboarding';

const CobrowsingRoot = ({ endCobrowsing, unsubscribeCobrowsing, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingUser }, video: { isConnected }, myTracks, userTracks}) => {  
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

  return <GameView 
    leftColumn={isConnected && <VideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
    overlay={<Onboarding/>}
  >
      {isSubscribed && <RemoteMouse userId={cobrowsingUser.id}/>}
      {me.role === 'ADMIN' && <CobrowsingStatus onClose={onClose}/>}
  </GameView>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
  video: state.video,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { endCobrowsing, updateLobbyCobrowsing, unsubscribeCobrowsing }),
)(CobrowsingRoot);

