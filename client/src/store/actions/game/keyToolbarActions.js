import store from '../..';
import { getRemoteStatePackage } from '../../../utils';
import {
  INITIALIZE_KEY_TOOLBAR_ACTION_IDS,
  SET_KEY_TOOLBAR_ACTION
} from '../../types';
import { updateCobrowsing } from './cobrowsingActions';

export const initializeKeyToolbarActionIds = (keyToolbarActionIds = {}) => async (dispatch, getState) => {
  dispatch({
    type: INITIALIZE_KEY_TOOLBAR_ACTION_IDS,
    payload: { 
      keyToolbarActionIds,
     },
  });
  
  if(getState().cobrowsing.cobrowsingUser.id === getState().auth.me?.id) {
    dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
  }
};

export const setKeyToolbarActionId = (interfaceActionId, keyId) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: SET_KEY_TOOLBAR_ACTION,
    payload: { interfaceActionId, keyId },
  });

  store.getState()
};