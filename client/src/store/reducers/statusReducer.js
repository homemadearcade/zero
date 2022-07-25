import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
} from '../types';

const initialState = {
  lobbyUserStatus: {},
  cobrowsingMouse: {},
  cobrowsingScroll: {},
  phaserViews: {}
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
        cobrowsingMouse: {...state.cobrowsingMouse, [payload.userId]: payload.cobrowsingMouse },
        phaserViews: {...state.phaserViews, [payload.userId]: payload.phaserView },
        cobrowsingScroll: {...state.cobrowsingScroll, [payload.userId]: payload.cobrowsingScroll }
      };
    default:
      return state;
  }
}
