import {
  GET_GAMES_LOADING,
  GET_GAMES_SUCCESS,
  GET_GAMES_FAIL,
  GET_GAME_LOADING,
  GET_GAME_SUCCESS,
  GET_GAME_FAIL,
  ADD_GAME_LOADING,
  ADD_GAME_SUCCESS,
  ADD_GAME_FAIL,
  EDIT_GAME_LOADING,
  EDIT_GAME_SUCCESS,
  EDIT_GAME_FAIL,
  CLEAR_GAME_ERROR,
} from '../types';

const initialState = {
  games: [],
  isLoading: false,
  isModelLoading: false,
  error: null,
  model: null
};

export default function gameReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_GAME_LOADING:
      return {
        ...state,
        isModelLoading: true,
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
    case EDIT_GAME_LOADING:
      return {
        ...state,
        isModelLoading: true,
      };
    case GET_GAME_SUCCESS:
      return {
        ...state,
        isModelLoading: false,
        model: payload.game,
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
    case EDIT_GAME_SUCCESS:
      return {
        ...state,
        isModelLoading: false,
        model: payload.game,
      };
    case EDIT_GAME_FAIL:
      return {
        ...state,
        isModelLoading: false,
        error: payload.error,
      };
    case GET_GAME_FAIL:
      return {
        ...state,
        isModelLoading: false,
        error: payload.error,
      };
    case GET_GAMES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
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
