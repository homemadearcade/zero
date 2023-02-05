import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../../game/cobrowsing/RemoteMouse/RemoteMouse';
import GameEditor from '../GameEditor/GameEditor';
import AgoraVideoLayoutHA from '../../lobby/agora/AgoraVideoLayoutHA/AgoraVideoLayoutHA';
import withGame from '../../hoc/withGame';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import CobrowsingToolbar from '../cobrowsing/CobrowsingToolbar/CobrowsingToolbar';

const CobrowsingGame = ({ cobrowsing: { cobrowsingUser, isSubscribedCobrowsing, isActivelyCobrowsing }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => { 
  return <GameEditor 
      classNames={isActivelyCobrowsing ? 'GameEditor--cobrowsing' : ''}
      leftColumn={<>
        {isInsideVideoCall && <AgoraVideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>}
      </>}
      rightColumn={<>
      </>}
    >
      {children}
      {isActivelyCobrowsing && <CobrowsingToolbar/>}
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
  connect(mapStateToProps, { }),
)(CobrowsingGame);

