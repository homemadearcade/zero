import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_ARCADE_GAMES_LOADING,
  GET_ARCADE_GAMES_SUCCESS,
  GET_ARCADE_GAMES_FAIL,
  LOAD_GAME_MODEL_LOADING,
  LOAD_GAME_MODEL_SUCCESS,
  LOAD_GAME_MODEL_FAIL,
  ADD_ARCADE_GAME_LOADING,
  ADD_ARCADE_GAME_SUCCESS,
  ADD_ARCADE_GAME_FAIL,
  EDIT_ARCADE_GAME_LOADING,
  EDIT_ARCADE_GAME_SUCCESS,
  EDIT_ARCADE_GAME_FAIL,
  UNLOAD_GAME_MODEL,
  ON_GAME_MODEL_UPDATE,
  ON_GAME_CHARACTER_UPDATE,
  INITIALIZE_UNLOCKABLE_INTERFACE_IDS,
  GET_ARCADE_GAME_LOADING,
  GET_ARCADE_GAME_SUCCESS,
  GET_ARCADE_GAME_FAIL,
} from '../types';
import { mergeDeep } from '../../utils/utils';
import _ from 'lodash';
import store from '..';
import {  BACKGROUND_LAYER_CANVAS_ID, defaultGameModel, FOREGROUND_LAYER_CANVAS_ID, initialStageId, PLAYGROUND_LAYER_CANVAS_ID, UNDO_MEMORY_MAX } from '../../game/constants';
import { changeCurrentStage } from './gameModelActions';
import { addDefaultsToGameModel, addLibraryToGameModel, cleanGameModel, enrichGameModel, getTextureIdForLayerCanvasId } from '../../utils';
import { addCanvasImage } from './canvasImageActions';
import { IMAGE_TYPE_LAYER } from '../../constants';

export function onArcadeGameModelUpdate(gameUpdate) {
  const state = store.getState()
  const oldGameData = _.cloneDeep(state.gameModel.gameModel)
  const stageId = state.gameModel.currentStageId

  if(!window.nextGameModelUpdateIsUndo) {
    if(gameUpdate.stages) {
      const stage = gameUpdate.stages[stageId]
      if(stage) {
        const entityInstances = stage.entityInstances 
        const oldObjects = oldGameData.stages[stageId].entityInstances
        if(entityInstances) {
          window.instanceUndoStack.push(...Object.keys(entityInstances).map((entityInstanceId) => {
            return {
              entityInstanceStageId: stageId,
              entityInstanceId: entityInstanceId,
              data: _.cloneDeep(oldObjects[entityInstanceId])
            }
          }))
        }
      }
    }

    window.instanceUndoStack = window.instanceUndoStack.slice(-UNDO_MEMORY_MAX)
  }

  window.nextGameModelUpdateIsUndo = false

  addDefaultsToGameModel(gameUpdate, oldGameData) 

  const gameData = mergeDeep(oldGameData, gameUpdate)
  
  enrichGameModel(gameData)
  cleanGameModel(gameData)
  
  store.dispatch({
    type: ON_GAME_MODEL_UPDATE,
    payload: { gameModel: gameData },
  })

  window.events.emit(ON_GAME_MODEL_UPDATE, gameUpdate)
}

function onArcadeGameCharacterUpdate({ id, data }) {
  const me = store.getState().auth.me 
  const cobrowsing = store.getState().cobrowsing

  if(me.id === id || (cobrowsing.isSubscribedCobrowsing)) {  
    // needs to do update cobrowsing or else ur just locking ur own...
    store.dispatch({
      type: INITIALIZE_UNLOCKABLE_INTERFACE_IDS,
      updateCobrowsing: true,
      payload: {
        unlockableInterfaceIds: data.unlockableInterfaceIds
      }
    })
  }
}

export const updateArcadeGameCharacter = ({userId, unlockableInterfaceIds, merge}) => async (dispatch, getState) => {
  // dispatch({
  //   type: GET_SPRITESHEET_DATA_LOADING,
  // });

  try {
    const state = store.getState()
    const gameRoomId = state.lobby.lobby?.gameRoomId

    const options = attachTokenToHeaders(getState);
    const response = await axios.put('/api/arcadeGames/character', {
      gameRoomId,
      userId,
      unlockableInterfaceIds,
      merge
    }, options);

    return response

    // dispatch({
    //   type: GET_SPRITESHEET_DATA_SUCCESS,
    //   payload: { spritesByDescriptor, descriptorOptions },
    // });

  } catch(e) {

  }
}

export const getArcadeGames = () => async (dispatch, getState) => {
  dispatch({
    type: GET_ARCADE_GAMES_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames', options);

    dispatch({
      type: GET_ARCADE_GAMES_SUCCESS,
      payload: { arcadeGames: response.data.games },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ARCADE_GAMES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getArcadeGame = (id) => async (dispatch, getState) => {
  dispatch({
    type: GET_ARCADE_GAME_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames/' + id, options);

    dispatch({
      type: GET_ARCADE_GAME_SUCCESS,
      payload: { arcadeGame: response.data.game },
    });

    return response.data.game
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_ARCADE_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export const loadArcadeGame = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_GAME_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames/' + gameId, options);

    window.socket.on(ON_GAME_MODEL_UPDATE, onArcadeGameModelUpdate)
    window.socket.on(ON_GAME_CHARACTER_UPDATE, onArcadeGameCharacterUpdate)

    console.log(response.data.game)
    const gameData = mergeDeep(_.cloneDeep(defaultGameModel), response.data.game)

    dispatch(changeCurrentStage(gameData.player.startingStageId))

    addLibraryToGameModel(gameData)
    addDefaultsToGameModel(gameData) 
    enrichGameModel(gameData)

    dispatch({
      type: LOAD_GAME_MODEL_SUCCESS,
      payload: { gameModel: gameData },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: LOAD_GAME_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unloadArcadeGame = () => (dispatch, getState) => {
  window.socket.off(ON_GAME_MODEL_UPDATE, onArcadeGameModelUpdate)
  window.socket.off(ON_GAME_CHARACTER_UPDATE, onArcadeGameCharacterUpdate)

  dispatch({
    type: UNLOAD_GAME_MODEL,
  })
};

export async function addLayerCanvasTexturesForArcadeGameStage(gameId, stageId) {
  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    textureId: getTextureIdForLayerCanvasId(gameId, stageId, BACKGROUND_LAYER_CANVAS_ID), 
    userId: store.getState().auth.me.id,
    arcadeGame: gameId
  }))
  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    textureId: getTextureIdForLayerCanvasId(gameId, stageId, PLAYGROUND_LAYER_CANVAS_ID), 
    userId: store.getState().auth.me.id,
    arcadeGame: gameId
  }))
  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    textureId: getTextureIdForLayerCanvasId(gameId, stageId, FOREGROUND_LAYER_CANVAS_ID), 
    userId: store.getState().auth.me.id,
    arcadeGame: gameId
  }))
}

export const addArcadeGame = (gameData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ARCADE_GAME_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/arcadeGames', gameData, options);

    const gameId = response.data.game.id

    await addLayerCanvasTexturesForArcadeGameStage(gameId, initialStageId)

    dispatch({
      type: ADD_ARCADE_GAME_SUCCESS,
      payload: { arcadeGame: response.data.game },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_ARCADE_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const copyArcadeGameToUser = ({gameId, userId, isArchived}) => async (dispatch, getState) => {
  const options = attachTokenToHeaders(getState);
  const response = await axios.get('/api/arcadeGames/' + gameId, options);
  const gameData = response.data.game
  gameData.owner = null
  gameData.metadata.isArchived = isArchived
  gameData.metadata.isPublished = false
  gameData.userId = userId

  dispatch(addArcadeGame(gameData))
};


// export const deleteGame = (id) => async (dispatch, getState) => {
//   dispatch({
//     type: DELETE_GAME_LOADING,
//     payload: { id },
//   });
//   try {
//     const options = attachTokenToHeaders(getState);
//     const response = await axios.delete(`/api/arcadeGames/${id}`, options);

//     dispatch({
//       type: DELETE_GAME_SUCCESS,
//       payload: { arcadeGame: response.data.game },
//     });
//   } catch (err) {
 //    console.error(err)

//     dispatch({
//       type: DELETE_GAME_FAIL,
//       payload: { error: err?.response?.data.message || err.message },
//     });
//   }
// };

export const editArcadeGame = (id, gameData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_ARCADE_GAME_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/arcadeGames/${id}`, { gameUpdate : gameData }, options);

    dispatch({
      type: EDIT_ARCADE_GAME_SUCCESS,
      payload: { arcadeGame: response.data.game },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_ARCADE_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};