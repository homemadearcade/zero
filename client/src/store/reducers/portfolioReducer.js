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
        isVideoAudioUnmuted: false
      }
    case UNMUTE_VIDEO_AUDIO: 
      return {
        isVideoAudioMuted: true
      }
    case PLAY_BACKGROUND_MUSIC: 
      return {
        isBackgroundMusicPlaying: true
      }
    case PAUSE_BACKGROUND_MUSIC: 
      return {
        isBackgroundMusicPaused: true
      }
    case UNPAUSE_BACKGROUND_MUSIC: 
      return {
        isBackgroundMusicPaused: false
      }
    default:
      return state;
  }
}
