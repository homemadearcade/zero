import {
  LOCK_INTERFACE,
  UNLOCK_INTERFACE,
  INITIALIZE_UNLOCKABLE_INTERFACE_IDS
} from '../types';

const initialState = {
  // brushSize: false,
  // brushList: false,
  // 'brushList/background/add': false,
  // 'brushList/FOREGROUND/add': false,
  // 'brushList/playground/add': false,
  // 'brushList/background/list': false,
  // 'brushList/FOREGROUND/list': false,
  // 'brushList/playground/list': false,
  // 'brushList/background/visibility': false,
  // 'brushList/FOREGROUND/visibility': false,
  // 'brushList/playground/visibility': false,
  // 'brushList/background/eraser': false,
  // 'brushList/FOREGROUND/eraser': false,
  // 'brushList/playground/eraser': false,
  // 'color/brush': false,
  // 'color/select': false,
  // classList: false,
  // 'classList/objects/list': false,
  // 'classList/objects/add': false,
  // 'classList/hero/list': false,
  // 'classList/hero/add': false,
  // 'physics/speed': false,
  // 'physics/bounce': false,
  // 'physics/friction': false,
  // 'physics/frictionAir': false,
  // 'physics/customizeWeight': false,
  // 'physics/ignoreGravity': false,
  // 'physics/controlledRotation': false
};

export const initialUnlockableInterfaceState = initialState

export default function unlockableInterfaceReducer(state = initialState, { type, payload }) {
  switch (type) {
    case INITIALIZE_UNLOCKABLE_INTERFACE_IDS: 
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
