import store from '..';
import { GAME_EDITOR_EXPERIENCE } from '../../constants';
import { PLAY_STATE } from '../../game/constants';
import { getCurrentGameScene } from '../../utils/editorUtils';
import {
  CHANGE_GAME_STATE,
  CHANGE_PLAYER_STATE,
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  START_OPEN_CONSTELLATION,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  CHANGE_CONTROL_POPUP,
} from '../types';

// these are things that are only shared if you are cobrowsing!!, 
// player interfaceReducer
const initialState = {
  cutsceneId: null,
  cutsceneClassId: null,
  cutsceneIndex: 0,
  gameState: PLAY_STATE,
  gameStateMessage: null,
  player: {
    classId: null,
  },
  controlsToPress: null
};

export const initialGameContextState = initialState

export default function gameContextReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_CUTSCENE:
      return {
        ...state,
        cutsceneId: payload.cutsceneId,
        cutsceneClassId: payload.classId,
        cutsceneIndex: 0
      };
    case PROGRESS_CUTSCENE:
      return {
        ...state,
        cutsceneIndex: state.cutsceneIndex + 1
      };
    case CLEAR_CUTSCENES: 
      return {
        ...state,
        cutsceneId: null,
        cutsceneClassId: null,
        cutsceneIndex: 0,
      }
    case CHANGE_GAME_STATE: 
      return {
        ...state,
        gameState: payload.gameState,
        gameStateMessage: payload.gameStateMessage
      }
    case CLOSE_CUTSCENE:
      return {
        ...state,
        cutsceneId: null,
        cutsceneClassId: null,
        cutsceneIndex: 0
      };
    case CHANGE_PLAYER_STATE: 
      return {
        ...state,
        player: {
          ...state.player,
          ...payload.player
        }
      }
    case CHANGE_CONTROL_POPUP: 
      return {
      ...state,
      controlsToPress: payload.controlsToPress
    }
    default:
      return state;
  }
}
