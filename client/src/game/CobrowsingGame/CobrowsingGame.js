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
import classNames from 'classnames';

//    {me.role === 'ADMIN' && <CobrowsingStatus/>}

const CobrowsingGame = ({ leftColumnScrollYPercent, rightColumnScrollYPercent, lobby: { lobby }, cobrowsing: { cobrowsingUser, isSubscribedCobrowsing, isCurrentlyCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => { 
  
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
      classNames={isCurrentlyCobrowsing ? 'GameEditor--cobrowsing' : ''}
      leftColumnRef={leftColumnRef}
      rightColumnRef={rightColumnRef}
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

  const cobrowsingUser = state.cobrowsing.cobrowsingUser
  const cobrowsingScrolls =  state.status.cobrowsingScrolls
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

