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
  // UNDO_INSTANCE_CHANGE_FAIL,
  // UNDO_INSTANCE_CHANGE_SUCCESS
} from '../../types';

import { saveAllCurrentCanvases } from '../media/codrawingActions';

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

  dispatch({
    updateCobrowsing: true,
    type: OPEN_SECTION_EDITOR,
    payload: {}
  });
}

export const closeBoundaryEditor= () => (dispatch, getState) => {
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

export const setResizingEntityInstance = (entityInstanceId) => (dispatch, getState) => {
  dispatch({
    type: SET_RESIZING_ENTITY_INSTANCE_ID,
    payload: { entityInstanceId }
  });
}

// export const toggleGameInstancePaused = () => (dispatch, getState) => {
//   dispatch({
//     updateCobrowsing: true,
//     type: TOGGLE_GAME_INSTANCE_PAUSED
//   });
// }


