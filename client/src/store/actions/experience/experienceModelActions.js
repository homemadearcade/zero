import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_EXPERIENCE_MODELS_LOADING,
  GET_EXPERIENCE_MODELS_SUCCESS,
  GET_EXPERIENCE_MODELS_FAIL,
  GET_EXPERIENCE_MODEL_LOADING,
  GET_EXPERIENCE_MODEL_SUCCESS,
  GET_EXPERIENCE_MODEL_FAIL,
  ADD_EXPERIENCE_MODEL_LOADING,
  ADD_EXPERIENCE_MODEL_SUCCESS,
  ADD_EXPERIENCE_MODEL_FAIL,
  DELETE_EXPERIENCE_MODEL_LOADING,
  DELETE_EXPERIENCE_MODEL_SUCCESS,
  DELETE_EXPERIENCE_MODEL_FAIL,
  EDIT_EXPERIENCE_MODEL_LOADING,
  EDIT_EXPERIENCE_MODEL_SUCCESS,
  EDIT_EXPERIENCE_MODEL_FAIL,
  CLEAR_EXPERIENCE_MODEL,
} from '../../types';
import {  mergeDeep } from '../../../utils';
import _ from 'lodash';
import { activityToInterfaceData, ACTIVITY_DID, CREDITS_ACTIVITY, defaultActivity, 
  defaultGuideRoleId, defaultInstructions, defaultLobby, defaultStep,
   GAME_ROOM_ACTIVITY, INSTRUCTION_GAME_ROOM, INSTRUCTION_DID, INSTRUCTION_LOBBY, VIDEO_ACTIVITY, WAITING_ROOM } from '../../../constants';
import { defaultExperienceModel } from '../../../constants';
import { defaultGameRoom } from '../../../constants/experience/gameRoom';

function addDefaultsToExperienceModel(experienceModel) {
  if(experienceModel.lobbys) {
  
    Object.keys(experienceModel.lobbys).forEach((id) => {
      const presetLobby =  mergeDeep(_.cloneDeep(defaultLobby), _.cloneDeep(experienceModel.lobbys[id]))
      const waitingRoomId = ACTIVITY_DID+'_waiting'+id
      presetLobby.activitys[waitingRoomId] = {
        activityId: waitingRoomId,
      }

      if(!presetLobby.initialActivityId) presetLobby.initialActivityId = waitingRoomId
       const presetWaitingRoom = {
        activityId: waitingRoomId,
        activityCategory: WAITING_ROOM,
        initialViewCategory: activityToInterfaceData[WAITING_ROOM].initialViewCategory,
        name: `Waiting Room`,
        isNotRemoveable: true,
        isRemoved: presetLobby.isRemoved
      }
      if(!experienceModel.activitys[waitingRoomId]) experienceModel.activitys[waitingRoomId] = presetWaitingRoom
      else experienceModel.activitys[waitingRoomId] = mergeDeep(presetWaitingRoom, experienceModel.activitys[waitingRoomId])
      
      const videoRoomId = ACTIVITY_DID+'_video'+id
      presetLobby.activitys[videoRoomId] = {
        activityId: videoRoomId,
      }
      const presetVideoRoom  = {
        activityId: videoRoomId,
        activityCategory: VIDEO_ACTIVITY,
        name: `Video Room`,
        initialViewCategory: activityToInterfaceData[VIDEO_ACTIVITY].initialViewCategory,
        isNotRemoveable: true,
        isRemoved: presetLobby.isRemoved
      }
      if(!experienceModel.activitys[videoRoomId]) experienceModel.activitys[videoRoomId] = presetVideoRoom
      else experienceModel.activitys[videoRoomId] = mergeDeep(presetVideoRoom, experienceModel.activitys[videoRoomId])

      const creditsRoomId = ACTIVITY_DID+'_credits'+id
      presetLobby.activitys[creditsRoomId] = {
        activityId: creditsRoomId,
      }
      const presetCredits = {
        activityId: creditsRoomId,
        activityCategory: CREDITS_ACTIVITY,
        initialViewCategory: activityToInterfaceData[CREDITS_ACTIVITY].initialViewCategory,
        name: `Credits`,
        isNotRemoveable: true,
        isRemoved: presetLobby.isRemoved
      }
      if(!experienceModel.activitys[creditsRoomId]) experienceModel.activitys[creditsRoomId] = presetCredits
      else experienceModel.activitys[creditsRoomId] = mergeDeep(presetCredits, experienceModel.activitys[creditsRoomId])

      const lobbyInstructionsId = INSTRUCTION_DID+id
      const presetLobbyInstruction = {
        instructionId: lobbyInstructionsId,
        instructionCategory: INSTRUCTION_LOBBY,
        name: `${presetLobby.name} Guide Instructions`,
        description: 'Instructions for the lobby',
        // isNotRemoveable: true,
        isRemoved: presetLobby.isRemoved
      }
      if(!experienceModel.instructions[lobbyInstructionsId]) experienceModel.instructions[lobbyInstructionsId] = presetLobbyInstruction
      else experienceModel.instructions[lobbyInstructionsId] = mergeDeep(presetLobbyInstruction, experienceModel.instructions[lobbyInstructionsId])

      presetLobby.instructionsByRoleId = {
        [defaultGuideRoleId]: lobbyInstructionsId
      }

      experienceModel.lobbys[id] = mergeDeep(presetLobby, experienceModel.lobbys[id])
    })
  }

  if(experienceModel.activitys) {
    Object.keys(experienceModel.activitys).forEach((id) => {
      const presetActivity =  mergeDeep(_.cloneDeep(defaultActivity), _.cloneDeep(experienceModel.activitys[id]))

      if(presetActivity.activityCategory === GAME_ROOM_ACTIVITY) {
        const gameRoomInstructionsId = INSTRUCTION_DID+presetActivity.activityId
        const presetInstructions = {
          instructionId: gameRoomInstructionsId,
          instructionCategory: INSTRUCTION_GAME_ROOM,
          name: `${presetActivity.name} Guide Instructions`,
          activityId: id,
          arcadeGameMongoId: presetActivity.gameRoom.arcadeGameMongoId,
        }
        
        if(!experienceModel.instructions[gameRoomInstructionsId]) experienceModel.instructions[gameRoomInstructionsId] = presetInstructions
        else experienceModel.instructions[gameRoomInstructionsId] = mergeDeep(presetInstructions, experienceModel.instructions[gameRoomInstructionsId])

        if(!presetActivity.instructionsByRoleId) { 
          presetActivity.instructionsByRoleId = {}
        }

        presetActivity.instructionsByRoleId[defaultGuideRoleId] = gameRoomInstructionsId
      }

      experienceModel.activitys[id] = mergeDeep(presetActivity, experienceModel.activitys[id])
    })
  }

  if(experienceModel.instructions) {
    Object.keys(experienceModel.instructions).forEach((id) => {
      experienceModel.instructions[id] = mergeDeep(_.cloneDeep(defaultInstructions), experienceModel.instructions[id])
      const steps = experienceModel.instructions[id].steps
      Object.keys(steps).forEach((stepId) => {
        steps[stepId] = mergeDeep(_.cloneDeep(defaultStep), steps[stepId])
      })
    })
  }

  if(experienceModel.gameRooms) {
    Object.keys(experienceModel.gameRooms).forEach((id) => {
      experienceModel.gameRooms[id] = mergeDeep(_.cloneDeep(defaultGameRoom), experienceModel.gameRooms[id])
    })

  }
}

function enrichExperienceModel(experienceModel) {

}

function cleanExperienceModel(experienceModel) {
  Object.keys(experienceModel.lobbys).forEach(key => {
    if (experienceModel.lobbys[key] === null || experienceModel.lobbys[key] === undefined) {
      console.log('deleting lobby', key)
      delete experienceModel.lobbys[key];
    }
  });

  Object.keys(experienceModel.roles).forEach(key => {
    if (experienceModel.roles[key] === null || experienceModel.roles[key] === undefined) {
      console.log('deleting lobby', key)
      delete experienceModel.roles[key];
    }
  });

  Object.keys(experienceModel.activitys).forEach(key => {
    if (experienceModel.activitys[key] === null || experienceModel.activitys[key] === undefined) {
      console.log('deleting lobby', key)
      delete experienceModel.activitys[key];
    }
  });

  Object.keys(experienceModel.instructions).forEach(key => {
    if (experienceModel.instructions[key] === null || experienceModel.instructions[key] === undefined) {
      console.log('deleting lobby', key)
      delete experienceModel.instructions[key];
    }
  });
}

export const getExperienceModels = () => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCE_MODELS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experienceModel', options);

    dispatch({
      type: GET_EXPERIENCE_MODELS_SUCCESS,
      payload: { experienceModels: response.data.experienceModels },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCE_MODELS_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getExperienceModelById = (experienceModelId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCE_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experienceModel/experienceModelId/' + experienceModelId, options);

    const experienceModel = await loadExperienceModel(response)

    dispatch({
      type: GET_EXPERIENCE_MODEL_SUCCESS,
      payload: { experienceModel: experienceModel },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCE_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getExperienceModelByMongoId = (experienceModelMongoId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCE_MODEL_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experienceModel/' + experienceModelMongoId, options);

    const experienceModel = await loadExperienceModel(response)

    dispatch({
      type: GET_EXPERIENCE_MODEL_SUCCESS,
      payload: { experienceModel: experienceModel },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCE_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addExperienceModel = (experienceModel) => async (dispatch, getState) => {
  dispatch({
    type: ADD_EXPERIENCE_MODEL_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/experienceModel', experienceModel, options);

    dispatch({
      type: ADD_EXPERIENCE_MODEL_SUCCESS,
      payload: { experienceModel: response.data.experienceModel },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_EXPERIENCE_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteExperienceModel = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_EXPERIENCE_MODEL_LOADING,
    payload: { id },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/experienceModel/${id}`, options);

    dispatch({
      type: DELETE_EXPERIENCE_MODEL_SUCCESS,
      payload: { experienceModel: response.data.experienceModel },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_EXPERIENCE_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};


export async function loadExperienceModel(response) {
  console.log('raw experience model', response.data.experienceModel)
  const experienceModel = mergeDeep(_.cloneDeep(defaultExperienceModel), response.data.experienceModel)
  // addLibraryToExperience(experienceModel)
  
  addDefaultsToExperienceModel(experienceModel) 
  enrichExperienceModel(experienceModel)
  console.log('enriched experience model', experienceModel)

  // const gameRoomIds = Object.keys(experienceModel.gameRooms)
  // for(let i = 0; i < gameRoomIds.length; i++) {
  //   const gameRoomId = gameRoomIds[i]
  //   const gameRoom = experienceModel.gameRooms[gameRoomId]
  //   const options = attachTokenToHeaders(store.getState);
  //   const response = await axios.get('/api/arcadeGames/' + gameRoom.arcadeGameMongoId, options);
  //   const gameData = await loadArcadeGame(response)
  //   addGameEffectsToExperienceModel(gameData, experienceModel)
  //   console.log('game effects added', experienceModel)
  // }

  return experienceModel
}

export const editExperienceModel = (id, experienceModelData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EXPERIENCE_MODEL_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/experienceModel/${id}`, experienceModelData, options);

    const experienceModel =  await loadExperienceModel(response)

    dispatch({
      type: EDIT_EXPERIENCE_MODEL_SUCCESS,
      payload: { experienceModel: experienceModel },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_EXPERIENCE_MODEL_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};

export const clearExperienceModel = () =>  (dispatch, getState) => {
  dispatch({
    type: CLEAR_EXPERIENCE_MODEL,
  });

}