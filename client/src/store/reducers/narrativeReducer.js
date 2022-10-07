import { START_STATE } from '../../constants';
import {
  CHANGE_GAME_STATE,
  CLOSE_CUTSCENE,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
} from '../types';

const initialState = {
  cutsceneId: null,
  classId: null,
  cutsceneIndex: 0,
  gameState: null,
};

export const initialNarrativeState = initialState

export default function narrativeReducer(state = initialState, { type, payload }) {
  switch (type) {
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
        gameState: payload.gameState
      }
    default:
      return state;
  }
}
