import {
  CHANGE_CURRENT_STAGE,
  CHANGE_GAME_STATE,
  CHANGE_PLAYER_STATE,
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
} from '../types';

const initialState = {
  cutsceneId: null,
  cutsceneClassId: null,
  cutsceneIndex: 0,
  gameState: null,
  gameStateMessage: null,
  isConstellationClosing: false,
  isConstellationOpen: false,
  constellationZoomImageFile: null,
  currentStageId: null,
  player: {
    classId: null,

  }
};

export const initialGameContextState = initialState

export default function gameContextReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: true
      }
    case COMPLETE_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: false,
        isConstellationOpen: false
      }
    case OPEN_CONSTELLATION:
      return {
        ...state,
        isConstellationOpen: true,
        constellationZoomImageFile: payload.imageBase64
      }
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
    case CHANGE_CURRENT_STAGE: 
      return {
        ...state,
        currentStageId: payload.stageId,
      }
    case CHANGE_PLAYER_STATE: 
      return {
        ...state,
        player: {
          ...state.player,
          ...payload.player
        }
      }
    default:
      return state;
  }
}
