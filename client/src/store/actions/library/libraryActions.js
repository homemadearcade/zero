import axios from 'axios';
import { GET_EFFECT_LIBRARY_SUCCESS, GET_ENTITY_MODEL_LIBRARY_SUCCESS, GET_EVENT_LIBRARY_SUCCESS, GET_INTERFACE_PRESET_LIBRARY_SUCCESS, GET_LIBRARY_FAIL, GET_LIBRARY_LOADING, GET_LIBRARY_SUCCESS, GET_RELATION_LIBRARY_SUCCESS, GET_RELATION_TAG_LIBRARY_SUCCESS } from "../../types";
import { attachTokenToHeaders } from '../user/authActions';

export const getLibrary = () => async (dispatch, getState) => {
  dispatch({
    type: GET_LIBRARY_LOADING,
  });
  try {
    const options = attachTokenToHeaders(getState);
    const response = await axios.get('/api/library', options);

    dispatch({
      type: GET_EVENT_LIBRARY_SUCCESS,
      payload: { eventLibrary: response.data.eventLibrary },
    });

    dispatch({
      type: GET_EFFECT_LIBRARY_SUCCESS,
      payload: { effectLibrary: response.data.effectLibrary },
    });

    dispatch({
      type: GET_RELATION_LIBRARY_SUCCESS,
      payload: { relationLibrary: response.data.relationLibrary },
    });

    dispatch({
      type: GET_ENTITY_MODEL_LIBRARY_SUCCESS,
      payload: { entityModelLibrary: response.data.entityModelLibrary },
    });

    dispatch({
      type: GET_RELATION_TAG_LIBRARY_SUCCESS,
      payload: { relationTagLibrary: response.data.relationTagLibrary },
    });

    dispatch({
      type: GET_INTERFACE_PRESET_LIBRARY_SUCCESS,
      payload: { interfacePresetLibrary: response.data.interfacePresetLibrary },
    });

    dispatch({
      type: GET_LIBRARY_SUCCESS,
      payload: {},
    });

    return response.data;
  } catch (err) {
    console.error(err)

    dispatch({
      type: GET_LIBRARY_FAIL,
      payload: { error: err?.response?.data.message || err.message },
    });
  }
};
