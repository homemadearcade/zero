import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
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
} from '../types';
import { mergeDeep } from '../../utils';
import _ from 'lodash';
import { ACTIVITY_ID_PREFIX, CREDITS_ACTIVITY, defaultActivity, defaultGuideRoleId, defaultInstructions, defaultLobby, INSTRUCTION_ID_PREFIX, INSTRUCTION_LOBBY, VIDEO_ACTIVITY, WAITING_ACTIVITY } from '../../constants';
import { defaultExperienceModel } from '../../constants';

function addDefaultsToExperienceModel(experienceModel) {
  if(experienceModel.lobbys) {
    Object.keys(experienceModel.lobbys).forEach((id) => {
      const presetLobby = _.cloneDeep(experienceModel.lobbys[id])
      const waitingRoomId = ACTIVITY_ID_PREFIX+'_waiting'+id
      presetLobby.activitys[waitingRoomId] = {
        activityId: waitingRoomId,
      }

      if(!presetLobby.initialActivityId) presetLobby.initialActivityId = waitingRoomId
      experienceModel.activitys[waitingRoomId] = {
        activityId: waitingRoomId,
        activityCategory: WAITING_ACTIVITY,
        name: `${presetLobby.name} Waiting Room`,
      }

      const videoRoomId = ACTIVITY_ID_PREFIX+'_video'+id
      presetLobby.activitys[videoRoomId] = {
        activityId: videoRoomId,
      }
      experienceModel.activitys[videoRoomId] = {
        activityId: videoRoomId,
        activityCategory: VIDEO_ACTIVITY,
        name: `${presetLobby.name} Video Room`,
      }



      const creditsRoomId = ACTIVITY_ID_PREFIX+'_credits'+id
      presetLobby.activitys[creditsRoomId] = {
        activityId: creditsRoomId,
      }
      experienceModel.activitys[creditsRoomId] = {
        activityId: creditsRoomId,
        activityCategory: CREDITS_ACTIVITY,
        name: `${presetLobby.name} Credits`,
      }

      const lobbyInstructionsId = INSTRUCTION_ID_PREFIX+id
      experienceModel.instructions[lobbyInstructionsId] = {
        instructionId: lobbyInstructionsId,
        instructionCategory: INSTRUCTION_LOBBY,
        name: `${presetLobby.name} Instructions`,
        description: 'Instructions for the lobby',
      }

      presetLobby.roleInstructionByRoleId = {
        [defaultGuideRoleId]: lobbyInstructionsId
      }

      experienceModel.lobbys[id] = mergeDeep(_.cloneDeep(defaultLobby), presetLobby, experienceModel.lobbys[id])
    })
  }

  if(experienceModel.instructions) {
    Object.keys(experienceModel.instructions).forEach((id) => {
      experienceModel.instructions[id] = mergeDeep(_.cloneDeep(defaultInstructions), experienceModel.instructions[id])
    })
  }

  if(experienceModel.activitys) {
    Object.keys(experienceModel.activitys).forEach((id) => {
      experienceModel.activitys[id] = mergeDeep(_.cloneDeep(defaultActivity), experienceModel.activitys[id])
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
    const response = await axios.get('/api/experienceModel/' + experienceModelId, options);

    const experienceModel = mergeDeep(defaultExperienceModel, response.data.experienceModel)
    // addLibraryToExperience(experienceModel)
    addDefaultsToExperienceModel(experienceModel) 
    enrichExperienceModel(experienceModel)

    console.log('fully enriched', experienceModel)

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

export const editExperienceModel = (id, experienceModelData) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EXPERIENCE_MODEL_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/experienceModel/${id}`, experienceModelData, options);

    const experienceModel = mergeDeep(defaultExperienceModel, response.data.experienceModel)
    // addLibraryToExperience(experienceModel)
    addDefaultsToExperienceModel(experienceModel) 
    enrichExperienceModel(experienceModel)

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