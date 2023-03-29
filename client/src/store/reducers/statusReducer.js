import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_INSTANCE_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  ON_CLEAR_COBROWSING_STATUS,
} from '../types';

const initialState = {
  lobbyInstanceUserStatuses: {},
  cobrowsingMouses: {},
  cobrowsingScrolls: {},
  phaserViews: {}
};

export default function statusReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ON_LOBBY_INSTANCE_USER_STATUS_UPDATE:
      return {
        ...state,
        lobbyInstanceUserStatuses: {...state.lobbyInstanceUserStatuses, [payload.userId]: payload.status }
      };
    case ON_COBROWSING_STATUS_UPDATE:
      return {
        ...state,
        cobrowsingMouses: {...state.cobrowsingMouses, [payload.userId]: payload.cobrowsingMouse },
        phaserViews: {...state.phaserViews, [payload.userId]: payload.phaserView },
        cobrowsingScrolls: {...state.cobrowsingScrolls, [payload.userId]: payload.cobrowsingScroll }
      };
    case ON_CLEAR_COBROWSING_STATUS: {
      return {
        ...state,
        cobrowsingMouses: {...state.cobrowsingMouses, [payload.userId]: null },
        phaserViews: {...state.phaserViews, [payload.userId]: null },
        cobrowsingScrolls: {...state.cobrowsingScrolls, [payload.userId]: null }
      };
    }
    default:
      return state;
  }
}
