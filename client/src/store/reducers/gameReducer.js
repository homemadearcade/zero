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
  // EDIT_GAME_SUCCESS,
  EDIT_GAME_FAIL,
  CLEAR_GAME_ERROR,
  CLEAR_GAME_MODEL,
  ON_GAME_MODEL_UPDATE,
} from '../types';

const initialState = {
  games: [],
  isLoading: false,
  isGameModelLoading: false,
  error: null,
  gameModel: null
};

export default function gameReducer(state = initialState, { type, payload }) {
  switch (type) {
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
            user: { ...payload.me },
          },
          ...state.games,
        ],
      };
    case LOAD_GAME_SUCCESS:
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
          if (m.id === 0) return payload.game;
          return m;
        }),
      };
    case ON_GAME_MODEL_UPDATE: 
      return {
        ...state,
        gameModel: payload.game,
      };
    // case EDIT_GAME_LOADING:
    //   return {
    //     ...state,
    //   };
    // case EDIT_GAME_SUCCESS:
    //   return {
    //     ...state,
    //     gameModel: payload.game,
    //   };
    case EDIT_GAME_FAIL:
      return {
        ...state,
        error: payload.error,
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
    case CLEAR_GAME_MODEL: 
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
