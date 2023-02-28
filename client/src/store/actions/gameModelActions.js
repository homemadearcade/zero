import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  EDIT_GAME_MODEL_LOADING,
  // EDIT_GAME_MODEL_SUCCESS,
  EDIT_GAME_MODEL_FAIL,
  GET_SPRITESHEET_DATA_LOADING,
  GET_SPRITESHEET_DATA_SUCCESS,
  GET_SPRITESHEET_DATA_FAIL,
  CHANGE_CURRENT_STAGE,
  SAVE_TEXTURE_LOADING,
  SAVE_TEXTURE_SUCCESS,
  SAVE_TEXTURE_FAIL,
  ON_GAME_MODEL_UPDATE,
} from '../types';
import _ from 'lodash';
import { uploadToAws } from '../../utils/networkUtils';
import { getSpritesByDescriptor } from '../../game/defaultData/descriptors';
import store from '..';
import { onArcadeGameModelUpdate } from './arcadeGameActions';

export const changeCurrentStage = (stageId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_CURRENT_STAGE,
    payload: {
      stageId,
    }
  })
};
 
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

export const editGameModel  = (gameUpdate) => async (dispatch, getState) => {
  const gameId = getState().gameModel.gameModel.id
  const gameRoom = getState().gameRoom.gameRoom

  dispatch({
    type: EDIT_GAME_MODEL_LOADING,
  });

  const isAutosaveDisabled = gameRoom?.isAutosaveDisabled

  try {
    const options = attachTokenToHeaders(getState);
    await axios.put(`/api/arcadeGames/${gameId}`, { gameRoomId: gameRoom.id, gameUpdate: gameUpdate, isAutosaveDisabled}, options);

    // local edit mode, skip right to it!
    if(!gameRoom.id) {
      onArcadeGameModelUpdate(gameUpdate)
    }

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