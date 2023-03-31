import {
  CHANGE_PLAYER_STATE,
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  CHANGE_CONTROL_POPUP,
  CHANGE_PLAYER_CLASS,
} from '../../types';

// these are things that are only shared if you are cobrowsing!!, 
// player interfaceReducer
const initialState = {
  cutsceneId: null,
  cutsceneEntityId: null,
  cutsceneIndex: 0,
  playerState: null,
  playerStateMessage: null,
  playerEntityModelId: null,
  controlsToPress: null
};

export const initialPlayerInterfaceState = initialState

export default function playerInterfaceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_CUTSCENE:
      return {
        ...state,
        cutsceneId: payload.cutsceneId,
        cutsceneEntityId: payload.entityModelId,
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
        cutsceneEntityId: null,
        cutsceneIndex: 0,
      }
    case CHANGE_PLAYER_STATE: 
      return {
        ...state,
        playerState: payload.playerState,
        playerStateMessage: payload.playerStateMessage
      }
    case CLOSE_CUTSCENE:
      return {
        ...state,
        cutsceneId: null,
        cutsceneEntityId: null,
        cutsceneIndex: 0
      };
    case CHANGE_PLAYER_CLASS: 
      return {
        ...state,
        playerEntityModelId: payload.playerEntityModelId
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
