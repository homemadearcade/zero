import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
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
  // DELETE_GAME_LOADING,
  // DELETE_GAME_SUCCESS,
  // DELETE_GAME_FAIL,
  EDIT_GAME_LOADING,
  EDIT_GAME_SUCCESS,
  EDIT_GAME_FAIL,
  CLEAR_GAME_ERROR,
  UNLOAD_GAME,
  ON_GAME_MODEL_UPDATE,
  ON_GAME_INSTANCE_UPDATE,
} from '../types';

export const editGameModel  = (gameData) => async (dispatch, getState) => {
  const lobbyId = getState().lobby.lobby.id

  dispatch({
    type: EDIT_GAME_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/games/${gameData.id}`, { lobbyId: lobbyId, game: gameData }, options);

    // for local editing mode, there will be no ON_GAME_MODEL_UPDATED event so we need a local EDIT_GAME_SUCCESS
    if(!lobbyId) {
      dispatch({
        type: EDIT_GAME_SUCCESS,
        payload: { game: response.data.game },
      });
    }
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
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
    console.error(err)

    dispatch({
      type: GET_GAMES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const loadGame = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_GAME_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/games/' + gameId, options);

    window.socket.on(ON_GAME_MODEL_UPDATE, (game) => {
      dispatch({
        type: ON_GAME_INSTANCE_UPDATE,
        payload: { game },
      });
    })

    dispatch({
      type: LOAD_GAME_SUCCESS,
      payload: { game: response.data.game },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: LOAD_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unloadGame = () => (dispatch, getState) => {
  window.socket.off(ON_GAME_MODEL_UPDATE)

  dispatch({
    type: UNLOAD_GAME,
  })
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

    return response
  } catch (err) {
    console.error(err)

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
 //    console.error(err)

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
    const response = await axios.put(`/api/games/${id}`, { game : gameData }, options);

    dispatch({
      type: EDIT_GAME_SUCCESS,
      payload: { game: response.data.game },
    });
  } catch (err) {
    console.error(err)

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