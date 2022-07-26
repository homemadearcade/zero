import {
  UNLOCK_INTERFACE,
  LOCK_INTERFACE
} from '../types';


export const unlockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: UNLOCK_INTERFACE,
    payload: { interfaceId: id },
  });
};

export const lockInterfaceId = (id) => async (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: LOCK_INTERFACE,
    payload: { interfaceId: id },
  });
};