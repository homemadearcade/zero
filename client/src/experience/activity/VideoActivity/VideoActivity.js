/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import './VideoActivity.scss'
import { ACTIVITY_VIEW_BROWSE, ACTIVITY_VIEW_FACILITATORS, ACTIVITY_VIEW_PARTICIPANTS, defaultGuideRoleId, defaultParticipantRoleId, defaultPerformerRoleId } from '../../../constants';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { VIDEO_ACTIVITY_VIDEO_IID } from '../../../constants/interfaceIds';

const VideoActivity = ({
  lobbyInstance: { lobbyInstance },
  currentViewCategory,
  userTracks, 
  myTracks,
}) => {

  function renderView() {
    if(currentViewCategory === ACTIVITY_VIEW_FACILITATORS) {
      const facilatatorId = lobbyInstance.roleIdToUserMongoIds[defaultGuideRoleId][0]

      return  <div className="VideoActivity__role">
        <AgoraUserVideo
          interfaceId={VIDEO_ACTIVITY_VIDEO_IID} 
          hideOverlay
          className="VideoActivity__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userMongoId={facilatatorId}
        ></AgoraUserVideo>
      </div>
    }

    if(currentViewCategory === ACTIVITY_VIEW_PARTICIPANTS) {
      const participantId = lobbyInstance.roleIdToUserMongoIds[defaultParticipantRoleId][0]
      return  <div className="VideoActivity__role">
        <AgoraUserVideo
          interfaceId={VIDEO_ACTIVITY_VIDEO_IID} 
          hideOverlay
          className="VideoActivity__speaker"
          myTracks={myTracks}
          userTracks={userTracks}
          userMongoId={participantId}
        ></AgoraUserVideo>
      </div>
    }
  }

  return <div className="VideoActivity">
    {renderView()}
  </div>

};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(VideoActivity);
