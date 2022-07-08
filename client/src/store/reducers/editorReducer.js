import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS,
  SELECT_BRUSH,
  CLEAR_BRUSH
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  editorState: {
    error: null,
    objectSelectedIdContextMenu: null,
    brushSelectedIdBrushList: null,
    classSelectedIdClassList: null,
    classSelectedIdLiveEditor: null,
    classSelectedIdContextMenu: null,
    selectableObjectIds: null,
    isContextMenuOpen: false,
    isLiveEditorOpen: false
  }
};

export default function editorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SELECT_CLASS: 
      return {
        ...state,
        editorState: {
          ...state.editorState,
          classSelectedIdClassList: payload.classSelectedIdClassList
        }
      }
    case CLEAR_CLASS:
       return {
         ...state,
         editorState: {
           ...state.editorState,
           classSelectedIdClassList: null
         }
       }
    case SELECT_BRUSH: 
      return {
        ...state,
        editorState: {
          ...state.editorState,
          brushSelectedIdBrushList: payload.brushSelectedIdBrushList
        }
      }
    case CLEAR_BRUSH:
      return {
        ...state,
        editorState: {
          ...state.editorState,
         brushSelectedIdBrushList: null
        }
      }
    case OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: payload.contextMenuX,
        contextMenuY: payload.contextMenuY,
        editorState: {
          ...state.editorState,
          isContextMenuOpen: true,
          classSelectedIdContextMenu: payload.classSelectedIdContextMenu,
          objectSelectedIdContextMenu: payload.objectSelectedIdContextMenu,
          selectableObjectIds: payload.selectableObjectIds
        },
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: null,
        contextMenuY: null,
        editorState: {
          ...state.editorState,
          classSelectedIdContextMenu: null,
          objectSelectedIdContextMenu: null,
          selectableObjectIds: null,
          isContextMenuOpen: false
        },
      };
    case OPEN_LIVE_EDITOR:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          isLiveEditorOpen: true,
          classSelectedIdLiveEditor: payload.classSelectedIdLiveEditor,
        },
      };
    case CLOSE_LIVE_EDITOR:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          classSelectedIdLiveEditor: null,
          isLiveEditorOpen: false
        },
      };
    default:
      return state;
  }
}
