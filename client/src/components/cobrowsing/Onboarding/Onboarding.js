import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Onboarding.scss';
import { endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing } from '../../../store/actions/cobrowsingActions';
import { startAgoraVideoCall } from '../../../store/actions/videoActions';
import { updateLobbyUser } from '../../../store/actions/lobbyActions';

import RemoteMouse from '../RemoteMouse/RemoteMouse';
import CobrowsingStatus from '../CobrowsingStatus/CobrowsingStatus';
import Loader from '../../Loader/Loader';
import { testInternetSpeed, requestFullscreen } from '../../../store/actions/browserActions';
import AgoraInputSelect from '../../AgoraInputSelect/AgoraInputSelect';

const Onboarding = ({ startAgoraVideoCall, requestFullscreen, endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing, updateLobbyUser, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingState, cobrowsingUser }}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})
  
  const isSubscribed = cobrowsingUser.id !== me.id;
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function onTestInternetSpeedClick() {
    updateLobbyCobrowsing({
      ...cobrowsingState.lobby,
      isTestingSpeed: true
    })

    const [downloadSpeed, uploadSpeed] = await testInternetSpeed()
    
    updateLobbyUser({
      lobbyId: lobby.id,
      userId: cobrowsingUser.id, 
      user: {
        internetSpeedTestResults: {
          downloadSpeed,
          uploadSpeed
        }
      }
    })

    updateLobbyCobrowsing({
      ...cobrowsingState.lobby,
      isTestingSpeed: false
    })
  }

  function renderSpeedTest() {
    const user = usersById[cobrowsingUser.id]
    if(user.internetSpeedTestResults) {
      return <div>
        <div>Upload Speed: {user.internetSpeedTestResults.uploadSpeed}</div>
        <div>Download Speed: {user.internetSpeedTestResults.downloadSpeed}</div>
        <button onClick={onTestInternetSpeedClick}>Test your internet again</button>
        <button onClick={async () => {
          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'computer_environment'
          })
        }}>Next Step</button>
      </div>
    }

   return  <button onClick={onTestInternetSpeedClick}>Test your internet</button>
  }

  function renderBody() {
    if(!cobrowsingState) {
      return <Loader text="Waiting for the other user to join..."/>
    }

    if(cobrowsingState.video.error) {
      return <h1>{cobrowsingState.video.error}</h1>
    }

    if(cobrowsingState.lobby.error) {
      return <h1>{cobrowsingState.lobby.error}</h1>
    }

    if(cobrowsingState.lobby.isTestingSpeed) {
      return <Loader text="Testing your internet upload and download speed.."/>
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

    if(cobrowsingState.lobby.step === 'video_connection_confirmation') {
      return <>
        Step 1
        <div>
          Confirm you are using the correct video and audio devices
        </div>
        <AgoraInputSelect/>
        <button onClick={() => {
          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'internet_speed_test'
          })
        }}>Next Step</button>
      </>
    }

    if(cobrowsingState.lobby.step === 'internet_speed_test') {
      return <div>
        Step 2
        {renderSpeedTest()}
      </div>
    }

    if(cobrowsingState.lobby.step === 'computer_environment') {
      return <div>
        Step 3
        <div>
          Please close out all other tabs on this browser and close other intensive programs like editing software, spotify, other browsers, games, etc.
        </div>
        <button onClick={() => {
          requestFullscreen(document.body)

          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'waiting'
          })
        }}>Enter fullscreen mode</button>
        {cobrowsingUser.role === 'ADMIN' && <button onClick={() => {
          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'waiting'
          })
        }}>Skip</button>}
      </div>
    }

    if(cobrowsingState.lobby.step === 'waiting') {
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
  connect(mapStateToProps, { updateLobbyUser, endCobrowsing, requestFullscreen, startAgoraVideoCall, updateLobbyCobrowsing, unsubscribeCobrowsing }),
)(Onboarding);

