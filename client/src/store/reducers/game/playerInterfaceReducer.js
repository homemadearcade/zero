import {
  CHANGE_PLAYER_STATE,
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  CHANGE_INTERACT_OPPURTUNITY,
  CHANGE_PLAYER_ENTITY,
  SET_IS_PLAYER_PAUSED,
} from '../../types';

// these are things that are only shared if you are cobrowsing!!, 
// player interfaceReducer
const initialState = {
  cutsceneId: null,
  cutsceneEntityId: null,
  cutsceneIndex: 0,
  isPlayerPaused: false,
  playerState: null,
  playerStateMessage: null,
  playerEntityModelId: null,
  interactOppurtunity: null
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
    case SET_IS_PLAYER_PAUSED: 
      return {
        ...state,
        isPlayerPaused: payload.isPlayerPaused
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
    case CHANGE_PLAYER_ENTITY: 
      return {
        ...state,
        playerGameInstanceId: payload.playerGameInstanceId,
        playerEntityModelId: payload.playerEntityModelId
      }
    case CHANGE_INTERACT_OPPURTUNITY: 
      return {
      ...state,
      interactOppurtunity: payload.interactOppurtunity
    }
    default:
      return state;
  }
}
