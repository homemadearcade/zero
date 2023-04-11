import store from '../..';
import { getRemoteStatePackage } from '../../../utils';
import {
  UNLOCK_INTERFACE,
  LOCK_INTERFACE,
  INITIALIZE_UNLOCKABLE_INTERFACE_IDS
} from '../../types';
import { updateCobrowsing } from './cobrowsingActions';

export const initializeUnlockableInterfaceIds = (unlockableInterfaceIds = {}) => async (dispatch, getState) => {
  dispatch({
    type: INITIALIZE_UNLOCKABLE_INTERFACE_IDS,
    payload: { 
      unlockableInterfaceIds,
     },
  });

  if(getState().cobrowsing.cobrowsingUser === getState().auth.me?.id) {
    dispatch(updateCobrowsing(getRemoteStatePackage(getState())))
  }
};

export const unlockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: UNLOCK_INTERFACE,
    payload: { interfaceId: id },
  });

  store.getState()
};

export const lockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: LOCK_INTERFACE,
    payload: { interfaceId: id },
  });
};