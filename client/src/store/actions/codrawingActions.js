import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

import {
  CODRAWING_STROKE_FAILED,
  SUBSCRIBE_CODRAWING_LOADING,
  SUBSCRIBE_CODRAWING_SUCCESS,
  SUBSCRIBE_CODRAWING_FAIL,
  UNSUBSCRIBE_CODRAWING_LOADING,
  UNSUBSCRIBE_CODRAWING_SUCCESS,
  UNSUBSCRIBE_CODRAWING_FAIL,
  ON_CODRAWING_STROKE,
} from '../types';

export const strokeCodrawing = (strokeData) => async (dispatch, getState) => {
  try {
    const userId = getState().codrawing.codrawingCanvasId.id

    dispatch({
      type: ON_CODRAWING_STROKE,
      payload: { strokeData },
    });
    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/codrawing/stroke' + userId, { strokeData }, options);
  } catch (err) {
    console.error(err)

    dispatch({
      type: CODRAWING_STROKE_FAILED,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeCodrawing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_CODRAWING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/codrawing/' + userId, {}, options);

    dispatch({
      type: SUBSCRIBE_CODRAWING_SUCCESS,
      payload: { codrawingCanvasId: response.data.codrawingCanvasId },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SUBSCRIBE_CODRAWING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unsubscribeCodrawing = ({userId}) => async (dispatch, getState) => {
  dispatch({
    type: UNSUBSCRIBE_CODRAWING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/codrawing/stop/' + userId, {}, options);
    
    dispatch({
      type: UNSUBSCRIBE_CODRAWING_SUCCESS,
      payload: { },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: UNSUBSCRIBE_CODRAWING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};