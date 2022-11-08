import { MUTE_VIDEO_AUDIO, PAUSE_BACKGROUND_MUSIC, PLAY_BACKGROUND_MUSIC, UNMUTE_VIDEO_AUDIO, UNPAUSE_BACKGROUND_MUSIC } from '../types';

const initialState = {
  isBackgroundMusicPlaying: false,
  isBackgroundMusicPaused: false,
  isVideoAudioUnmuted: false
};

export default function portfolioReducer(state = initialState, { type, payload }) {
  switch (type) {
    case MUTE_VIDEO_AUDIO: 
      return {
        ...state,
        isVideoAudioUnmuted: false
      }
    case UNMUTE_VIDEO_AUDIO: 
      return {
        ...state,
        isVideoAudioUnmuted: true
      }
    case PLAY_BACKGROUND_MUSIC: 
      return {
        ...state,
        isBackgroundMusicPlaying: true
      }
    case PAUSE_BACKGROUND_MUSIC: 
      return {
        ...state,
        isBackgroundMusicPaused: true
      }
    case UNPAUSE_BACKGROUND_MUSIC: 
      return {
        ...state,
        isBackgroundMusicPaused: false
      }
    default:
      return state;
  }
}
