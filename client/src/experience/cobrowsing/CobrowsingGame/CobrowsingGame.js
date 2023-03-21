import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import GameEditor from '../../../game/view/GameEditor/GameEditor';
import withGame from '../../../hoc/withGame';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import classNames from 'classnames';
import Typography from '../../../ui/Typography/Typography';
import CobrowsingToolbar from '../CobrowsingToolbar/CobrowsingToolbar';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { GAME_EDITOR_VIDEO_IID } from '../../../constants/interfaceIds';

const CobrowsingGame = ({ rootFontSize, lobby: { lobby: { guideId } }, cobrowsing: { cobrowsingUser, selectedTool, isSubscribedCobrowsing, isActivelyCobrowsing, remoteStateUserId }, video: { isInsideVideoCall }, myTracks, userTracks}) => {   
  return <GameEditor 
    rootFontSize={rootFontSize}
    isObscured
    classNames={classNames({'GameEditor--cobrowsing': isActivelyCobrowsing && !selectedTool, 'GameEditor--cobrowsing-border': isActivelyCobrowsing})}
    leftColumn={<>
     <AgoraUserVideo
        interfaceId={GAME_EDITOR_VIDEO_IID}
        userId={guideId}
        className="AgoraVideo__guide"
        label="Guide"
        myTracks={myTracks}
        userTracks={userTracks}
     />
     </>}
    rightColumn={<>
    </>}
  >
    {isActivelyCobrowsing && !remoteStateUserId && <div className="CobrowsingGame__no-state">
      <Typography variant="h5">{cobrowsingUser.username} has not interacted with the experience yet.</Typography> 
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
    lobby: state.lobby
  });

  return cobrowsingState
}

export default compose(
  withGame,
  connect(mapStateToProps, { }),
)(CobrowsingGame);

