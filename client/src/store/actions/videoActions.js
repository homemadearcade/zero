import axios from 'axios'
import { useEffect } from 'react';

import {
  VIDEO_USER_JOINED,
  VIDEO_USER_LEFT,
  VIDEO_JOINED,
} from '../types';

import {
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

const config = { 
  mode: "rtc", codec: "vp8",
};

const appId = "0716694847e34448b71f311437be319f"; //ENTER APP ID HERE
const token = null;

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export const useVideo = async ({userId, lobbyId}) => {  
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    async function init() {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === "video") {
          addUser(user)
        }
        if (mediaType === "audio") {
          if(user.audioTrack) user.audioTrack.play();
        }
      });
    
      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          if(user.audioTrack) user.audioTrack.stop();
        }
        if (type === "video") {
          removeUser(user)
        }
      });
    
      client.on("user-left", (user) => {
        console.log("leaving", user);
        removeUser(user)
      });
    
      await client.join(appId, lobbyId, token, userId);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
    }
    
    init(lobbyId);

  }, [lobbyId, userId, client, ready, tracks]);

  const video = tracks;
  return [video]
}

export const addUser = (user) => async (dispatch, getState) => {
  dispatch({
    type: VIDEO_USER_JOINED,
    payload : {
      user: user
    }
  });
}


export const removeUser = (user) => async (dispatch, getState) => {
  dispatch({
    type: VIDEO_USER_LEFT,
    payload : {
      user: user
    }
  });
}