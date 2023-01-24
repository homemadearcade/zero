import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../../game/cobrowsing/RemoteMouse/RemoteMouse';
import GameEditor from '../GameEditor/GameEditor';
import AgoraVideoLayoutHA from '../../lobby/agora/AgoraVideoLayoutHA/AgoraVideoLayoutHA';
import withCobrowsing from '../../hoc/withCobrowsing';
import withGame from '../../hoc/withGame';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import askFullscreen from '../../hoc/askFullscreen';
import LobbyToolbar from '../LobbyToolbar/LobbyToolbar';

const CobrowsingGame = ({ cobrowsing: { cobrowsingUser, isSubscribedCobrowsing, isActivelyCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => { 

  // a bug occurs with LobbyToolbar when you bypass video and the cobrowsing user is in a video call 
  // beacuse youll go into the component, but you wont have tracks
  return <GameEditor 
      classNames={isActivelyCobrowsing ? 'GameEditor--cobrowsing' : ''}
      leftColumn={<>
        {isInsideVideoCall && <AgoraVideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
      </>}
      toolbar={<>
        {isInsideVideoCall && myTracks && <LobbyToolbar tracks={myTracks}></LobbyToolbar>}
      </>}
      rightColumn={<>
      </>}
    >
      {children}
      {isSubscribedCobrowsing && <RemoteMouse userId={cobrowsingUser.id}/>}
    </GameEditor>
};

const mapStateToProps = (state) => {
  
  const cobrowsingState = mapCobrowsingState(state, {
    video: state.video,
    cobrowsing: state.cobrowsing,
  });

  return cobrowsingState
}

export default compose(
  withGame,
  withCobrowsing,
  askFullscreen,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

