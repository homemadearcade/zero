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
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})
  
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


  function renderSpeedTest() {
    if(usersById[cobrowsingUser.id].internetSpeedTestResults) {
      return <div>

      </div>
    }

   return  <button onClick={() => {
      updateLobbyCobrowsing({
        ...cobrowsingState.lobby,
        isTestingSpeed: true
      })
      
      var imageAddr = "https://i.imgur.com/92LVI9S.jpg"; 
      var downloadSize = 4995374; //bytes
      function initiateDownloadSpeedDetection() {
          window.setTimeout(measureConnectionSpeed, 1);
      };    

      if (window.addEventListener) {
          window.addEventListener('load', initiateDownloadSpeedDetection, false);
      } else if (window.attachEvent) {
          window.attachEvent('onload', initiateDownloadSpeedDetection);
      }

      function measureConnectionSpeed() {
        var startTime, endTime;
        var download = new Image();
        download.onload = function (e) {
          endTime = (new Date()).getTime();
          // initiateUploadSpeedDetection(e.path[0])
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
          console.log('TEST RESULTS DOWNLOAD', speedMbps)
        }
      }

      initiateDownloadSpeedDetection()

      function initiateUploadSpeedDetection() {
        
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


        // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // http.setRequestHeader("Content-length", myData .length);
        // http.setRequestHeader("Connection", "close");

        http.onreadystatechange = function() {
            if(http.readyState === 4 && http.status === 200) {
                endTime = (new Date()).getTime();
                var duration = (endTime - startTime) / 1000;
                var bitsLoaded = downloadSize * 8;
                var speedMbps = ((bitsLoaded / duration) / 1024 / 1024).toFixed(2);
                console.log('TEST RESULTS UPLOAD', speedMbps)
              }
        }
        startTime = (new Date()).getTime();
        http.send(JSON.stringify({value: myData}));
      }

      initiateUploadSpeedDetection()

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

