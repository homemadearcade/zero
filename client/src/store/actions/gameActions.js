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
  GET_SPRITESHEET_DATA_LOADING,
  GET_SPRITESHEET_DATA_SUCCESS,
  GET_SPRITESHEET_DATA_FAIL,
  CLEAR_GAME_ERROR,
  UNLOAD_GAME,
  ON_GAME_MODEL_UPDATE,
} from '../types';
import { mergeDeep } from '../../utils/utils';
import _ from 'lodash';
import { defaultGame } from '../../defaultData/game';
import { defaultObjectInstance } from '../../defaultData/object';
import { defaultObjectClass } from '../../defaultData/class';
import { uploadToAws } from './browserActions';
import { getTextureIds } from '../../defaultData/descriptors';

 
export const getSpritesheetData  = () => async (dispatch, getState) => {
  dispatch({
    type: GET_SPRITESHEET_DATA_LOADING,
  });

  try {
    const textureIds = await getTextureIds()

    dispatch({
      type: GET_SPRITESHEET_DATA_SUCCESS,
      payload: { textureIds },
    });

  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_SPRITESHEET_DATA_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}


export const addAwsImage  = (file, fileId, imageData) => async(dispatch, getState) => {
  dispatch({
    type: EDIT_GAME_LOADING,
  });

  try {
    const response = await uploadToAws(fileId, file)
    
    dispatch(editGameModel({
      awsImages: { 
        [fileId] : {
          name: imageData.name,
          url: fileId,
          type: imageData.type
        }
      }
    }))
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }

}
 
export const editGameModel  = (gameUpdate) => async (dispatch, getState) => {
  const lobbyId = getState().lobby.lobby.id
  const gameId = getState().game.gameModel.id

  dispatch({
    type: EDIT_GAME_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/games/${gameId}`, { lobbyId: lobbyId, gameUpdate: gameUpdate }, options);

    // DEPRECATED for local editing mode, there will be no ON_GAME_MODEL_UPDATED event in this scenario so we need a local EDIT_GAME_SUCCESS
    // if(!lobbyId) {
    //   dispatch({
    //     type: EDIT_GAME_SUCCESS,
    //     payload: { game: response.data.game },
    //   });
    // }

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

    window.socket.on(ON_GAME_MODEL_UPDATE, (gameUpdate) => {
      const oldGameData = _.cloneDeep(getState().game.gameModel)

      if(gameUpdate.objects) Object.keys(gameUpdate.objects).forEach((id) => {
        if(!oldGameData.objects[id]) gameUpdate.objects[id] = mergeDeep({...defaultObjectInstance}, gameUpdate.objects[id])
      })
      if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
        if(!oldGameData.classes[id]) gameUpdate.classes[id] = mergeDeep({...defaultObjectClass}, gameUpdate.classes[id])
      })

      const gameData = mergeDeep(oldGameData, gameUpdate)
     
      dispatch({
        type: ON_GAME_MODEL_UPDATE,
        payload: { game: gameData },
      });
    })

    const gameData = mergeDeep(defaultGame, response.data.game)
    Object.keys(gameData.objects).forEach((id) => {
      gameData.objects[id] = mergeDeep({...defaultObjectInstance}, gameData.objects[id])
    })
    Object.keys(gameData.classes).forEach((id) => {
      gameData.classes[id] = mergeDeep({...defaultObjectClass}, gameData.classes[id])
    })

    dispatch({
      type: LOAD_GAME_SUCCESS,
      payload: { game: gameData },
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