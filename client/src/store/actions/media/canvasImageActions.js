import axios from 'axios';

import { attachTokenToHeaders } from '../user/authActions';
import {
  GET_CANVAS_IMAGES_LOADING,
  GET_CANVAS_IMAGES_SUCCESS,
  GET_CANVAS_IMAGES_FAIL,
  GET_CANVAS_IMAGE_LOADING,
  GET_CANVAS_IMAGE_SUCCESS,
  GET_CANVAS_IMAGE_FAIL,
  ADD_CANVAS_IMAGE_LOADING,
  ADD_CANVAS_IMAGE_SUCCESS,
  ADD_CANVAS_IMAGE_FAIL,
  DELETE_CANVAS_IMAGE_LOADING,
  DELETE_CANVAS_IMAGE_SUCCESS,
  DELETE_CANVAS_IMAGE_FAIL,
  EDIT_CANVAS_IMAGE_LOADING,
  EDIT_CANVAS_IMAGE_SUCCESS,
  EDIT_CANVAS_IMAGE_FAIL,
  SAVE_CANVAS_IMAGE_LOADING,
  SAVE_CANVAS_IMAGE_SUCCESS,
  SAVE_CANVAS_IMAGE_FAIL,
} from '../../types';
import { uploadToAws } from '../../../utils/networkUtils';
import { editGameModel } from '../game/gameModelActions';

export const uploadCanvasImageAndAddToGameModel  = ({imageFile, textureId, imageType}) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_CANVAS_IMAGE_LOADING,
    payload: {
      textureId: textureId,
    }
  });

  try {
    const awsResponse = await addAwsImage(imageFile, textureId)

    // this is good here because it sends an event out to update this image/load it
    // but do we need that anymore?
    // yes we need it because the game does not check which assets to load
    dispatch(editGameModel({
      textures: { 
        [textureId] : {
          textureId: textureId,
          imageType: imageType
        }
      }
    }))
    dispatch({
      type: SAVE_CANVAS_IMAGE_SUCCESS,
      payload: {
        textureId: textureId,
      }
    });
  } catch (err) {
    console.error(err)
    dispatch({
      type: SAVE_CANVAS_IMAGE_FAIL,
      payload: {
        textureId: textureId,
      }
    });
  }
}

export const addAwsImage = (imageFile, imageUrl) => {
  return new Promise(async (resolve, reject) => {
    try {
      await uploadToAws(imageUrl, imageFile)
      resolve()
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}
 

export const getCanvasImages = () => async (dispatch, getState) => {
  dispatch({
    type: GET_CANVAS_IMAGES_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/canvasImages', options);

    dispatch({
      type: GET_CANVAS_IMAGES_SUCCESS,
      payload: { canvasImages: response.data.canvasImages },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_CANVAS_IMAGES_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const getCanvasImageByTextureId = (textureId) => async (dispatch, getState) => {
  dispatch({
    type: GET_CANVAS_IMAGE_LOADING,
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/canvasImages/textureId/' + encodeURIComponent(textureId), options);
    
    dispatch({
      type: GET_CANVAS_IMAGE_SUCCESS,
      payload: { canvasImage: response.data.canvasImage },
    });

    return response.data.canvasImage
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_CANVAS_IMAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const addCanvasImage = (canvasImage) => async (dispatch, getState) => {
  dispatch({
    type: ADD_CANVAS_IMAGE_LOADING,
    payload: { textureId: canvasImage.textureId },
  });

  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.post('/api/canvasImages', canvasImage, options);

    dispatch({
      type: ADD_CANVAS_IMAGE_SUCCESS,
      payload: { canvasImage: response.data.canvasImage },
    });

    return response.data.canvasImage
  } catch (err) {
    console.error(err)

    dispatch({
      type: ADD_CANVAS_IMAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const deleteCanvasImage = (id) => async (dispatch, getState) => {
  dispatch({
    type: DELETE_CANVAS_IMAGE_LOADING,
    payload: { id },
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.delete(`/api/canvasImages/${encodeURIComponent(id)}`, options);

    dispatch({
      type: DELETE_CANVAS_IMAGE_SUCCESS,
      payload: { canvasImage: response.data.canvasImage },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: DELETE_CANVAS_IMAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};

export const editCanvasImage = (id, canvasImage) => async (dispatch, getState) => {
  dispatch({
    type: EDIT_CANVAS_IMAGE_LOADING,
    payload: { id },
  });
  
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.put(`/api/canvasImages/${encodeURIComponent(id)}`,canvasImage, options);

    dispatch({
      type: EDIT_CANVAS_IMAGE_SUCCESS,
      payload: { canvasImage: response.data.canvasImage },
    });
  } catch (err) {
    console.error(err)

    dispatch({
      type: EDIT_CANVAS_IMAGE_FAIL,
      payload: { error: err?.response?.data.message || err.message, id },
    });
  }
};