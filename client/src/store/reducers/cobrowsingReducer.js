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
} from '../types';
import { initialContextMenuState } from './contextMenuReducer';
import { initialEditorState } from './editorFormsReducer';
import { initialEditorInstanceState } from './editorInstanceReducer';
import { initialEditorFormsState } from './editorReducer';
import { initialVideoState } from './videoReducer';

const initialState = {
  isSubscribedCobrowsing: false,
  isSubscribingCobrowsing: false,
  error: null,
  cobrowsingUser: false,
  remoteState: {
    video: initialVideoState,
    editor: initialEditorState,
    editorForms: initialEditorFormsState,
    editorInstance: initialEditorInstanceState,
    contextMenu: initialContextMenuState
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
        cobrowsingUser: payload.cobrowsingUser,
      };
    case UNSUBSCRIBE_COBROWSING_SUCCESS:
      return {
        ...state,
        isSubscribedCobrowsing: false,
        isSubscribingCobrowsing: false,
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
    case ON_COBROWSING_UPDATE:
      return {
        ...state,
        remoteState: {...payload.remoteState }
      };
    default:
      return state;
  }
}
