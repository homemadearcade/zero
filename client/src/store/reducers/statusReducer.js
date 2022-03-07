import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
} from '../types';

const initialState = {
  lobbyUserStatus: {},
  cobrowsingMouse: {
    xPercent: 0,
    screenY: 0,
    lastPing: null,
  }
};

export default function statusReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ON_LOBBY_USER_STATUS_UPDATE:
      return {
        ...state,
        lobbyUserStatus: {...state.lobbyUserStatus, [payload.userId]: payload.status }
      };
    case ON_COBROWSING_STATUS_UPDATE:
      return {
        ...state,
        cobrowsingMouse: {...state.cobrowsingMouse, [payload.userId]: payload.cobrowsingMouse }
      };
    default:
      return state;
  }
}
