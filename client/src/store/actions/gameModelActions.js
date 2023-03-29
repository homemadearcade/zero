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
  SAVE_CANVAS_IMAGE_LOADING,
  SAVE_CANVAS_IMAGE_SUCCESS,
  SAVE_CANVAS_IMAGE_FAIL,
  ON_GAME_MODEL_UPDATE,
} from '../types';
import _ from 'lodash';
import { uploadToAws } from '../../utils/networkUtils';
import { getSpritesByDescriptor } from '../../game/constants';
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

    const visualTagOptions = Object.keys(spritesByDescriptor).map((visualTag) => {
      return {
        label: visualTag,
        value: visualTag
      }
    })

    dispatch({
      type: GET_SPRITESHEET_DATA_SUCCESS,
      payload: { spritesByDescriptor, visualTagOptions },
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
  const gameRoomInstance = getState().gameRoomInstance.gameRoomInstance

  dispatch({
    type: EDIT_GAME_MODEL_LOADING,
  });

  const isAutosaveDisabled = gameRoomInstance?.isAutosaveDisabled

  try {
    if(gameUpdate.entityClasses) {
      Object.keys(gameUpdate.entityClasses).forEach((entityClassId) => {
        const entityClass = gameUpdate.entityClasses[entityClassId]
        entityClass.lastEditedDate = Date.now()
      })
    }

    // local edit mode, skip right to it ( optimistically ) !
    if(!gameRoomInstance.id) {
      onArcadeGameModelUpdate(gameUpdate)
    }

    const options = attachTokenToHeaders(getState);
    await axios.put(`/api/arcadeGames/${gameId}`, { gameRoomInstanceId: gameRoomInstance.id, gameUpdate: gameUpdate, isAutosaveDisabled}, options);


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