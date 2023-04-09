/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';
import './CreditsActivity.scss'
import { defaultGuideRoleId, defaultParticipantRoleId } from '../../../constants';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { VIDEO_ACTIVITY_VIDEO_IID } from '../../../constants/interfaceIds';

const CreditsActivity = ({
  lobbyInstance: { lobbyInstance },
  userTracks,
  myTracks,
  currentViewCategory
}) => {
    const facilatatorUserMongoIds = lobbyInstance.roleIdToUserMongoIds[defaultGuideRoleId] 
    const participantUserMongoIds = lobbyInstance.roleIdToUserMongoIds[defaultParticipantRoleId]
    // const performerUserMongoIds = lobbyInstance.roleIdToUserMongoIds[defaultPerformerRoleId]

    const behindTheScenesUserMongoIds = facilatatorUserMongoIds

    return <div className="CreditsActivity__browse">
      <div className="CreditsActivity__browse-left">
        {behindTheScenesUserMongoIds.map((userMongoId, index) => {
          return <AgoraUserVideo
            interfaceId={VIDEO_ACTIVITY_VIDEO_IID} 
            hideOverlay
            className="CreditsActivity__browse-video"
            myTracks={myTracks}
            userTracks={userTracks}
            userMongoId={userMongoId}
            key={index}
          ></AgoraUserVideo>
        })}
      </div>
      <iframe title="credits" src="/ha-credits" frameborder="0"></iframe>
      <div className="CreditsActivity__browse-right">
        {participantUserMongoIds.map((userMongoId, index) => {
          return <AgoraUserVideo
            interfaceId={VIDEO_ACTIVITY_VIDEO_IID} 
            hideOverlay
            className="CreditsActivity__browse-video"
            myTracks={myTracks}
            userTracks={userTracks}
            userMongoId={userMongoId}
            key={index}
          ></AgoraUserVideo>
        })}
      </div>
    </div>
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(CreditsActivity);
