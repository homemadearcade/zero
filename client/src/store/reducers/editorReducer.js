import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR,
  SELECT_CLASS,
  CLEAR_CLASS
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  editorState: {
    error: null,
    classSelectedId: null,
    classSelectedIdLiveEditor: null,
    objectSelectedIdContextMenu: null,
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
          classSelectedId: payload.classSelectedId
        }
      }
    case CLEAR_CLASS:
       return {
         ...state,
         editorState: {
           ...state.editorState,
           classSelectedId: null
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
