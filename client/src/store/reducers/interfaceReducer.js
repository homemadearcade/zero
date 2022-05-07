import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
  OPEN_LIVE_EDITOR,
  CLOSE_LIVE_EDITOR
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  interfaceState: {
    objectSelected: null,
    contextMenuSelectableObjects: null,
    isContextMenuOpen: false,
    isLiveEditorOpen: false
  }
};

export default function interfaceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: payload.contextMenuX,
        contextMenuY: payload.contextMenuY,
        interfaceState: {
          ...state.interfaceState,
          isContextMenuOpen: true,
          objectSelected: payload.objectSelected,
          contextMenuSelectableObjects: payload.contextMenuSelectableObjects
        },
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: null,
        contextMenuY: null,
        interfaceState: {
          ...state.interfaceState,
          objectSelected: null,
          contextMenuSelectableObjects: null,
          isContextMenuOpen: false
        },
      };
    case OPEN_LIVE_EDITOR:
      return {
        ...state,
        interfaceState: {
          ...state.interfaceState,
          isLiveEditorOpen: true,
          objectSelected: payload.objectSelected,
        },
      };
    case CLOSE_LIVE_EDITOR:
      return {
        ...state,
        interfaceState: {
          ...state.interfaceState,
          objectSelected: null,
          isLiveEditorOpen: false
        },
      };
    default:
      return state;
  }
}
