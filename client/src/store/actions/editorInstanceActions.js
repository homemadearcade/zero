import { 
  TOGGLE_LAYER_VISIBILITY,
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_GAME_INSTANCE_PAUSED,
  RESET_GAME_INSTANCE
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

export const toggleGameInstancePaused = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_GAME_INSTANCE_PAUSED
  });
}

export const resetGameIntance = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: RESET_GAME_INSTANCE
  });
}


