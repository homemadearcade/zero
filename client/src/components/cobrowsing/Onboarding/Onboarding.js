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

const Onboarding = ({ startAgoraVideoCall, endCobrowsing, unsubscribeCobrowsing, updateLobbyCobrowsing, updateLobbyUser, auth: { me }, lobby: { lobby}, cobrowsing: { cobrowsingState, cobrowsingUser }}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})
  
  const isSubscribed = cobrowsingUser.id !== me.id;

  async function testInternetSpeed() {
    updateLobbyCobrowsing({
      ...cobrowsingState.lobby,
      isTestingSpeed: true
    })
    
    var downloadSize = 4995374; //bytes
    function detectDownloadSpeed() {
      var imageAddr = "https://i.imgur.com/92LVI9S.jpg"; 

      return new Promise((resolve, reject) => {
        var startTime, endTime;
        var download = new Image();
        download.onload = function (e) {
          endTime = (new Date()).getTime();
          // detectUploadSpeed(e.path[0])
          showResults();
        }
        
        download.onerror = function (err, msg) {
          // ShowProgressMessage("Invalid image, or error downloading");
        }
        
        startTime = (new Date()).getTime();
        var cacheBuster = "?nnn=" + startTime;
        download.src = imageAddr + cacheBuster;
        
        function showResults() {
          var duration = (endTime - startTime) / 1000;
          var bitsLoaded = downloadSize * 8;
          var speedBps = (bitsLoaded / duration).toFixed(2);
          var speedKbps = (speedBps / 1024).toFixed(2);
          var speedMbps = (speedKbps / 1024).toFixed(2);
          resolve(speedMbps)
        }
      })
    }

    function detectUploadSpeed() {
      return new Promise((resolve, reject) => {
        var http = new XMLHttpRequest();
        var startTime, endTime;
        var url = "/uploadtest";
        var myData = ""; // the raw data you will send
        for(var i = 0 ; i < downloadSize ; i++) //if you want to send 1 kb (2 + 1022 bytes = 1024b = 1kb). change it the way you want
        {
            myData += "k"; // add one byte of data;
        }

        http.open("POST", url, true);

        http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        http.onreadystatechange = function() {
          if(http.readyState === 4 && http.status === 200) {
              endTime = (new Date()).getTime();
              var duration = (endTime - startTime) / 1000;
              var bitsLoaded = downloadSize * 8;
              var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
              resolve(speedMbps)
            }
        }
        startTime = (new Date()).getTime();
        http.send(JSON.stringify({value: myData}));
      })
    }

    const downloadSpeed = await detectDownloadSpeed()
    const uploadSpeed = await detectUploadSpeed()

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


  function renderSpeedTest() {
    const user = usersById[cobrowsingUser.id]
    if(user.internetSpeedTestResults) {
      return <div>
        <div>Upload Speed: {user.internetSpeedTestResults.uploadSpeed}</div>
        <div>Download Speed: {user.internetSpeedTestResults.downloadSpeed}</div>
        <button onClick={async () => {
          testInternetSpeed()
        }}>Test your internet again</button>
        <button onClick={async () => {
          updateLobbyCobrowsing({
            ...cobrowsingState.lobby,
            step: 'computer_environment'
          })
        }}>Next Step</button>
      </div>
    }

   return  <button onClick={async () => {
      testInternetSpeed()
    }}>Test your internet</button>
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
  connect(mapStateToProps, { updateLobbyUser, endCobrowsing, startAgoraVideoCall, updateLobbyCobrowsing, unsubscribeCobrowsing }),
)(Onboarding);

