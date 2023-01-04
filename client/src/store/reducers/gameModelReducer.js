import {
  LOAD_GAME_MODEL_LOADING,
  LOAD_GAME_MODEL_SUCCESS,
  LOAD_GAME_MODEL_FAIL,
  UNLOAD_GAME_MODEL,
  ON_GAME_MODEL_UPDATE,
  GET_SPRITESHEET_DATA_FAIL,
  GET_SPRITESHEET_DATA_SUCCESS,
} from '../types';

const initialState = {
  isLoading: false,
  isSpriteSheetDataLoaded: false,
  error: null,
  gameModel: null,
  spritesByDescriptor: null,
};

export default function gameReducer(state = initialState, { type, payload }) {
  console.log(type)
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
      console.log('game model loaded', payload.gameModel)
      return {
        ...state,
        isLoading: false,
        gameModel: payload.gameModel,
      };
    case GET_SPRITESHEET_DATA_SUCCESS:
      return {
        ...state,
        spritesByDescriptor: payload.spritesByDescriptor,
        descriptorOptions: payload.descriptorOptions,
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
    default:
      return state;
  }
}
