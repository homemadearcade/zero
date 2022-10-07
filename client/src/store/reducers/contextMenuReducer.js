import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
} from '../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  objectIdSelectedContextMenu: null,
  classIdSelectedContextMenu: null,
  selectableObjectIds: null,
  unlockableIds: null,
  isContextMenuOpen: false,
};

export const initialContextMenuState = initialState

export default function contextMenuReducer(state = initialState, { type, payload }) {
  switch (type) {
    case OPEN_CONTEXT_MENU:
      return {
        ...state,
        unlockableIds: payload.unlockableIds,
        contextMenuX: payload.contextMenuX,
        contextMenuY: payload.contextMenuY,
        isContextMenuOpen: true,
        classIdSelectedContextMenu: payload.classIdSelectedContextMenu,
        objectIdSelectedContextMenu: payload.objectIdSelectedContextMenu,
        selectableObjectInstances: payload.selectableObjectInstances
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: null,
        contextMenuY: null,
        classIdSelectedContextMenu: null,
        objectIdSelectedContextMenu: null,
        selectableObjectInstances: null,
        isContextMenuOpen: false
      };
    default:
      return state;
  }
}
