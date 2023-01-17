import { 
  TOGGLE_CANVAS_VISIBILITY,
  CLEAR_GAME_VIEW_EDITOR,
  // TOGGLE_GAME_INSTANCE_PAUSED,
  RESET_GAME_INSTANCE,
  TOGGLE_GRID_VIEW,
  CLOSE_SNAPSHOT_TAKER,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
  // UNDO_INSTANCE_CHANGE_FAIL,
  // UNDO_INSTANCE_CHANGE_SUCCESS
} from '../types';

import { saveAllCurrentCanvases } from './codrawingActions';

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
      snapshotFileId: fileId
  }
  });

  document.body.style.cursor = 'cell'
}

export const closeSnapshotTaker = () => (dispatch, getState) => {

  document.body.style.cursor = null

  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SNAPSHOT_TAKER,
    payload: {}
  });
}

export const openSectionEditor= () => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_SECTION_EDITOR,
    payload: {}
  });
}

export const closeSectionEditor= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_SECTION_EDITOR,
    payload: {}
  });
}


export const toggleGridView = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_GRID_VIEW,
    payload: {}
  });
}

export const clearGameViewEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_GAME_VIEW_EDITOR,
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

// export const toggleGameInstancePaused = () => (dispatch, getState) => {
//   dispatch({
//     updateCobrowsing: true,
//     type: TOGGLE_GAME_INSTANCE_PAUSED
//   });
// }

// export const resetGameInstance = () => (dispatch, getState) => {
//   dispatch({
//     updateCobrowsing: true,
//     type: RESET_GAME_INSTANCE
//   });
// }


