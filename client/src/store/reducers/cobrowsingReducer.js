import {
  START_COBROWSING_FAIL,
  START_COBROWSING_SUCCESS,
  END_COBROWSING_FAIL,
  END_COBROWSING_SUCCESS,
  UPDATE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_LOADING,
  UNSUBSCRIBE_COBROWSING_SUCCESS,
  UNSUBSCRIBE_COBROWSING_FAIL,
  ON_COBROWSING_UPDATE,
  TOGGLE_COBROWSING,
} from '../types';

import { initialContextMenuState } from './contextMenuReducer';
import { initialEditorState } from './editorFormsReducer';
import { initialEditorInstanceState } from './editorInstanceReducer';
import { initialEditorFormsState } from './editorReducer';
import { initialErrorState } from './errorsReducer';
import { initialGameContextState } from './gameContextReducer';
import { initialUnlockableInterfaceState } from './unlockableInterfaceReducer';
import { initialVideoState } from './videoReducer';

const initialState = {
  isSubscribedCobrowsing: false,
  isCurrentlyCobrowsing: false,
  isSubscribingCobrowsing: false,
  error: null,
  cobrowsingUser: false,
  remoteState: {
    video: initialVideoState,
    editor: initialEditorState,
    editorForms: initialEditorFormsState,
    editorInstance: initialEditorInstanceState,
    contextMenu: initialContextMenuState,
    unlockableInterfaceIds: initialUnlockableInterfaceState,
    errors: initialErrorState,
    gameContext: initialGameContextState
  },
};

export default function cobrowsingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SUBSCRIBE_COBROWSING_LOADING:
      return {
        ...state,
        isSubscribingCobrowsing: true,
      };
    case START_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case END_COBROWSING_SUCCESS:
      return {
        ...state,
        cobrowsingUser: false,
      };
    case SUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribedCobrowsing: true,
        isSubscribingCobrowsing: false,
        isCurrentlyCobrowsing: true,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case UNSUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribedCobrowsing: false,
        isSubscribingCobrowsing: false,
        isCurrentlyCobrowsing: false,
        cobrowsingUser: false,
        remoteState: initialState.remoteState
      };
    case SUBSCRIBE_COBROWSING_FAIL:
    case UNSUBSCRIBE_COBROWSING_FAIL:
      return {
        ...state,
        isSubscribingCobrowsing: false,
        cobrowsingUser: false,
        error: payload.error,
      };
    case UPDATE_COBROWSING_FAIL:
    case START_COBROWSING_FAIL:
    case END_COBROWSING_FAIL:
      return {
        ...state,
        cobrowsingUser: false,
        error: payload.error,
      };
    case TOGGLE_COBROWSING: 
      return {
        ...state,
        isCurrentlyCobrowsing: !state.isCurrentlyCobrowsing
      }
    case ON_COBROWSING_UPDATE:
      return {
        ...state,
        remoteState: {...payload.remoteState }
      };
    default:
      return state;
  }
}
