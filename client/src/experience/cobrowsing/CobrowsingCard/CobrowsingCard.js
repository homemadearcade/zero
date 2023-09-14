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
import LobbyInstructions from '../../lobbyInstance/LobbyInstructions/LobbyInstructions';
import Icon from '../../../ui/Icon/Icon';
import IconButton from '../../../ui/IconButton/IconButton';
import { useWishTheme } from '../../../hooks/useWishTheme';
import { toggleMinimizeCobrowsingCard } from '../../../store/actions/game/cobrowsingActions';
import LobbyMember from '../../lobbyInstance/LobbyMember/LobbyMember';

const CobrowsingCard = ({
  lobbyInstance: { lobbyInstance, isLobbyDashboardOpen },
  cobrowsing: {
    isActivelyCobrowsing,
    isSubscribedCobrowsing,
    isCobrowsingCardMinimized,
  },
  myTracks,
  userTracks,
  toggleLobbyDashboard,
  toggleMinimizeCobrowsingCard
}) => {
  const theme = useWishTheme()

  if(!isSubscribedCobrowsing) return null
  

  const cobrowsingUserMongoId = lobbyInstance.cobrowsingUserMongoId

  function renderBody() {    
    return (
      <div className={ classNames('CobrowsingCard', { 
        'CobrowsingCard--minimized': isCobrowsingCardMinimized,
        'CobrowsingCard--active': isActivelyCobrowsing,
        'CobrowsingCard--dashboard': isLobbyDashboardOpen,
        'CobrowsingCard--editor': !isLobbyDashboardOpen,
      })}>
        {!isLobbyDashboardOpen && <div className='CobrowsingCard__header'>
          <div className="CobrowsingCard__close">
            <Icon icon="faMinus" color={theme.primaryColor.hexString} onClick={() => {
              toggleMinimizeCobrowsingCard(true)
            }}/>
        </div>
        </div>}
        <div className='CobrowsingCard__content'>
          <div className="CobrowsingCard__video-container">
            <AgoraUserVideo interfaceId={CURRENT_COBROWSING_VIDEO_IID} className="CobrowsingCard__video" myTracks={myTracks} userTracks={userTracks} label="Participant" userMongoId={cobrowsingUserMongoId}/>
          </div>
          <div className="CobrowsingCard__controls">
             <LobbyMember myTracks={myTracks} userTracks={userTracks} userMongoId={cobrowsingUserMongoId}></LobbyMember>
            <div className='CobrowsingCard__toggles'>
              <ActivityTransitionToggle/>
              <CobrowsingIndicator/>
            </div>
            <CobrowsingToolbar/>
            {isLobbyDashboardOpen && <Button 
              endIcon={
                <Icon icon="faGamepad" />
              }
              onClick={() => {
                toggleLobbyDashboard(false)
              }}
              variant="contained" 
              className="CobrowsingCard__view">
              Join
            </Button>}
            {!isLobbyDashboardOpen && <Button 
              endIcon={
                <Icon icon="faGauge" />
              }
              onClick={() => {
                toggleLobbyDashboard(true)
              }}
              variant="contained" 
              className="CobrowsingCard__view">
              Dashboard
            </Button>}
          </div>
        </div>
        {!isLobbyDashboardOpen && <div className="CobrowsingCard__instructions">
          <LobbyInstructions isPreview myTracks={myTracks} userTracks={userTracks}/>
        </div>}
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
  connect(mapStateToProps, { toggleLobbyDashboard, toggleMinimizeCobrowsingCard }),
)(CobrowsingCard);
