import { SNAPSHOT_DID } from '../../../game/constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { 
  TOGGLE_LAYER_VISIBILITY,
  CLEAR_GAME_VIEW_EDITOR,
  // TOGGLE_GAME_INSTANCE_PAUSED,
  TOGGLE_GRID_VIEW,
  CLOSE_SNAPSHOT_TAKER,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
  SET_RESIZING_ENTITY_INSTANCE_ID,
  SET_IS_MOUSE_OVER_GAME_VIEW,
  SET_IS_DIALOG_OVER_GAME_VIEW,
  TOGGLE_PIXEL_PERFECT_MODE,
  // UNDO_INSTANCE_CHANGE_FAIL,
  // UNDO_INSTANCE_CHANGE_SUCCESS
} from '../../types';

import { saveAllCurrentCanvases } from '../media/codrawingActions';

export const setIsMouseOverGameView = (isMouseOverGameView) => (dispatch, getState) => {
  dispatch({
    type: SET_IS_MOUSE_OVER_GAME_VIEW,
    payload: {
      isMouseOverGameView
    }
  });
}

export const changeEditorCameraZoom = (zoom) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EDITOR_CAMERA_ZOOM,
    payload: {
      cameraZoom: zoom
    }
  });
}



export const openSnapshotTaker = (fileId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_SNAPSHOT_TAKER,
    payload: {
      snapshotTextureId: SNAPSHOT_DID+generateUniqueId()
    }
  });
}

export const closeSnapshotTaker = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SNAPSHOT_TAKER,
    payload: {}
  });
}

export const openBoundaryEditor= () => (dispatch, getState) => {
  saveAllCurrentCanvases()
  
  dispatch(toggleGridView(true))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_SECTION_EDITOR,
    payload: {}
  });
}

export const closeBoundaryEditor= () => (dispatch, getState) => {
  dispatch(toggleGridView(false))
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SECTION_EDITOR,
    payload: {}
  });
}

export const toggleGridView = (value) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_GRID_VIEW,
    payload: {
      value
    }
  });
}

export const togglePixelPerfectMode = (value) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_PIXEL_PERFECT_MODE,
    payload: {
      value
    }
  });
}


export const setIsDialogOverGameView = (value) => (dispatch, getState) => {
  dispatch({
    type: SET_IS_DIALOG_OVER_GAME_VIEW,
    payload: {
      value: value
    }
  })
}

export const clearGameViewEditor = () => (dispatch, getState) => {
  dispatch({
    // updateCobrowsing: true,
    // noCobrowsingToolNeeded: true,
    type: CLEAR_GAME_VIEW_EDITOR,
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

export const setResizingEntityInstance = (entityInstanceId, entityModelId, updateCobrowsing) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing,
    type: SET_RESIZING_ENTITY_INSTANCE_ID,
    payload: { entityInstanceId, entityModelId }
  });
}

// export const toggleGameInstancePaused = () => (dispatch, getState) => {
//   dispatch({
//     updateCobrowsing: true,
//     type: TOGGLE_GAME_INSTANCE_PAUSED
//   });
// }


