import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingGame.scss';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import GameEditor from '../../../game/view/GameEditor/GameEditor';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import classNames from 'classnames';
import Typography from '../../../ui/Typography/Typography';
import CobrowsingToolbar from '../CobrowsingToolbar/CobrowsingToolbar';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { defaultGuideRoleId } from '../../../constants';
import Alert from '../../../ui/Alert/Alert';
import { GAME_ROOM_VIDEO_IID } from '../../../constants/interfaceIds';
import GameContext from '../../../hoc/GameContext';

const CobrowsingGame = ({ rootFontSize, lobbyInstance: { lobbyInstance }, cobrowsing: { cobrowsingUser, selectedTool, isSubscribedCobrowsing, isActivelyCobrowsing, remoteStateUserMongoId }, video: { isInsideVideoCall }, myTracks, userTracks}) => { 
  const gameFacilitatorUserMongoId = lobbyInstance.roleIdToUserMongoIds[defaultGuideRoleId][0]

  return <GameContext>
    <GameEditor 
      rootFontSize={rootFontSize}
      isObscurable
      classNames={classNames({'GameEditor--cobrowsing': isActivelyCobrowsing && !selectedTool, 'GameEditor--cobrowsing-border': isActivelyCobrowsing})}
      leftColumn={<>
      <AgoraUserVideo
          interfaceId={GAME_ROOM_VIDEO_IID}
          userMongoId={gameFacilitatorUserMongoId}
          className="AgoraVideo__guide"
          label="Guide"
          myTracks={myTracks}
          userTracks={userTracks}
      />
      </>}
      rightColumn={<>
      </>}
    >
      {isActivelyCobrowsing && remoteStateUserMongoId && <RemoteMouse userMongoId={cobrowsingUser.id}/>}
      {isActivelyCobrowsing && !remoteStateUserMongoId && <div className="CobrowsingGame__no-state">
        <Alert severity="warning">
          {cobrowsingUser.username + ' has not interacted with the experience yet'}
        </Alert>
      </div>}
    </GameEditor>
  </GameContext>
  
};

const mapStateToProps = (state) => {
  
  const cobrowsingState = mapCobrowsingState(state, {
    video: state.video,
    cobrowsing: state.cobrowsing,
    auth: state.auth,
    lobbyInstance: state.lobbyInstance
  });

  return cobrowsingState
}

export default compose(
  connect(mapStateToProps, { }),
)(CobrowsingGame);

