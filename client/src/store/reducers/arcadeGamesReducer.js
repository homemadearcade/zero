import {
  GET_ARCADE_GAMES_LOADING,
  GET_ARCADE_GAMES_SUCCESS,
  GET_ARCADE_GAMES_FAIL,
  ADD_ARCADE_GAME_LOADING,
  ADD_ARCADE_GAME_SUCCESS,
  ADD_ARCADE_GAME_FAIL,
  EDIT_ARCADE_GAME_FAIL,
} from '../types';

const initialState = {
  arcadeGames: [],
  isLoading: false,
  error: null,
};

export default function arcadeGamesReducer(state = initialState, { type, payload }) {
  switch (type) {
    // case GET_SPRITESHEET_DATA_LOADING:
    //   return {
    //     ...state,
    //     isSpriteSheetDataLoaded: false,
    //   };
    case GET_ARCADE_GAMES_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_ARCADE_GAME_LOADING:
      return {
        ...state,
        arcadeGames: [
          {
            id: 0,
            isLoading: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {},
            user: { ...payload.me },
          },
          ...state.arcadeGames,
        ],
      };
    case GET_ARCADE_GAMES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        arcadeGames: payload.arcadeGames,
      };
    case ADD_ARCADE_GAME_SUCCESS:
      return {
        ...state,
        arcadeGames: state.arcadeGames.map((m) => {
          if (m.id === 0) return payload.arcadeGame;
          return m;
        }),
      };
    // case EDIT_ARCADE_GAME_LOADING:
    //   return {
    //     ...state,
    //   };
    case EDIT_ARCADE_GAME_FAIL:
      return {
        ...state,
        error: payload.error,
      };
    case GET_ARCADE_GAMES_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
      };
    case ADD_ARCADE_GAME_FAIL:
      return {
        ...state,
        isLoading: false,
        error: payload.error,
        arcadeGames: state.arcadeGames.filter((m) => m.id !== 0),
      };
    default:
      return state;
  }
}
