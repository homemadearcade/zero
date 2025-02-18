import axios from 'axios';
import { attachTokenToHeaders } from '../user/authActions';

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
} from '../../types';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import store from '../..';

export function saveAllCurrentCanvases() {
  const state = store.getState()
  const scene = getCurrentGameScene(state.webPage.gameInstance)
  if(!scene) return
  Object.keys(scene.layerInstancesById).forEach((layerId) => {
    const layerInstance = scene.layerInstancesById[layerId]
    if(layerInstance.unsavedChanges) layerInstance.save()
  })
}

export const publishCodrawingStrokes = ({textureId, brushId, stroke, strokeId, operationType}) => async (dispatch, getState) => {
  try {
    // dispatch({
    //   type: ON_CODRAWING_STROKE,
    //   payload: { textureId, strokeData },
    // });
    const options = attachTokenToHeaders(getState);
    await axios.put('/api/codrawing/stroke/' + encodeURIComponent(textureId), { brushId, stroke, strokeId, operationType }, options);
  } catch (err) {
    console.error(err)

    dispatch({
      type: CODRAWING_STROKE_FAILED,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const subscribeCodrawing = (textureId) => async (dispatch, getState) => {
  dispatch({
    type: SUBSCRIBE_CODRAWING_LOADING,
  });  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/codrawing/' + encodeURIComponent(textureId), {}, options);
    
    dispatch({
      type: SUBSCRIBE_CODRAWING_SUCCESS,
      payload: { codrawingId: response.data.codrawingId },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: SUBSCRIBE_CODRAWING_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const unsubscribeCodrawing = (textureId) => async (dispatch, getState) => {
  // dispatch({
  //   type: UNSUBSCRIBE_CODRAWING_LOADING,
  // });
  
  try {
    const options = attachTokenToHeaders(getState);
    await axios.post('/api/codrawing/stop/' + encodeURIComponent(textureId), {}, options);

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

export const codrawingUndo = (textureId) => async (dispatch, getState) => {
  dispatch({
    type: CODRAWING_UNDO_LOADING,
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/codrawing/undo/' + encodeURIComponent(textureId), options);

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
