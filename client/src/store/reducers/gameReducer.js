import {
  GET_GAMES_LOADING,
  GET_GAMES_SUCCESS,
  GET_GAMES_FAIL,
  LOAD_GAME_LOADING,
  LOAD_GAME_SUCCESS,
  LOAD_GAME_FAIL,
  ADD_GAME_LOADING,
  ADD_GAME_SUCCESS,
  ADD_GAME_FAIL,
  // EDIT_GAME_LOADING,
  EDIT_GAME_FAIL,
  EDIT_GAME_SUCCESS,
  CLEAR_GAME_ERROR,
  UNLOAD_GAME,
  ON_GAME_MODEL_UPDATE,
  GET_SPRITESHEET_DATA_FAIL,
  GET_SPRITESHEET_DATA_SUCCESS,
} from '../types';

const initialState = {
  games: [],
  isLoading: false,
  isGameModelLoading: false,
  isSpriteSheetDataLoaded: false,
  error: null,
  gameModel: null,
  spritesByDescriptor: null,
};

export default function gameReducer(state = initialState, { type, payload }) {
  switch (type) {
    // case GET_SPRITESHEET_DATA_LOADING:
    //   return {
    //     ...state,
    //     isSpriteSheetDataLoaded: false,
    //   };
    case LOAD_GAME_LOADING:
      return {
        ...state,
        isGameModelLoading: true,
      };
    case GET_GAMES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_GAME_LOADING:
      return {
        ...state,
        games: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            user: { ...payload.me },
          },
          ...state.games,
        ],
      };
    case LOAD_GAME_SUCCESS:
      console.log('game loaded', payload.game)
      return {
        ...state,
        isGameModelLoading: false,
        gameModel: payload.game,
      };
    case GET_GAMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        games: payload.games,
      };
    case ADD_GAME_SUCCESS:
      return {
        ...state,
        games: state.games.map((m) => {
          console.log(m)
          if (m.id === 0) return payload.game;
          return m;
        }),
      };
    case GET_SPRITESHEET_DATA_SUCCESS:
      return {
        ...state,
        spritesByDescriptor: payload.spritesByDescriptor,
        descriptorOptions: payload.descriptorOptions,
        isSpriteSheetDataLoaded: true,
      };
    case EDIT_GAME_SUCCESS:
    case ON_GAME_MODEL_UPDATE: 
      return {
        ...state,
        gameModel: payload.game,
      };
    // case EDIT_GAME_LOADING:
    //   return {
    //     ...state,
    //   };
    case EDIT_GAME_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case GET_SPRITESHEET_DATA_FAIL:
      return {
        ...state,
        error: payload.error,
        isSpriteSheetDataLoaded: false,
      };
    case LOAD_GAME_FAIL:
      return {
        ...state,
        isGameModelLoading: false,
        error: payload.error,
      };
    case GET_GAMES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case UNLOAD_GAME: 
      return {
        ...state,
        isGameModelLoading: false,
        gameModel: null
      };
    case ADD_GAME_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        games: state.games.filter((m) => m.id !== 0),
      };
    case CLEAR_GAME_ERROR:
      return {
        ...state,
        games: state.games.map((m) => {
          if (m.id === payload.id) return { ...m, isLoading: false, error: null };
          return m;
        }),
      };
    default:
      return state;
  }
}
