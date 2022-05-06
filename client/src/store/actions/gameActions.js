import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
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
  // DELETE_GAME_LOADING,
  // DELETE_GAME_SUCCESS,
  // DELETE_GAME_FAIL,
  EDIT_GAME_LOADING,
  EDIT_GAME_SUCCESS,
  EDIT_GAME_FAIL,
  CLEAR_GAME_ERROR,
  CLEAR_GAME_MODEL,
  UPDATE_GAME_MODEL
} from '../types';

export const updateGameModel  = (gameModel) => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_GAME_MODEL,
    payload: {
      gameModel
    }
  });
}

export const getGames = () => async (dispatch, getState) => {
  dispatch({
    type: GET_GAMES_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/games', options);

    dispatch({
      type: GET_GAMES_SUCCESS,
      payload: { games: response.data.games },
    });
  } catch (err) {
    dispatch({
      type: GET_GAMES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getGame = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: GET_GAME_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/games/' + gameId, options);

    dispatch({
      type: GET_GAME_SUCCESS,
      payload: { game: response.data.game },
    });
  } catch (err) {
    dispatch({
      type: GET_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addGame = (gameData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_GAME_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/games', gameData, options);

    dispatch({
      type: ADD_GAME_SUCCESS,
      payload: { game: response.data.game },
    });
  } catch (err) {
    dispatch({
      type: ADD_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

// export const deleteGame = (id) => async (dispatch, getState) => {
//   dispatch({
//     type: DELETE_GAME_LOADING,
//     payload: { id },
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.delete(`/api/games/${id}`, options);

//     dispatch({
//       type: DELETE_GAME_SUCCESS,
//       payload: { game: response.data.game },
//     });
//   } catch (err) {
//     dispatch({
//       type: DELETE_GAME_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

export const editGame = (id, gameData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_GAME_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/games/${id}`, gameData, options);

    dispatch({
      type: EDIT_GAME_SUCCESS,
      payload: { game: response.data.game },
    });
  } catch (err) {
    dispatch({
      type: EDIT_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearGameError = (id) => ({
  type: CLEAR_GAME_ERROR,
  payload: { id },
});

export const clearGameModel = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_GAME_MODEL,
  })
};
