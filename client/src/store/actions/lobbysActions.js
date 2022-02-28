import axios from 'axios';
import { attachTokenToHeaders } from './authActions';
import { 
  ADD_LOBBY_LOADING,
  ADD_LOBBY_SUCCESS,
  ADD_LOBBY_FAIL,
  GET_LOBBYS_LOADING,
  GET_LOBBYS_SUCCESS,
  GET_LOBBYS_FAIL 
} from '../types';

export const addLobby = (formData) => async (dispatch, getState) => {
  dispatch({
    type: ADD_LOBBY_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/lobbys', formData, options);

    dispatch({
      type: ADD_LOBBY_SUCCESS,
      payload: { lobby: response.data.lobby },
    });
  } catch (err) {
    dispatch({
      type: ADD_LOBBY_FAIL,
      payload: { error: err?.response?.data.lobby || err.lobby },
    });
  }
};

export const getLobbys = () => async (dispatch, getState) => {
  dispatch({
    type: GET_LOBBYS_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/lobbys', options);

    dispatch({
      type: GET_LOBBYS_SUCCESS,
      payload: { lobbys: response.data.lobbys },
    });
  } catch (err) {
    dispatch({
      type: GET_LOBBYS_FAIL,
      payload: err.message,
    });
  }
};
