import store from '../..';
import { getRemoteStatePackage } from '../../../utils';
import {
  INITIALIZE_KEY_TOOLBAR_ACTION_IDS,
  SET_KEY_TOOLBAR_ACTION
} from '../../types';
import { updateCobrowsing } from './cobrowsingActions';

export const initializeKeyboardShortcutActionIds = (keyboardShortcutActionIds = {}) => async (dispatch, getState) => {
  dispatch({
    type: INITIALIZE_KEY_TOOLBAR_ACTION_IDS,
    payload: { 
      keyboardShortcutActionIds,
     },
  });
  
  if(getState().cobrowsing.cobrowsingUser.id === getState().auth.me?.id) {
    dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
  }
};

export const setKeyboardShortcutActionId = (interfaceActionId, keyId) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: SET_KEY_TOOLBAR_ACTION,
    payload: { interfaceActionId, keyId },
  });

  store.getState()
};