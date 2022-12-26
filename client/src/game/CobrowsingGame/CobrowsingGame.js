import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../../game/cobrowsing/RemoteMouse/RemoteMouse';
import GameEditor from '../GameEditor/GameEditor';
import AgoraVideoLayoutHA from '../../lobby/agora/AgoraVideoLayoutHA/AgoraVideoLayoutHA';
import GameClassList from '../class/ClassList/ClassList';
import GameBrushList from '../brush/BrushList/BrushList';
import withCobrowsing from '../../hoc/withCobrowsing';
import withGame from '../../hoc/withGame';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import LobbyToolbar from '../LobbyToolbar/LobbyToolbar';
import GridToggle from '../GridToggle/GridToggle';

const CobrowsingGame = ({ lobby: { lobby }, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing, isCurrentlyCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => { 
  
  return <GameEditor 
      classNames={isCurrentlyCobrowsing ? 'GameEditor--cobrowsing' : ''}
      lobbyId={lobby.id}
      leftColumn={<>
        {isInsideVideoCall && <AgoraVideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
        <GridToggle/>
        {lobby.game && <GameBrushList/>}
      </>}
      rightColumn={<>
        {lobby.game && <>
          <LobbyToolbar/>
          <GameClassList/>
        </>}
      </>}
    >
      {children}
      {isSubscribedCobrowsing && <RemoteMouse userId={cobrowsingUser.id}/>}
    </GameEditor>
};

const mapStateToProps = (state) => {
  
  const cobrowsingState = mapCobrowsingState(state, {
    lobby: state.lobby,
    video: state.video,
    cobrowsing: state.cobrowsing,
  });

  return cobrowsingState
}

export default compose(
  withGame,
  withCobrowsing,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

