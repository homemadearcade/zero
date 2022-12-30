import {
  UNLOCK_INTERFACE,
  LOCK_INTERFACE,
  INITIALIZE_UNLOCKABLE_INTERFACE_IDS
} from '../types';

export const initializeUnlockableInterfaceIds = (unlockableInterfaceIds = {}) => async (dispatch, getState) => {
  dispatch({
    type: INITIALIZE_UNLOCKABLE_INTERFACE_IDS,
    payload: { unlockableInterfaceIds },
  });
};

export const unlockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: UNLOCK_INTERFACE,
    payload: { interfaceId: id },
  });
};

export const lockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: LOCK_INTERFACE,
    payload: { interfaceId: id },
  });
};