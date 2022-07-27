import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
} from '../types';

const initialState = {
  lobbyUserStatuses: {},
  cobrowsingMouses: {},
  cobrowsingScrolls: {},
  phaserViews: {}
};

export default function statusReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ON_LOBBY_USER_STATUS_UPDATE:
      return {
        ...state,
        lobbyUserStatuses: {...state.lobbyUserStatuses, [payload.userId]: payload.status }
      };
    case ON_COBROWSING_STATUS_UPDATE:
      return {
        ...state,
        cobrowsingMouses: {...state.cobrowsingMouses, [payload.userId]: payload.cobrowsingMouse },
        phaserViews: {...state.phaserViews, [payload.userId]: payload.phaserView },
        cobrowsingScrolls: {...state.cobrowsingScrolls, [payload.userId]: payload.cobrowsingScroll }
      };
    default:
      return state;
  }
}
