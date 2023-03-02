import { SNAPSHOT_ID_PREFIX } from '../../game/constants';
import { generateUniqueId } from '../../utils/webPageUtils';
import { 
  TOGGLE_CANVAS_VISIBILITY,
  CLEAR_GAME_VIEW_EDITOR,
  // TOGGLE_GAME_INSTANCE_PAUSED,
  TOGGLE_GRID_VIEW,
  CLOSE_SNAPSHOT_TAKER,
  OPEN_SECTION_EDITOR,
  CLOSE_SECTION_EDITOR,
  OPEN_SNAPSHOT_TAKER,
  CHANGE_EDITOR_CAMERA_ZOOM,
  CHANGE_CLASS_ID_HOVERING,
  CHANGE_BRUSH_ID_HOVERING,
  CHANGE_INSTANCE_HOVERING,
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

export const changeClassIdHovering = (classId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_CLASS_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      classId
    }
  });
}

export const changeInstanceHovering = (instanceId, classId, data) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_INSTANCE_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload:  {
      instanceId,
      classId,
      data
    }
  });
}

export const changeBrushIdHovering = (brushId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_BRUSH_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      brushId
    }
  });
}

export const openSnapshotTaker = (fileId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_SNAPSHOT_TAKER,
    payload: {
      snapshotFileId: SNAPSHOT_ID_PREFIX+generateUniqueId()
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


