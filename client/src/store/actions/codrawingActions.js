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
  CODRAWING_UNDO_LOADING,
  CODRAWING_UNDO_SUCCESS,
  CODRAWING_UNDO_FAIL,
  // ON_CODRAWING_STROKE,
} from '../types';
import { getCurrentGameScene } from '../../utils/editorUtils';
import store from '..';

export function saveAllCurrentCanvases() {
  const state = store.getState()
  const scene = getCurrentGameScene(state.webPage.gameInstance)
  if(scene.backgroundLayer.unsavedChanges) scene.backgroundLayer.save()
  if(scene.playgroundLayer.unsavedChanges) scene.playgroundLayer.save()
  if(scene.foregroundLayer.unsavedChanges) scene.foregroundLayer.save()
}

export const publishCodrawingStrokes = ({canvasId, brushId, stroke}) => async (dispatch, getState) => {
  try {
    // dispatch({
    //   type: ON_CODRAWING_STROKE,
    //   payload: { canvasId, strokeData },
    // });    
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/codrawing/stroke/' + encodeURIComponent(canvasId), { brushId, stroke }, options);
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
    const response = await axios.post('/api/codrawing/' + encodeURIComponent(canvasId), {}, options);
    
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
    await axios.post('/api/codrawing/stop/' + encodeURIComponent(canvasId), {}, options);

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

export const codrawingUndo = (canvasId) => async (dispatch, getState) => {
  dispatch({
    type: CODRAWING_UNDO_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/codrawing/undo/' + encodeURIComponent(canvasId), options);

    dispatch({
      type: CODRAWING_UNDO_SUCCESS,
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: CODRAWING_UNDO_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
