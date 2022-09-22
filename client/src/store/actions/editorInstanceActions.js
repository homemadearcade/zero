import { 
  TOGGLE_CANVAS_VISIBILITY,
  CLEAR_EDITOR_INSTANCE,
  TOGGLE_GAME_INSTANCE_PAUSED,
  RESET_GAME_INSTANCE,
  // UNDO_INSTANCE_CHANGE_FAIL,
  // UNDO_INSTANCE_CHANGE_SUCCESS
} from '../types';

export const clearEditorInstance = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_EDITOR_INSTANCE,
    payload: {}
  });
}

export const toggleLayerVisibility = (canvasId) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_CANVAS_VISIBILITY,
    payload: { canvasId }
  });
}

export const toggleGameInstancePaused = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_GAME_INSTANCE_PAUSED
  });
}

export const resetGameInstance = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: RESET_GAME_INSTANCE
  });
}


