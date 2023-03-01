import {
  LOCK_INTERFACE,
  UNLOCK_INTERFACE,
  INITIALIZE_UNLOCKABLE_INTERFACE_IDS
} from '../types';

const initialState = {

};

export const initialUnlockableInterfaceState = initialState

export default function unlockableInterfaceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case INITIALIZE_UNLOCKABLE_INTERFACE_IDS: 
    console.log(payload)
      return payload.unlockableInterfaceIds
    case LOCK_INTERFACE:
      return {
        ...state,
        [payload.interfaceId]: false
      };
    case UNLOCK_INTERFACE:
      return {
        ...state,
        [payload.interfaceId]: true
      };
    default:
      return state;
  }
}
