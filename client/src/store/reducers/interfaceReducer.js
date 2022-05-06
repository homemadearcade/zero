import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  interfaceState: {
    contextMenuObjectSelected: null,
    contextMenuSelectableObjects: null,
    isContextMenuOpen: false,
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
          contextMenuObjectSelected: payload.contextMenuObjectSelected,
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
          contextMenuObjectSelected: null,
          contextMenuSelectableObjects: null,
          isContextMenuOpen: false
        },
      };
    default:
      return state;
  }
}
