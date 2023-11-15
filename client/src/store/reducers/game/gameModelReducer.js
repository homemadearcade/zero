import {
  LOAD_GAME_MODEL_LOADING,
  LOAD_GAME_MODEL_SUCCESS,
  LOAD_GAME_MODEL_FAIL,
  UNLOAD_GAME_MODEL,
  ON_GAME_MODEL_UPDATE,
  GET_SPRITESHEET_DATA_FAIL,
  GET_SPRITESHEET_DATA_SUCCESS,
  CHANGE_CURRENT_STAGE,
  ADD_STAGE_TO_GAME_MODEL_FAIL,
  ADD_STAGE_TO_GAME_MODEL_LOADING,
  ADD_STAGE_TO_GAME_MODEL_SUCCESS,
} from '../../types';

const initialState = {
  isLoading: false,
  isSpriteSheetDataLoaded: false,
  error: null,
  gameModel: null,
  spritesByDescriptor: null,

  isStageAddLoading: false,
};

export default function gameReducer(state = initialState, { type, payload }) {
  switch (type) {
    // case GET_SPRITESHEET_DATA_LOADING:
    //   return {
    //     ...state,
    //     isSpriteSheetDataLoaded: false,
    //   };
    case LOAD_GAME_MODEL_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_GAME_MODEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        gameModel: payload.gameModel,
      };
    case GET_SPRITESHEET_DATA_SUCCESS:
      return {
        ...state,
        spritesByDescriptor: payload.spritesByDescriptor,
        visualTagOptions: payload.visualTagOptions,
        isSpriteSheetDataLoaded: true,
      };
    case ON_GAME_MODEL_UPDATE: 
      return {
        ...state,
        gameModel: payload.gameModel,
      };
    // case EDIT_GAME_LOADING:
    //   return {
    //     ...state,
    //   };
    case GET_SPRITESHEET_DATA_FAIL:
      return {
        ...state,
        error: payload.error,
        isSpriteSheetDataLoaded: false,
      };
    case LOAD_GAME_MODEL_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case UNLOAD_GAME_MODEL: 
      return {
        ...state,
        isLoading: false,
        gameModel: null
      };
    case ADD_STAGE_TO_GAME_MODEL_LOADING: 
      return {
        ...state,
        isStageAddLoading: true,
      };
    case ADD_STAGE_TO_GAME_MODEL_FAIL:
      return {
        ...state,
        isStageAddLoading: false,
        error: payload.error,
      };
    case ADD_STAGE_TO_GAME_MODEL_SUCCESS:
      return {
        ...state,
        isStageAddLoading: false,
      };
    default:
      return state;
  }
}
