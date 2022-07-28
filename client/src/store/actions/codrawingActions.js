import axios from 'axios';
import { attachTokenToHeaders } from './authActions';

import {
  CODRAWING_STROKE_FAILED,
  SUBSCRIBE_CODRAWING_LOADING,
  SUBSCRIBE_CODRAWING_SUCCESS,
  SUBSCRIBE_CODRAWING_FAIL,
  // UNSUBSCRIBE_CODRAWING_LOADING,
  UNSUBSCRIBE_CODRAWING_SUCCESS,
  UNSUBSCRIBE_CODRAWING_FAIL,
  // ON_CODRAWING_STROKE,
} from '../types';

export const publishCodrawingStrokes = ({canvasId, brushId, stroke}) => async (dispatch, getState) => {
  try {
    // dispatch({
    //   type: ON_CODRAWING_STROKE,
    //   payload: { canvasId, strokeData },
    // });    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/codrawing/stroke/' + canvasId, { brushId, stroke }, options);
  } catch (err) {
    console.error(err)

    dispatch({
      type: CODRAWING_STROKE_FAILED,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeCodrawing = (canvasId) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_CODRAWING_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/codrawing/' + canvasId, {}, options);

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

export const unsubscribeCodrawing = (canvasId) => async (dispatch, getState) => {
  // dispatch({
  //   type: UNSUBSCRIBE_CODRAWING_LOADING,
  // });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/codrawing/stop/' + canvasId, {}, options);

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