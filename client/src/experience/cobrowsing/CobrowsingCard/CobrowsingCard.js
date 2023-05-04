/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingCard.scss';
import AgoraUserVideo from '../../agora/AgoraUserVideo/AgoraUserVideo';
import { CURRENT_COBROWSING_VIDEO_IID } from '../../../constants/interfaceIds';
import classNames from 'classnames';
import CobrowsingToolbar from '../CobrowsingToolbar/CobrowsingToolbar';
import ActivityTransitionToggle from '../../activity/ActivityTransitionToggle/ActivityTransitionToggle';
import CobrowsingIndicator from '../CobrowsingIndicator/CobrowsingIndicator';
import Button from '../../../ui/Button/Button';
import { toggleLobbyDashboard } from '../../../store/actions/experience/lobbyInstanceActions';
import Draggable from 'react-draggable';

const CobrowsingCard = ({
  lobbyInstance: { lobbyInstance, isLobbyDashboardOpen },
  cobrowsing: {
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
  },
  myTracks,
  userTracks,
  toggleLobbyDashboard,
}) => {
  if(!isSubscribedCobrowsing) return null

  const cobrowsingUserMongoId = lobbyInstance.cobrowsingUserMongoId

  function renderBody() {    
    return (
      <div className={ classNames('CobrowsingCard', { 
        'CobrowsingCard--active': isActivelyCobrowsing,
        'CobrowsingCard--dashboard': isLobbyDashboardOpen,
        'CobrowsingCard--editor': !isLobbyDashboardOpen,
      })}>
        <div className="CobrowsingCard__video-container">
          <AgoraUserVideo interfaceId={CURRENT_COBROWSING_VIDEO_IID} className="CobrowsingCard__video" myTracks={myTracks} userTracks={userTracks} label="Participant" userMongoId={cobrowsingUserMongoId}/>
        </div>
        <div className="CobrowsingCard__controls">
          <div className='CobrowsingCard__toggles'>
            <ActivityTransitionToggle/>
            <CobrowsingIndicator/>
          </div>
          <CobrowsingToolbar/>
          {isLobbyDashboardOpen && <Button 
            onClick={() => {
              toggleLobbyDashboard(false)
            }}
            variant="contained" 
            className="CobrowsingCard__view">
            Join
          </Button>}
          {!isLobbyDashboardOpen && <Button 
            onClick={() => {
              toggleLobbyDashboard(true)
            }}
            variant="contained" 
            className="CobrowsingCard__view">
            Dashboard
          </Button>}

        </div>
      </div>
    );
  }

  if(isLobbyDashboardOpen) {
    return renderBody()
  } else {
    return <Draggable>
      {renderBody()}
    </Draggable>
  }
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleLobbyDashboard }),
)(CobrowsingCard);
