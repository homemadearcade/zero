import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  EDIT_GAME_MODEL_LOADING,
  // EDIT_GAME_MODEL_SUCCESS,
  EDIT_GAME_MODEL_FAIL,
  GET_SPRITESHEET_DATA_LOADING,
  GET_SPRITESHEET_DATA_SUCCESS,
  GET_SPRITESHEET_DATA_FAIL,
  UNLOAD_GAME_MODEL,
  ON_GAME_MODEL_UPDATE,
} from '../types';
import { mergeDeep } from '../../utils/utils';
import _ from 'lodash';
import { defaultObjectInstance } from '../../game/defaultData/object';
import { defaultObjectClass } from '../../game/defaultData/class';
import { uploadToAws } from '../../utils/networkUtils';
import { getSpritesByDescriptor } from '../../game/defaultData/descriptors';
import store from '..';

 
export const getSpritesheetData  = () => async (dispatch, getState) => {
  dispatch({
    type: GET_SPRITESHEET_DATA_LOADING,
  });

  try {
    const spritesByDescriptor = await getSpritesByDescriptor()

    const descriptorOptions = Object.keys(spritesByDescriptor).map((descriptor) => {
      return {
        label: descriptor,
        value: descriptor
      }
    })

    dispatch({
      type: GET_SPRITESHEET_DATA_SUCCESS,
      payload: { spritesByDescriptor, descriptorOptions },
    });

  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_SPRITESHEET_DATA_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}


export const addAwsImage = (file, fileId, imageData) => {
  return new Promise(async (resolve, reject) => {
    try {
      await uploadToAws(fileId, file)
      
      store.dispatch(editGameModel({
        awsImages: { 
          [fileId] : {
            name: imageData.name,
            url: fileId,
            type: imageData.type
          }
        }
      }))

      resolve()
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })

}
 
export const editGameModel  = (gameUpdate) => async (dispatch, getState) => {
  const lobbyId = getState().lobby.lobby.id
  const gameId = getState().gameModel.gameModel.id

  dispatch({
    type: EDIT_GAME_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    await axios.put(`/api/arcadeGames/${gameId}`, { lobbyId: lobbyId, gameUpdate: gameUpdate }, options);

    // DEPRECATED for local editing mode, there will be no ON_GAME_MODEL_UPDATED event in this scenario so we need a local EDIT_GAME_SUCCESS
    // if(!lobbyId) {
    //   dispatch({
    //     type: EDIT_GAME_MODEL_SUCCESS,
    //     payload: { game: response.data.game },
    //   });
    // }

  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_GAME_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
}

// export const unloadArcadeGameModel = () => (dispatch, getState) => {
//   window.socket.off(ON_GAME_MODEL_UPDATE, onGameModelUpdate)

//   dispatch({
//     type: UNLOAD_GAME_MODEL,
//   })
// };