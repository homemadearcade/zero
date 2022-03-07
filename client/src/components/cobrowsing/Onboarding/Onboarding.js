import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Onboarding.scss';
import { endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing } from '../../../store/actions/cobrowsingActions';
import { startAgoraVideoCall } from '../../../store/actions/videoActions';
import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import Loader from '../../Loader/Loader';

const Onboarding = ({ startAgoraVideoCall, endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingState, cobrowsingUser }}) => {
  const isSubscribed = cobrowsingUser.id !== me.id;
  
  function onClose() {
    if(isSubscribed) {
      unsubscribeCobrowsing({lobbyId: lobby.id, userId: cobrowsingUser.id})
    } else {
      endCobrowsing({lobbyId: lobby.id})
    }
  }

  useEffect(() => {
    return () => {
      onClose()
    }
  }, [])

  function renderBody() {
    if(cobrowsingState.video.error) {
      return <h1>{cobrowsingState.video.error}</h1>
    }

    if(cobrowsingState.lobby.error) {
      return <h1>{cobrowsingState.lobby.error}</h1>
    }

    if(cobrowsingState.video.isStarting) {
      return <Loader text="Connecting to video.."/>
    }

    if(cobrowsingState.lobby.step === 'video_connection') {
      return <div>
        Step 1
        <button onClick={() => {
          startAgoraVideoCall({lobbyId: lobby.id})
        }}>Connect your video</button>
      </div>
    }

    if(cobrowsingState.lobby.step === 'internet_speed_test') {
      return <div>
        Step 2
        <button onClick={() => {
          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'computer_environment'
          })
        }}>Test your internet</button>
      </div>
    }


    if(cobrowsingState.lobby.step === 'computer_environment') {
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
            ...cobrowsingState.lobby,
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
  video: state.video,
  cobrowsing: state.cobrowsing
});

export default compose(
  connect(mapStateToProps, { endCobrowsing, startAgoraVideoCall, updateLobbyCobrowsing, unsubscribeCobrowsing }),
)(Onboarding);

