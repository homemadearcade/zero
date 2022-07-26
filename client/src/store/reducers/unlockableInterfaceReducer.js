import {
  LOCK_INTERFACE,
  UNLOCK_INTERFACE
} from '../types';

const initialState = {
  // brushSize: false,
  // brushList: false,
  // 'brushList/background/add': false,
  // 'brushList/overhead/add': false,
  // 'brushList/playground/add': false,
  // 'brushList/background/list': false,
  // 'brushList/overhead/list': false,
  // 'brushList/playground/list': false,
  // 'brushList/background/visibility': false,
  // 'brushList/overhead/visibility': false,
  // 'brushList/playground/visibility': false,
  // 'brushList/background/eraser': false,
  // 'brushList/overhead/eraser': false,
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
    case LOCK_INTERFACE:
      return {
        ...state,
        [payload.interfaceId]: false
      };
    case UNLOCK_INTERFACE:
      return {
        ...state,
        [payload.interfaceId]: false
      };
    default:
      return state;
  }
}
