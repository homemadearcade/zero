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
} from '../types';
import { mergeDeep } from '../../utils/utils';
import _ from 'lodash';
import { defaultGameModel } from '../../game/defaultData/gameModel';
import { defaultObjectInstance } from '../../game/defaultData/object';
import { defaultClass } from '../../game/defaultData/class';
import store from '..';
import {  BRUSH_ID_PREFIX, COMMON_BRUSH_ID, UNDO_MEMORY_MAX } from '../../game/constants';
import { changeCurrentStage } from './gameModelActions';
import { defaultStage } from '../../game/defaultData/stage';

function onArcadeGameCharacterUpdate({ id, data }) {
  const me = store.getState().auth.me 
  const cobrowsing = store.getState().cobrowsing

  if(me.id === id || (cobrowsing.isSubscribedCobrowsing)) {  
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
    const lobbyId = state.lobby.lobby?.id 

    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/arcadeGames/character', {
      lobbyId,
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

function onArcadeGameModelUpdate(gameUpdate) {
  const state = store.getState()
  const oldGameData = _.cloneDeep(state.gameModel.gameModel)
  const stageId = state.gameModel.currentStageId

  if(!window.nextGameModelUpdateIsUndo) {
    if(gameUpdate.stages) {
      const stage = gameUpdate.stages[stageId]
      if(stage) {
        const objects = stage.objects 
        const oldObjects = oldGameData.stages[stageId].objects
        if(objects) {
          window.instanceUndoStack.push(...Object.keys(objects).map((id) => {
            return {
              objectInstanceStageId: stageId,
              objectInstanceId: id,
              data: _.cloneDeep(oldObjects[id])
            }
          }))
        }
      }
    }

    window.instanceUndoStack = window.instanceUndoStack.slice(-UNDO_MEMORY_MAX)
  }

  window.nextGameModelUpdateIsUndo = false
  if(gameUpdate.stages) {
    const stage = gameUpdate.stages[stageId]
    if(stage) {
      const objects = stage.objects 
      const oldObjects = oldGameData.stages[stageId].objects
      if(objects) Object.keys(objects).forEach((id) => {
        if(!oldObjects[id]) objects[id] = mergeDeep(_.cloneDeep(defaultObjectInstance), objects[id])
      })
    }
  }

  if(gameUpdate.classes) Object.keys(gameUpdate.classes).forEach((id) => {
    if(!oldGameData.classes[id]) gameUpdate.classes[id] = mergeDeep(_.cloneDeep(defaultClass), gameUpdate.classes[id])
  })
  
  const gameData = mergeDeep(oldGameData, gameUpdate)
  Object.keys(gameData.classes).forEach((id) => {
    const objectClass = gameData.classes[id]
    
    if(objectClass.graphics.textureId) {
      gameData.brushes[BRUSH_ID_PREFIX + objectClass.classId] = {
        canvasId: COMMON_BRUSH_ID,
        textureId: objectClass.graphics.textureId,
        tint: objectClass.graphics.tint
      }
    }
  })

  Object.keys(gameData.stages).forEach((stageId) => {
    const stage = gameData.stages[stageId]
    gameData.stages[stageId] = mergeDeep(_.cloneDeep(defaultStage), gameData.stages[stageId])
    if (gameData.stages[stageId] === null || gameData.stages[stageId] === undefined) {
      console.log('deleting stage', stageId)
      delete gameData.stages[stageId];
    }

    // the default stage doesnt start with objects because its virtual so gotta check
    if(stage.objects) Object.keys(stage.objects).forEach(key => {
      if (stage.objects[key] === null || stage.objects[key] === undefined) {
        console.log('deleting object', key)
        delete stage.objects[key];
      }
    });
  })

  Object.keys(gameData.cutscenes).forEach(key => {
    if (gameData.cutscenes[key] === null || gameData.cutscenes[key] === undefined) {
      console.log('deleting cutscene', key)
      delete gameData.cutscenes[key];
    }
  });

  Object.keys(gameData.classes).forEach(key => {
    if (gameData.classes[key] === null || gameData.classes[key] === undefined) {
      console.log('deleting class', key)
      delete gameData.classes[key];
      return
    }
  });

  Object.keys(gameData.relations).forEach(key => {
    if (gameData.relations[key] === null || gameData.relations[key] === undefined) {
      console.log('deleting relation', key)
      delete gameData.relations[key];
    }
  });
  
  store.dispatch({
    type: ON_GAME_MODEL_UPDATE,
    payload: { gameModel: gameData },
  });
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

export const loadArcadeGame = (gameId) => async (dispatch, getState) => {
  dispatch({
    type: LOAD_GAME_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/arcadeGames/' + gameId, options);

    window.socket.on(ON_GAME_MODEL_UPDATE, onArcadeGameModelUpdate)
    window.socket.on(ON_GAME_CHARACTER_UPDATE, onArcadeGameCharacterUpdate)

    const gameData = mergeDeep(_.cloneDeep(defaultGameModel), response.data.game)

    dispatch(changeCurrentStage(gameData.player.startingStageId))
    
    const stages = Object.keys(gameData.stages).map((stageId) => {
      gameData.stages[stageId] = mergeDeep(_.cloneDeep(defaultStage), gameData.stages[stageId])
      return gameData.stages[stageId]
    })

    stages.forEach(({objects}) => {
      Object.keys(objects).forEach((id) => {
        objects[id] = mergeDeep(_.cloneDeep(defaultObjectInstance), objects[id])
      })
    })
    Object.keys(gameData.classes).forEach((id) => {
      gameData.classes[id] = mergeDeep(_.cloneDeep(defaultClass), gameData.classes[id])
      
      const objectClass = gameData.classes[id]
      
      if(objectClass.graphics.textureId) {
        gameData.brushes[BRUSH_ID_PREFIX + objectClass.classId] = {
          canvasId: COMMON_BRUSH_ID,
          textureId: objectClass.graphics.textureId,
          tint: objectClass.graphics.tint
        }
      }
    })

    // Object.keys(gameData.brushes).forEach((id) => {

    // })

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

export const addArcadeGame = (gameData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_ARCADE_GAME_LOADING,
    payload: { me: { ...getState().auth.me } },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/arcadeGames', gameData, options);

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

export const copyArcadeGameToUser = ({gameId, userId, isArchival}) => async (dispatch, getState) => {
  const options = attachTokenToHeaders(getState);
  const response = await axios.get('/api/arcadeGames/' + gameId, options);
  const gameData = response.data.game
  gameData.user = null
  gameData.metadata.isArchival = isArchival
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