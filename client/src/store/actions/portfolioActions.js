import {
  UNMUTE_VIDEO_AUDIO,
  MUTE_VIDEO_AUDIO,
  PAUSE_BACKGROUND_MUSIC,
  PLAY_BACKGROUND_MUSIC,
  UNPAUSE_BACKGROUND_MUSIC,
} from '../types';

export const playBackgroundMusic = () => (dispatch, getState) => {
  dispatch({
    type: PLAY_BACKGROUND_MUSIC,
  })
};

export const pauseBackgroundMusic = () => (dispatch, getState) => {
  dispatch({
    type: PAUSE_BACKGROUND_MUSIC,
  })
};

export const unpauseBackgroundMusic = () => (dispatch, getState) => {
  dispatch({
    type: UNPAUSE_BACKGROUND_MUSIC,
  })
};


export const muteVideoAudio = () => (dispatch, getState) => {
  dispatch({
    type: MUTE_VIDEO_AUDIO,
  })
};

export const unmuteVideoAudio = () => (dispatch, getState) => {
  dispatch({
    type: UNMUTE_VIDEO_AUDIO,
  })
};