import {
  OPEN_CONTEXT_MENU,
  CLOSE_CONTEXT_MENU,
} from '../../types';

const initialState = {
  contextMenuX: null,
  contextMenuY: null,
  entityInstanceIdSelectedContextMenu: null,
  entityModelIdSelectedContextMenu: null,
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
        entityModelIdSelectedContextMenu: payload.entityModelIdSelectedContextMenu,
        entityInstanceIdSelectedContextMenu: payload.entityInstanceIdSelectedContextMenu,
        selectableEntityInstances: payload.selectableEntityInstances
      };
    case CLOSE_CONTEXT_MENU:
      return {
        ...state,
        contextMenuX: null,
        contextMenuY: null,
        entityModelIdSelectedContextMenu: null,
        entityInstanceIdSelectedContextMenu: null,
        selectableEntityInstances: null,
        isContextMenuOpen: false
      };
    default:
      return state;
  }
}
