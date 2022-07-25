import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_PHYSICS_EDITOR,
  OPEN_LIVE_WORLD_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH,
  EDITOR_STATE_UPDATE,
  UPDATE_BRUSH_SIZE,
  CLEAR_EDITOR,
  OPEN_LIVE_CAMERA_EDITOR,
  CHANGE_EDITOR_CAMERA_ZOOM
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  error: null,
  objectSelectedIdContextMenu: null,
  brushSelectedIdBrushList: null,
  classSelectedIdClassList: null,
  classSelectedIdLiveEditor: null,
  classSelectedIdContextMenu: null,
  selectableObjectIds: null,
  isContextMenuOpen: false,
  isLiveEditorOpen: false,
  liveEditingCategory: null,
  brushSize: 3,
  cameraZoom: 1,
};

export const initialEditorFormsState = initialState

export default function editorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CHANGE_EDITOR_CAMERA_ZOOM: {
      return {
        ...state,
        cameraZoom: payload.cameraZoom
      }
    }
    case UPDATE_BRUSH_SIZE: {
      return {
        ...state,
        brushSize: payload.brushSize
      }
    }
    case SELECT_CLASS: 
      return {
        ...state,
        brushSelectedIdBrushList: null,
        classSelectedIdClassList: payload.classSelectedIdClassList
      }
    case CLEAR_CLASS:
       return {
         ...state,
          classSelectedIdClassList: null
       }
    case SELECT_BRUSH: 
      return {
        ...state,
        classSelectedIdClassList: null,
        brushSelectedIdBrushList: payload.brushSelectedIdBrushList
      }
    case CLEAR_BRUSH:
      return {
        ...state,
        brushSelectedIdBrushList: null
      }
    case OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: payload.contextMenuX,
        contextMenuY: payload.contextMenuY,
        isContextMenuOpen: true,
        classSelectedIdContextMenu: payload.classSelectedIdContextMenu,
        objectSelectedIdContextMenu: payload.objectSelectedIdContextMenu,
        selectableObjectIds: payload.selectableObjectIds
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: null,
        contextMenuY: null,
        classSelectedIdContextMenu: null,
        objectSelectedIdContextMenu: null,
        selectableObjectIds: null,
        isContextMenuOpen: false
      };
    case OPEN_LIVE_PHYSICS_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'physics',
        classSelectedIdLiveEditor: payload.classSelectedIdLiveEditor,
      };
    case OPEN_LIVE_CAMERA_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'camera',
        classSelectedIdLiveEditor: payload.classSelectedIdLiveEditor,
      };
    case OPEN_LIVE_WORLD_EDITOR:
      return {
        ...state,
        isLiveEditorOpen: true,
        liveEditingCategory: 'world',
      };
    case CLOSE_LIVE_EDITOR:
      return {
          ...state,
        classSelectedIdLiveEditor: null,
        isLiveEditorOpen: false,
        liveEditingCategory: null
      };
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
