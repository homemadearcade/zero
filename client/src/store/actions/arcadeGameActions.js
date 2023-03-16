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
import { defaultClassTag, defaultGameModel, initialTags } from '../../game/constants';
import { defaultObjectInstance } from '../../game/constants';
import { defaultClass, libraryClassAugment } from '../../game/constants';
import store from '..';
import {  BRUSH_ID_PREFIX, NON_LAYER_BRUSH_ID, UNDO_MEMORY_MAX } from '../../game/constants';
import { changeCurrentStage } from './gameModelActions';
import { defaultStage } from '../../game/constants';
import { classLibrary } from '../../game/classLibrary';

function addDefaultsToGameModel(gameData, oldGameData) {
  if(oldGameData) {
    if(gameData.stages) {
      Object.keys(gameData.stages).forEach((stageId) => {
        const stage = gameData.stages[stageId]
        if(stage && oldGameData.stages[stageId]) {
          const objects = stage.objects 
          const oldObjects = oldGameData.stages[stageId].objects
          if(objects) Object.keys(objects).forEach((id) => {
            if(!oldObjects[id]) objects[id] = mergeDeep(_.cloneDeep(defaultObjectInstance), objects[id])
          })
        }
      })
    }

    if(gameData.classes) Object.keys(gameData.classes).forEach((id) => {
      if(!oldGameData.classes[id]) gameData.classes[id] = mergeDeep(_.cloneDeep(defaultClass), gameData.classes[id])
    })

    return 
  }

  if(gameData.classes) {
    Object.keys(gameData.classes).forEach((id) => {
      gameData.classes[id] = mergeDeep(_.cloneDeep(defaultClass), gameData.classes[id])
    })
  }

  if(gameData.stages) {
    Object.keys(gameData.stages).forEach((stageId) => {
      const stage = gameData.stages[stageId]
      gameData.stages[stageId] = mergeDeep(_.cloneDeep(defaultStage), gameData.stages[stageId])
      const objects = stage.objects 
      if(objects) Object.keys(objects).forEach((id) => {
        objects[id] = mergeDeep(_.cloneDeep(defaultObjectInstance), objects[id])
      })
    })
  }
}

function addLibraryToGameModel(gameData) {
  classLibrary.forEach((libraryObjectClass) => {
    if(!gameData.classes[libraryObjectClass.classId]) {
      gameData.classes[libraryObjectClass.classId] = mergeDeep(_.cloneDeep(libraryObjectClass), _.cloneDeep(libraryClassAugment))
    } else {
      gameData.classes[libraryObjectClass.classId] = mergeDeep(_.cloneDeep(libraryObjectClass), _.cloneDeep(libraryClassAugment), gameData.classes[libraryObjectClass.classId])
    }
  })

  gameData.tags = {
    ..._.cloneDeep(initialTags),
    ...gameData.tags
  }
}

function enrichGameModel(gameData) {
  if(!gameData.brushes) gameData.brushes = {}
  if(!gameData.tags) gameData.tags = {}

  Object.keys(gameData.classes).forEach((id) => {
    const objectClass = gameData.classes[id]
    
    if(objectClass.graphics.textureId) {
      gameData.brushes[BRUSH_ID_PREFIX + objectClass.classId] = {
        canvasId: NON_LAYER_BRUSH_ID,
        textureId: objectClass.graphics.textureId,
        tint: objectClass.graphics.tint
      }
    }

    gameData.tags[objectClass.classId] = {
      ...defaultClassTag,
      textureId: objectClass.graphics.textureId,
      interfaceLocked: objectClass.interfaceLocked,
      color: objectClass.graphics.tint,
      tagId: objectClass.classId,
      isRemoved: objectClass.isRemoved,
      name: objectClass.name,
    }
  })
}

function cleanGameModel(gameData) {
  Object.keys(gameData.stages).forEach((stageId) => {
    const stage = gameData.stages[stageId]
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

  Object.keys(gameData.collisions).forEach(key => {
    if (gameData.collisions[key] === null || gameData.collisions[key] === undefined) {
      console.log('deleting collision', key)
      delete gameData.collisions[key];
    }
  });


  Object.keys(gameData.effects).forEach(key => {
    if (gameData.effects[key] === null || gameData.effects[key] === undefined) {
      console.log('deleting effect', key)
      delete gameData.effects[key];
    }
  });

  Object.keys(gameData.events).forEach(key => {
    if (gameData.events[key] === null || gameData.events[key] === undefined) {
      console.log('deleting event', key)
      delete gameData.events[key];
    }
  });
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
    const response = await axios.post('/api/arcadeGames/character', {
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

export function onArcadeGameModelUpdate(gameUpdate) {
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


    console.log(gameData)
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