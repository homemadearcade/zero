import {

  INITIALIZE_KEY_TOOLBAR_ACTION_IDS,
  SET_KEY_TOOLBAR_ACTION
} from '../../types';

const initialState = {

};

export const initialKeyToolbarState = initialState

export default function keyToolbarReducer(state = initialState, { type, payload }) {
  switch (type) {
    case INITIALIZE_KEY_TOOLBAR_ACTION_IDS: 
      return payload.keyToolbar
    case SET_KEY_TOOLBAR_ACTION:
      return {
        ...state,
        [payload.keyid]: payload.interfaceActionId
      };
    default:
      return state;
  }
}
