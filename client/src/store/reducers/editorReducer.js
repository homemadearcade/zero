import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  editorState: {
    objectSelectedId: null,
    selectableObjectIds: null,
    isContextMenuOpen: false,
    isLiveEditorOpen: false
  }
};

export default function editorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: payload.contextMenuX,
        contextMenuY: payload.contextMenuY,
        editorState: {
          ...state.editorState,
          isContextMenuOpen: true,
          objectSelectedId: payload.objectSelectedId,
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
          objectSelectedId: null,
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
          objectSelectedId: payload.objectSelectedId,
        },
      };
    case CLOSE_LIVE_EDITOR:
      return {
        ...state,
        editorState: {
          ...state.editorState,
          objectSelectedId: null,
          isLiveEditorOpen: false
        },
      };
    default:
      return state;
  }
}
