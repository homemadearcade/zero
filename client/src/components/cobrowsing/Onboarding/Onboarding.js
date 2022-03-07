import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Onboarding.scss';
import { endLobbyCobrowsing, unsubscribeLobbyCobrowsing, updateLobbyCobrowsing } from '../../../store/actions/lobbyActions';
import { startAgoraVideoCall } from '../../../store/actions/videoActions';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import Loader from '../../Loader/Loader';

const Onboarding = ({ startAgoraVideoCall, endLobbyCobrowsing, unsubscribeLobbyCobrowsing, updateLobbyCobrowsing, video, auth: { me }, lobby: { lobby, cobrowsingState, cobrowsingUser}}) => {
  const isSubscribed = cobrowsingUser.id !== me.id;
  
  function onClose() {
    if(isSubscribed) {
      unsubscribeLobbyCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
    } else {
      endLobbyCobrowsing({lobbyId: lobby.id})
    }
  }

  useEffect(() => {
    return () => {
      onClose()
    }
  }, [])

  function renderBody() {
    if(cobrowsingState.isStartingVideo) {
      return <Loader text="Connecting to video.."/>
    }
    
    if(video.error) {
      return <h1>{video.error}</h1>
    }

    if(cobrowsingState.error) {
      return <h1>{cobrowsingState.error}</h1>
    }

    if(cobrowsingState.step === 'video_connection') {
      return <div>
        Step 1
        <button onClick={() => {
          startAgoraVideoCall({lobbyId: lobby.id})
        }}>Connect your video</button>
      </div>
    }

    if(cobrowsingState.step === 'internet_speed_test') {
      return <div>
        Step 2
        <button onClick={() => {
          updateLobbyCobrowsing({
            ...cobrowsingState,
            step: 'computer_environment'
          })
        }}>Test your internet</button>
      </div>
    }


    if(cobrowsingState.step === 'computer_environment') {
      return <div>
        Step 3
        <button onClick={() => {
          function requestFullScreen() {
            const element = document.body
            // Supports most browsers and their versions.
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        
            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
            }
          }
          requestFullScreen()

          updateLobbyCobrowsing({
            ...cobrowsingState,
            step: 'waiting'
          })
        }}>Enter fullscreen mode</button>
      </div>
    }

    if(cobrowsingState.step === 'waiting') {
      return <Loader text="Waiting for game to start.."/>
    }


  }

  return (
    <div className="Onboarding">
      {isSubscribed && <RemoteMouse userId={cobrowsingUser.id}/>}
      {me.role === 'ADMIN' && <CobrowsingStatus onClose={onClose}/>}
      {renderBody()}
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
  video: state.video
});

export default compose(
  connect(mapStateToProps, { endLobbyCobrowsing, startAgoraVideoCall, updateLobbyCobrowsing, unsubscribeLobbyCobrowsing }),
)(Onboarding);

