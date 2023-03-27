import axios from 'axios';

import { attachTokenToHeaders } from './authActions';
import {
  GET_EXPERIENCES_LOADING,
  GET_EXPERIENCES_SUCCESS,
  GET_EXPERIENCES_FAIL,
  GET_EXPERIENCE_LOADING,
  GET_EXPERIENCE_SUCCESS,
  GET_EXPERIENCE_FAIL,
  ADD_EXPERIENCE_LOADING,
  ADD_EXPERIENCE_SUCCESS,
  ADD_EXPERIENCE_FAIL,
  DELETE_EXPERIENCE_LOADING,
  DELETE_EXPERIENCE_SUCCESS,
  DELETE_EXPERIENCE_FAIL,
  EDIT_EXPERIENCE_LOADING,
  EDIT_EXPERIENCE_SUCCESS,
  EDIT_EXPERIENCE_FAIL,
} from '../types';
import { mergeDeep } from '../../utils';
import _ from 'lodash';
import { defaultActivity, defaultInstructions, defaultLobby } from '../../constants';
import { defaultExperience } from '../../constants/experience/experience';

function addDefaultsToExperience(experience) {
  if(experience.lobbys) {
    Object.keys(experience.lobbys).forEach((id) => {
      experience.lobbys[id] = mergeDeep(_.cloneDeep(defaultLobby), experience.lobbys[id])
    })
  }

  if(experience.instructions) {
    Object.keys(experience.instructions).forEach((id) => {
      experience.instructions[id] = mergeDeep(_.cloneDeep(defaultInstructions), experience.instructions[id])
    })
  }

  if(experience.activitys) {
    Object.keys(experience.activitys).forEach((id) => {
      experience.activitys[id] = mergeDeep(_.cloneDeep(defaultActivity), experience.activitys[id])
    })
  }
}

function enrichExperience(experience) {
  
}

function cleanExperience(experience) {
  Object.keys(experience.lobbys).forEach(key => {
    if (experience.lobbys[key] === null || experience.lobbys[key] === undefined) {
      console.log('deleting lobby', key)
      delete experience.lobbys[key];
    }
  });

  Object.keys(experience.roles).forEach(key => {
    if (experience.roles[key] === null || experience.roles[key] === undefined) {
      console.log('deleting lobby', key)
      delete experience.roles[key];
    }
  });

  Object.keys(experience.activitys).forEach(key => {
    if (experience.activitys[key] === null || experience.activitys[key] === undefined) {
      console.log('deleting lobby', key)
      delete experience.activitys[key];
    }
  });

  Object.keys(experience.instructions).forEach(key => {
    if (experience.instructions[key] === null || experience.instructions[key] === undefined) {
      console.log('deleting lobby', key)
      delete experience.instructions[key];
    }
  });
}

export const getExperiences = () => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCES_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experiences', options);

    dispatch({
      type: GET_EXPERIENCES_SUCCESS,
      payload: { experiences: response.data.experiences },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getExperienceById = (experienceId) => async (dispatch, getState) => {
  dispatch({
    type: GET_EXPERIENCE_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/experiences/' + experienceId, options);

    const experience = mergeDeep(defaultExperience, response.data.experience)
    // addLibraryToExperience(experience)
    addDefaultsToExperience(experience) 
    enrichExperience(experience)

    console.log('fully enriched', experience)

    dispatch({
      type: GET_EXPERIENCE_SUCCESS,
      payload: { experience: experience },
    });
    
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addExperience = (experience) => async (dispatch, getState) => {
  dispatch({
    type: ADD_EXPERIENCE_LOADING,
    payload: { me: { ...getState().auth.me } },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/experiences', experience, options);

    dispatch({
      type: ADD_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });

    return response
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteExperience = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_EXPERIENCE_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/experiences/${id}`, options);

    dispatch({
      type: DELETE_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editExperience = (id, experience) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_EXPERIENCE_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/experiences/${id}`,experience, options);

    dispatch({
      type: EDIT_EXPERIENCE_SUCCESS,
      payload: { experience: response.data.experience },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_EXPERIENCE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};