import { useEffect, useState } from 'react';

import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
} from '../types';

import {
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import { updateVideoCobrowsing, updateLobbyCobrowsing } from './cobrowsingActions';

const config = { 
  mode: "rtc", codec: "vp8",
};

const appId = "0716694847e34448b71f311437be319f"; //ENTER APP ID HERE
const token = null;

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
window.useClient = useClient

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export const startAgoraVideoCall = () => (dispatch, getState) => {
  dispatch({
    type: START_VIDEO_CALL_LOADING,
  });

  dispatch(updateVideoCobrowsing(getState().video.videoState))
} 

export const onStartAgoraVideoCallSuccess = () => (dispatch, getState) => {
  dispatch({
    type: START_VIDEO_CALL_SUCCESS,
    payload:{}
  });

  dispatch(updateVideoCobrowsing(getState().video.videoState))
  dispatch(updateLobbyCobrowsing(getState().lobby.lobbyState))
}

export const onStartAgoraVideoCallFail = (error) => (dispatch, getState) => {
  dispatch({
    type: START_VIDEO_CALL_FAIL,
    payload:{
      error
    }
  });

  dispatch(updateVideoCobrowsing(getState().video.videoState))
} 

export const useAgoraVideoCall = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, userId, lobbyId, }) => {  
  const [users, setUsers] = useState([]);
  // using the hook to get access to the client object
  const client = useClient();
  window.videoClient = client;

  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const mct = useMicrophoneAndCameraTracks();
  const { tracks, ready } = mct;

  useEffect(() => {
    async function init() {
      try {
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log("subscribe success");
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            if(user.audioTrack) user.audioTrack.play();
          }
        });
  
        client.on("connection-state-changee", (curState, revState, reason) => {
          console.log('CONNECTION CHANGE', curState, revState, reason)
        })
      
        client.on("user-unpublished", (user, type) => {
          console.log("unpublished", user, type);
          if (type === "audio") {
            if(user.audioTrack) user.audioTrack.stop();
          }
          if (type === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        });
        
  
        client.on('network-quality', ({downlinkNetworkQuality, uplinkNetworkQuality}) => {
          window.uplinkNetworkQuality = uplinkNetworkQuality
          window.downlinkNetworkQuality = downlinkNetworkQuality
          window.events.emit('ON_MY_VIDEO_QUALITY_STATUS_UPDATE', {
            downlinkNetworkQuality,
            uplinkNetworkQuality
          })
        })
      
        client.on("user-left", (user) => {
          console.log("leaving", user);
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        });
      
        await client.join(appId, lobbyId, token, userId);
        await client.publish([tracks[0], tracks[1]]);
  
        onStartAgoraVideoCallSuccess()
  
        setInterval(() => {
          const remoteNetworkQuality = client.getRemoteNetworkQuality();
          window.events.emit('ON_REMOTE_VIDEO_QUALITY_STATUS_UPDATE', remoteNetworkQuality)
        }, 1000)
      } catch(err) {
        onStartAgoraVideoCallFail(err)
      }
   
    }

    if (ready && tracks) {
      console.log("init ready");
      init(lobbyId);
    }

  }, [lobbyId, userId, client, ready, tracks]);

  return [tracks, users]
}
