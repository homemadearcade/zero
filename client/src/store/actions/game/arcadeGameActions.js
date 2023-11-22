import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
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
  INITIALIZE_UNLOCKED_INTERFACE_IDS,
  GET_ARCADE_GAME_LOADING,
  GET_ARCADE_GAME_SUCCESS,
  GET_ARCADE_GAME_FAIL,
  ADD_IMPORTED_ARCADE_GAME_LOADING,
  ADD_IMPORTED_ARCADE_GAME_SUCCESS,
  ADD_IMPORTED_ARCADE_GAME_FAIL,
} from '../../types';
import { mergeDeep } from '../../../utils/utils';
import _ from 'lodash';
import store from '../..';
import { 
    defaultGameModel,
    gameGridHeight,
    gameGridWidth,
    initialStageId, 
    LAYER_DID, 
    layerGroupIIDtoName, 
    nodeSize, 
    PLAY_GAME_SCOPE_UNLISTED, 
    TEXTURE_DID, 
    UNDO_MEMORY_MAX } from '../../../game/constants';
import { changeCurrentStage, editGameModel } from './gameModelActions';
import { generateUniqueId, getImageUrlFromTextureId } from '../../../utils';
import { addCanvasImage, getCanvasImageByTextureId } from '../media/canvasImageActions';
import { IMAGE_TYPE_LAYER } from '../../../constants';
import { addAutogeneratedEntityModels, addDefaultsToGameModel, addImportedGamesToGameModel, cleanGameModel, enrichGameModel, generateActionEffect, generateActionEffects } from '../../../autogeneration/gameModel';
import { BACKGROUND_LAYER_GROUP_IID, DATA_SOURCE_AUTOGENERATED_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from '../../../constants/interfaceIds';

export function onArcadeGameModelUpdate(gameUpdate) {
  const state = store.getState()
  const oldGameData = _.cloneDeep(state.gameModel.gameModel)
  const stageId = state.gameRoomInstance.gameRoomInstance.currentStageId

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

  addAutogeneratedEntityModels(gameUpdate, oldGameData)
  addDefaultsToGameModel(gameUpdate, oldGameData) 
  const gameData = mergeDeep(oldGameData, gameUpdate)
  enrichGameModel(gameData)
  generateActionEffects(gameData)
  cleanGameModel(gameData)
  
  store.dispatch({
    type: ON_GAME_MODEL_UPDATE,
    payload: { gameModel: gameData },
  })


  window.events.emit(ON_GAME_MODEL_UPDATE, gameUpdate)
}

function onArcadeGameCharacterUpdate({ userMongoId, unlockedInterfaceIds }) {
  const me = store.getState().auth.me 
  const cobrowsing = store.getState().cobrowsing

  if(me.id === userMongoId || (cobrowsing.isSubscribedCobrowsing)) {  
    // needs to do update cobrowsing or else ur just locking ur own...
    store.dispatch({
      type: INITIALIZE_UNLOCKED_INTERFACE_IDS,
      updateCobrowsing: true,
      noCobrowsingToolNeeded: true,
      payload: {
        unlockedInterfaceIds: unlockedInterfaceIds
      }
    })
  }
}

export const updateArcadeGameCharacter = ({userMongoId, unlockedInterfaceIds, experienceModelMongoId, merge}) => async (dispatch, getState) => {
  // dispatch({
  //   type: GET_SPRITESHEET_DATA_LOADING,
  // });

  try {
    const state = store.getState()
    const gameRoomInstanceMongoId = state.gameRoomInstance?.gameRoomInstance?.id

    const options = attachTokenToHeaders(getState);
    const response = await axios.put('/api/arcadeGames/character', {
      experienceModelMongoId,
      gameRoomInstanceMongoId,
      userMongoId,
      unlockedInterfaceIds,
      merge
    }, options);

    return response

    // dispatch({
    //   type: GET_SPRITESHEET_DATA_SUCCESS,
    //   payload: { spritesByDescriptor, visualTagOptions },
    // });

  } catch(e) {
    console.error(e)
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

export const addImportedArcadeGame = (arcadeGameMongoId) => async (dispatch, getState) => {
  dispatch({
    type: ADD_IMPORTED_ARCADE_GAME_LOADING,
    payload: { },
  });
  try {
    const gameId = getState().gameModel.gameModel.id
    const options = attachTokenToHeaders(getState);
    const response = await axios.post(`/api/arcadeGames/${gameId}/importedArcadeGame`, {arcadeGameMongoId}, options);

    dispatch({
      type: ADD_IMPORTED_ARCADE_GAME_SUCCESS,
      payload: {  },
    });
  }
  catch (err) {
    console.error(err)

    dispatch({
      type: ADD_IMPORTED_ARCADE_GAME_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }


}

export async function loadArcadeGame(response) {

  console.log('raw game data', _.cloneDeep(response.data.game))
  const gameData = mergeDeep(_.cloneDeep(defaultGameModel), response.data.game)

  addImportedGamesToGameModel(gameData)
  addAutogeneratedEntityModels(gameData)
  addDefaultsToGameModel(gameData) 
  enrichGameModel(gameData)
  generateActionEffects(gameData)

  console.log('enriched game data', gameData)

  return gameData
}

export const loadArcadeGameByGameModelId = (gameModelId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_GAME_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames/gameModelId/' + gameModelId, options);

    window.socket.on(ON_GAME_MODEL_UPDATE, onArcadeGameModelUpdate)
    window.socket.on(ON_GAME_CHARACTER_UPDATE, onArcadeGameCharacterUpdate)

   const gameData = await loadArcadeGame(response, dispatch)
    dispatch(changeCurrentStage(gameData.player.startingStageId))

    dispatch({
      type: LOAD_GAME_MODEL_SUCCESS,
      payload: { gameModel: gameData },
    });
    
    return gameData
  } catch (err) {
    console.error(err)

    dispatch({
      type: LOAD_GAME_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const loadArcadeGameByMongoId = (arcadeGameMongoId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_GAME_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames/' + arcadeGameMongoId, options);

    window.socket.on(ON_GAME_MODEL_UPDATE, onArcadeGameModelUpdate)
    window.socket.on(ON_GAME_CHARACTER_UPDATE, onArcadeGameCharacterUpdate)

    const gameData = await loadArcadeGame(response, dispatch)
    dispatch(changeCurrentStage(gameData.player.startingStageId))

    dispatch({
      type: LOAD_GAME_MODEL_SUCCESS,
      payload: { gameModel: gameData },
    });
    

    return gameData
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

export async function addLayersForArcadeGameStage(arcadeGameMongoId, userMongoId, stageId) {
  const backgroundLayerId = LAYER_DID + generateUniqueId()
  const playgroundLayerId = LAYER_DID + generateUniqueId()
  const foregroundLayerId = LAYER_DID + generateUniqueId()

  const backgroundTextureId = TEXTURE_DID + generateUniqueId()
  const playgroundTextureId = TEXTURE_DID + generateUniqueId()
  const foregroundTextureId = TEXTURE_DID + generateUniqueId()

  const colors = {
    '#FFFFFF': {},
    '#000000': {},
    '#EE4035': {},
    '#F37736': {},
    '#FDF498': {},
    '#7BC043': {},
    '#0392CF': {}
  }
  const layerIds = [backgroundLayerId, playgroundLayerId, foregroundLayerId]
  layerIds.forEach((layerId) => {
    Object.keys(colors).forEach((colorId) => {
      colors[colorId][layerId] = 1
    })
  })

  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    imageUrl: getImageUrlFromTextureId(backgroundTextureId),
    imageData: {
      width: nodeSize * gameGridWidth,
      height: nodeSize * gameGridHeight,
    },
    textureId: backgroundTextureId, 
    userMongoId,
    visualTags: ['Layer'],
  }))

  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    imageData: {
      width: nodeSize * gameGridWidth,
      height: nodeSize * gameGridHeight,
    },
    imageUrl: getImageUrlFromTextureId(playgroundTextureId),
    textureId: playgroundTextureId, 
    userMongoId,
    visualTags: ['Layer'],
  }))

  await store.dispatch(addCanvasImage({
    imageType: IMAGE_TYPE_LAYER,
    imageData: {
      width: nodeSize * gameGridWidth,
      height: nodeSize * gameGridHeight,
    },
    imageUrl: getImageUrlFromTextureId(foregroundTextureId),
    textureId: foregroundTextureId,
    userMongoId,
    visualTags: ['Layer'],
  }))

  const layers = {
    [backgroundLayerId]: {
      textureId: backgroundTextureId,
      name: layerGroupIIDtoName[BACKGROUND_LAYER_GROUP_IID],
      stageId: stageId,
      layerId: backgroundLayerId,
      layerGroupIID: BACKGROUND_LAYER_GROUP_IID,
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID
    },
    [playgroundLayerId]: {
      textureId: playgroundTextureId,
      hasCollisionBody: true,
      stageId: stageId,
      layerGroupIID: PLAYGROUND_LAYER_GROUP_IID,
      layerId: playgroundLayerId,
      name: layerGroupIIDtoName[PLAYGROUND_LAYER_GROUP_IID],
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID
    },
    [foregroundLayerId]: {
      layerGroupIID: FOREGROUND_LAYER_GROUP_IID,
      textureId: foregroundTextureId,
      stageId: stageId,
      layerId: foregroundLayerId,
      name: layerGroupIIDtoName[FOREGROUND_LAYER_GROUP_IID],
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID
    }
  }

  const gameData = {
    layers,
    colors,
  }

  // so that it live updates
  const gameModelId = store.getState().gameModel.gameModel?.id
  if(gameModelId === arcadeGameMongoId) {
    await store.dispatch(editGameModel(gameData))
  } else {
    store.dispatch(editArcadeGame(arcadeGameMongoId, gameData)) 
  }

  return layers
}

export const addArcadeGame = (gameData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ARCADE_GAME_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/arcadeGames', gameData, options);

    const arcadeGameMongoId = response.data.game.id

    await addLayersForArcadeGameStage(arcadeGameMongoId, response.data.game.owner.id, initialStageId)

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

export const copyArcadeGameToUser = ({arcadeGameMongoId, userMongoId, gameDataUpdate = {}}) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ARCADE_GAME_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  const options = attachTokenToHeaders(getState);
  const response = await axios.post(`/api/arcadeGames/${arcadeGameMongoId}/copy`, {}, options);
  const gameData = response.data.game

  if(!gameDataUpdate.owner) gameDataUpdate.owner = userMongoId
  if(!gameDataUpdate.playScope) gameDataUpdate.playScope = PLAY_GAME_SCOPE_UNLISTED

  Object.keys(gameData.layers).forEach(async layerId => {
    const layer = gameData.layers[layerId]
    const textureId = TEXTURE_DID + generateUniqueId()

    // important that this is here because of async stuff
    const previousTextureId = layer.textureId
    layer.textureId = textureId

    const previousCanvasImage = await dispatch(getCanvasImageByTextureId(previousTextureId))
    dispatch(addCanvasImage({
      imageType: IMAGE_TYPE_LAYER,
      imageData: {
        width: nodeSize * gameGridWidth,
        height: nodeSize * gameGridHeight,
      },
      imageUrl: getImageUrlFromTextureId(textureId),
      initialTextureId: previousCanvasImage.initialTextureId || previousTextureId,
      textureId: textureId,
      userMongoId,
      visualTags: ['Layer'],
    }))
  })

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put('/api/arcadeGames/' + gameData.id, gameDataUpdate, options);

    // const arcadeGameMongoId = response.data.game.id

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