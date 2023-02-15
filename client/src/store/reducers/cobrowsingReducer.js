import {
  START_COBROWSING_FAIL,
  START_COBROWSING_SUCCESS,
  END_COBROWSING_FAIL,
  END_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_FAIL,
  SUBSCRIBE_COBROWSING_SUCCESS,
  SUBSCRIBE_COBROWSING_LOADING,
  UNSUBSCRIBE_COBROWSING_SUCCESS,
  UNSUBSCRIBE_COBROWSING_FAIL,
  UNSUBSCRIBE_COBROWSING_LOADING,
  ON_COBROWSING_UPDATE,
  TOGGLE_COBROWSING,
  TOGGLE_UNLOCKABLE_INTERFACE_LOCKS,
  INITIALIZE_COBROWSING_STATE,
  SET_MOUSE_OVER_INTERFACE_ID,
  SELECT_COBROWSING_TOOL,
  ON_CLEAR_COBROWSING_STATUS,
} from '../types';

import { initialContextMenuState } from './contextMenuReducer';
import { initialGameFormEditorState } from './gameFormEditorReducer';
import { initialGameViewEditorState } from './gameViewEditorReducer';
import { initialGameEditorState } from './gameEditorReducer';
import { initialErrorState } from './errorsReducer';
import { initialPlayerInterfaceState } from './playerInterfaceReducer';
import { initialUnlockableInterfaceState } from './unlockableInterfaceReducer';
import { initialVideoState } from './videoReducer';
import { inIframe } from '../../utils/webPageUtils';
import { initialSnackbarState } from './snackbarReducer';

function getDefaultIsActiveCobrowsing() {
  return inIframe()
}

const initialState = {
  isSubscribedCobrowsing: false,
  isActivelyCobrowsing: getDefaultIsActiveCobrowsing(),
  isSubscribingCobrowsing: false,
  showUnlockableInterfaceLocks: false,
  error: null,
  cobrowsingUser: false,
  selectedTool: null,
  remoteStateUserId: null,
  remoteState: {
    video: initialVideoState,
    gameEditor: initialGameEditorState,
    gameFormEditor: initialGameFormEditorState,
    gameViewEditor: initialGameViewEditorState,
    playerInterface: initialPlayerInterfaceState,
    contextMenu: initialContextMenuState,
    unlockableInterfaceIds: initialUnlockableInterfaceState,
    errors: initialErrorState,
    snackbar: initialSnackbarState
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
        remoteStateUserId: null,
        cobrowsingUser: false,
      };
    case INITIALIZE_COBROWSING_STATE: 
      return {
        ...state,
       remoteState: {
          ...state.remoteState,
          ...payload.initialCobrowsingState,
          unlockableInterfaceIds: {
            ...state.remoteState.unlockableInterfaceIds
          }
        }
      }
    case SUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribedCobrowsing: true,
        isActivelyCobrowsing: getDefaultIsActiveCobrowsing(),
        isSubscribing: false,
        cobrowsingUser: payload.cobrowsingUser,
      };
    case UNSUBSCRIBE_COBROWSING_LOADING:
    case UNSUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribedCobrowsing: false,
        isActivelyCobrowsing: false,
        isUnsubscribing: false,
        cobrowsingUser: false,
        remoteStateUserId: null,
        selectedTool: null,
        remoteState: initialState.remoteState
      };
    case SUBSCRIBE_COBROWSING_FAIL:
    case UNSUBSCRIBE_COBROWSING_FAIL:
      return {
        ...state,
        isUnsubscribing: false,
        isSubscribing: false,
        cobrowsingUser: false,
        remoteStateUserId: null,
        selectedTool: null,
        error: payload.error,
      };
    case START_COBROWSING_FAIL:
    case END_COBROWSING_FAIL:
      return {
        ...state,
        cobrowsingUser: false,
        remoteStateUserId: null,
        error: payload.error,
      };
    case TOGGLE_COBROWSING: 
      return {
        ...state,
        selectedTool: null,
        isActivelyCobrowsing: payload.value
      }
    case TOGGLE_UNLOCKABLE_INTERFACE_LOCKS: 
      return {
        ...state,
        showUnlockableInterfaceLocks: payload.value
      }
    case SET_MOUSE_OVER_INTERFACE_ID:
      return {
        ...state,
        mouseOverInterfaceId: payload.interfaceId
      }
    case ON_COBROWSING_UPDATE:
      return {
        ...state,
        remoteStateUserId: payload.remoteStateUserId,
        remoteState: {...payload.remoteState }
      };
    case SELECT_COBROWSING_TOOL:
      return {
        ...state,
        selectedTool: payload.toolId
      }
    // case ON_CLEAR_COBROWSING_STATUS: {
    //   return {
    //     ...state,
    //     remoteStateUserId: null,
    //     cobrowsingUser: null
    //   }
    // }
    default:
      return state;
  }
}
