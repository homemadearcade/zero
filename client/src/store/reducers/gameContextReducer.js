import {
  CHANGE_GAME_STATE,
  CLEAR_GAME_CONTEXT,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
} from '../types';

const initialState = {
  cutsceneId: null,
  classId: null,
  cutsceneIndex: 0,
  gameState: null,
  gameStateMessage: null,
  isConstellationClosing: false,
  isConstellationOpen: false,
  constellationZoomImageFile: null,
  currentSceneId: null
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
        classId: payload.classId,
        cutsceneIndex: 0
      };
    case PROGRESS_CUTSCENE:
      return {
        ...state,
        cutsceneIndex: state.cutsceneIndex + 1
      };
    case CLEAR_GAME_CONTEXT: 
      return {
        ...initialGameContextState,
        gameState: state.gameState
      }
    case CLOSE_CUTSCENE:
      return {
        ...state,
        cutsceneId: null,
        classId: null,
        cutsceneIndex: 0
      };
    case CHANGE_GAME_STATE: 
      return {
        ...state,
        gameState: payload.gameState,
        gameStateMessage: payload.gameStateMessage
      }
    default:
      return state;
  }
}
