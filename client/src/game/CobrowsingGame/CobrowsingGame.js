import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../../game/cobrowsing/RemoteMouse/RemoteMouse';
import GameEditor from '../GameEditor/GameEditor';
import AgoraVideoLayoutHA from '../../lobby/agora/AgoraVideoLayoutHA/AgoraVideoLayoutHA';
import withGame from '../../hoc/withGame';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import CobrowsingToolbar from '../cobrowsing/CobrowsingToolbar/CobrowsingToolbar';
import classNames from 'classnames';
import Typography from '../../ui/Typography/Typography';

const CobrowsingGame = ({ auth: { me }, cobrowsing: { cobrowsingUser, selectedTool, isSubscribedCobrowsing, isActivelyCobrowsing, remoteStateUserId }, video: { isInsideVideoCall }, myTracks, userTracks, children}) => {   

  return <GameEditor 
      classNames={classNames({'GameEditor--cobrowsing': isActivelyCobrowsing && !selectedTool, 'GameEditor--cobrowsing-border': isActivelyCobrowsing})}
      leftColumn={<>
        <AgoraVideoLayoutHA myTracks={myTracks} userTracks={userTracks}/>
      </>}
      rightColumn={<>
      </>}
    >
      {children}
      {isActivelyCobrowsing && !remoteStateUserId && <div className="CobrowsingGame__no-state">
        <Typography variant="h5">{cobrowsingUser.username} has not interacted with the app yet.</Typography> 
      </div>}
      {isActivelyCobrowsing && remoteStateUserId && <CobrowsingToolbar/>}
      {isActivelyCobrowsing && remoteStateUserId && <RemoteMouse userId={cobrowsingUser.id}/>}
    </GameEditor>
};

const mapStateToProps = (state) => {
  
  const cobrowsingState = mapCobrowsingState(state, {
    video: state.video,
    cobrowsing: state.cobrowsing,
    auth: state.auth,
  });

  return cobrowsingState
}

export default compose(
  withGame,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

