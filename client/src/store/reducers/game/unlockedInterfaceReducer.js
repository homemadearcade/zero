import {
  LOCK_INTERFACE,
  UNLOCK_INTERFACE,
  INITIALIZE_UNLOCKED_INTERFACE_IDS
} from '../../types';

const initialState = {

};

export const initialUnlockableInterfaceState = initialState

export default function unlockedInterfaceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case INITIALIZE_UNLOCKED_INTERFACE_IDS: 
      return payload.unlockedInterfaceIds
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
