import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import GameEditor from '../../../game/GameEditor/GameEditor';
import VideoLayoutHA from '../../VideoLayoutHA/VideoLayoutHA';
import GameClassList from '../../../game/ClassList/ClassList';
import GameBrushList from '../../../game/BrushList/BrushList';
import withCobrowsing from '../../../hoc/withCobrowsing';
import withGame from '../../../hoc/withGame';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import LobbyToolbar from '../../lobby/LobbyToolbar/LobbyToolbar';

//    {me.role === 'ADMIN' && <CobrowsingStatus/>}

const CobrowsingGame = ({ lobby: { lobby }, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => {    
  return <GameEditor 
    lobbyId={lobby.id}
    leftColumn={<>
      {isInsideVideoCall && <VideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  video: state.video,
  cobrowsing: state.cobrowsing
});

export default compose(
  withGame,
  withCobrowsing,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

