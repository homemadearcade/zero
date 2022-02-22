import axios from 'axios';
import { attachTokenToHeaders } from './authActions';
import { GET_LOBBYS_LOADING, GET_LOBBYS_SUCCESS, GET_LOBBYS_FAIL } from '../types';

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
