import { 
  TOGGLE_LAYER_VISIBILITY,
  CLEAR_EDITOR_INSTANCE
} from '../types';

export const clearEditorInstance = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR_INSTANCE,
    payload: {}
  });
}

export const toggleLayerVisibility = (layerId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_LAYER_VISIBILITY,
    payload: { layerId }
  });
}

