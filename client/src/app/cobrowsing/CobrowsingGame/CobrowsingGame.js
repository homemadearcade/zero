import React, { useEffect, useRef } from 'react';
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

const CobrowsingGame = ({ leftColumnScrollYPercent, rightColumnScrollYPercent, lobby: { lobby }, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => { 
  
  const rightColumnRef = useRef(null)
  const leftColumnRef = useRef(null)

  useEffect(() => {
    const leftColumnEl = leftColumnRef.current
    const rightColumnEl = rightColumnRef.current
    const leftScrollTop = leftColumnEl.scrollHeight * leftColumnScrollYPercent
    const rightScrollTop = rightColumnEl.scrollHeight * rightColumnScrollYPercent
    leftColumnEl.scrollTop = leftScrollTop
    rightColumnEl.scrollTop = rightScrollTop
  }, [leftColumnScrollYPercent, rightColumnScrollYPercent])

  return <GameEditor 
    leftColumnRef={leftColumnRef}
    rightColumnRef={rightColumnRef}
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

const mapStateToProps = (state) => {
  
  const cobrowsingState = mapCobrowsingState(state, {
    lobby: state.lobby,
    video: state.video,
    cobrowsing: state.cobrowsing,
  });

  const cobrowsingUser = state.cobrowsing.cobrowsingUser
  const cobrowsingScrolls =  state.status.cobrowsingScroll
  if(cobrowsingScrolls[cobrowsingUser.id]) {
    const { leftColumnScrollYPercent, rightColumnScrollYPercent } = cobrowsingScrolls[cobrowsingUser.id]
    cobrowsingState.leftColumnScrollYPercent = leftColumnScrollYPercent
    cobrowsingState.rightColumnScrollYPercent  = rightColumnScrollYPercent
  }

  return cobrowsingState
}

export default compose(
  withGame,
  withCobrowsing,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

