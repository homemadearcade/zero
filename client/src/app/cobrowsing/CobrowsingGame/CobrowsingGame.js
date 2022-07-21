import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import GameEditor from '../../../game/GameEditor/GameEditor';
import VideoLayoutHA from '../../VideoLayoutHA/VideoLayoutHA';
import GameClassList from '../../../game/ClassList/ClassList';
import GameBrushList from '../../../game/BrushList/BrushList';
import withCobrowsing from '../../../hoc/withCobrowsing';
import withGame from '../../../hoc/withGame';
import { mapCobrowsingState } from '../../../utils/cobrowsing';

const CobrowsingGame = ({ auth: { me }, lobby: { lobby }, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing }, videoState: { isInsideVideoCall }, myTracks, userTracks, children}) => {    
  return <GameEditor 
    lobbyId={lobby.id}
    leftColumn={<>
      {isInsideVideoCall && <VideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
      <GameBrushList/>
    </>}
    rightColumn={
      <GameClassList/>
    }
  >
    {children}
    {isSubscribedCobrowsing && <RemoteMouse userId={cobrowsingUser.id}/>}
    {me.role === 'ADMIN' && <CobrowsingStatus/>}
  </GameEditor>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  auth: state.auth,
  videoState: state.video.videoState,
  cobrowsing: state.cobrowsing
});

export default compose(
  withGame,
  withCobrowsing,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

