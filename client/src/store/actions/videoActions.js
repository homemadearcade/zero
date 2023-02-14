import { useEffect, useState } from 'react';

import {
  START_VIDEO_CALL_LOADING,
  START_VIDEO_CALL_SUCCESS,
  START_VIDEO_CALL_FAIL,
  LEAVE_VIDEO_CALL_SUCCESS,
  LEAVE_VIDEO_CALL_FAIL,
  SET_VIDEO_TRACK_ID,
  SET_AUDIO_TRACK_ID,
  BYPASS_VIDEO_CALL,
  SET_CUT_VIDEO,
  SET_CUT_AUDIO,
  SET_MY_VIDEO_TRACK_COMPONENT
} from '../types';

import {
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";
import AgoraRTC from 'agora-rtc-react';

import { ON_MY_VIDEO_QUALITY_STATUS_UPDATE } from '../../lobby/constants';
import { sendLobbyMessage } from './lobbyActions';
import store from '..';
import { inIframe } from '../../utils/webPageUtils';

const config = { 
  mode: "rtc", codec: "vp8",
};

const appId = "0716694847e34448b71f311437be319f"; //ENTER APP ID HERE
const token = null;

AgoraRTC.setLogLevel(2)

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export const setVideoTrackId = (trackId) => (dispatch, getState) => {
  dispatch({
    type: SET_VIDEO_TRACK_ID,
    payload : {
      videoTrackId: trackId
    }
  });
}

export const setAudioTrackId = (trackId) => (dispatch, getState) => {
  dispatch({
    type: SET_AUDIO_TRACK_ID,
    payload : {
      audioTrackId: trackId
    }
  });
}

export const bypassAgoraVideoCall = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: BYPASS_VIDEO_CALL,
  });
}

export const startAgoraVideoCall = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: START_VIDEO_CALL_LOADING,
  });
}

export const onStartAgoraVideoCallSuccess = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: START_VIDEO_CALL_SUCCESS,
    payload:{}
  });
}

export const onStartAgoraVideoCallFail = (error) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: START_VIDEO_CALL_FAIL,
    payload:{
      error
    }
  });
} 

export const leaveAgoraVideoCall = () => (dispatch) => {
  try {
    const client = useClient()
    const tracks = client.localTracks
  
    if(tracks) {
      if(tracks[0]) {
        tracks[0].close();
      }
      if(tracks[1]) {
        tracks[1].close();
      }
    }

    if(client) {
      client.leave();
      client.removeAllListeners();
    }

    dispatch({
      type: LEAVE_VIDEO_CALL_SUCCESS,
      payload:{}
    });
  } catch(error) {
    console.error(error)

    dispatch({
      type: LEAVE_VIDEO_CALL_FAIL,
      payload: { error }
    });
  }
}

export const useAgoraVideoCallClient = () => {
  return useClient()
}

export const useAgoraVideoCall = ({onStartAgoraVideoCallFail, onStartAgoraVideoCallSuccess, videoTrackId, audioTrackId, userId, videoCallId}) => {  
  const [users, setUsers] = useState([]);
  // using the hook to get access to the client object
  const client = useClient();

  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { tracks, ready } = useMicrophoneAndCameraTracks();

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
          window.events.emit(ON_MY_VIDEO_QUALITY_STATUS_UPDATE, {
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

        if(videoTrackId) {
          tracks[1].setDevice(videoTrackId)
        }

        if(audioTrackId) {
          tracks[0].setDevice(audioTrackId)
        }

        await client.join(appId, videoCallId, token, userId);
        await client.publish([tracks[0], tracks[1]]);

        store.dispatch(sendLobbyMessage({message: 'has connected video and audio', automated: true}))
  
        onStartAgoraVideoCallSuccess()
      } catch(err) {
        console.error(err)

        onStartAgoraVideoCallFail(err)
      }
   
    }

    if (ready && tracks) {
      init();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, ready, tracks]);

  return [tracks, users]
}

export const useChangeAgoraVideoAudio = (tracks) => {
  const client = useClient()

  const [videoDevices, setVideoDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])

  const setVideoDevice = (deviceId) => {
    if(tracks) {
      tracks.videoTrack.setDevice(deviceId)
    } else {
      client.localTracks[0].setDevice(deviceId)
    }
  }
  
  const setAudioDevice = (deviceId) => {
    if(tracks) {
      tracks.audioTrack.setDevice(deviceId)
    } else {
      client.localTracks[1].setDevice(deviceId)
    }
  }

  useEffect(() => {
    const getVideoDevices = async () => {
      const devices = await AgoraRTC.getDevices()
      setVideoDevices(devices.filter(({kind}) => {
        return kind === "videoinput"
      }))
    };
  
    const getAudioDevices = async () => {
      const devices = await AgoraRTC.getDevices()
      setAudioDevices(devices.filter(({kind}) => {
        return kind === "audioinput"
      }))
    };
    
    getVideoDevices()
    getAudioDevices()
  }, [])

  return [videoDevices, audioDevices, setVideoDevice, setAudioDevice]
}

export const setCutVideo = (value, forceCobrowsingUpdate) => (dispatch, getState) => {
  dispatch({
    forceCobrowsingUpdate,
    updateCobrowsing: true,
    type: SET_CUT_VIDEO,
    payload: {
      value
    }
  })
}

export const setCutAudio = (value, forceCobrowsingUpdate) => (dispatch, getState) => {
  dispatch({
    forceCobrowsingUpdate,
    updateCobrowsing: true,
    type: SET_CUT_AUDIO,
    payload: {
      value
    }
  })
}

export const setMyVideoTrackComponent = (id) => (dispatch, getState) => {
  dispatch({
    type: SET_MY_VIDEO_TRACK_COMPONENT,
    payload: {
      id
    }
  })
}

