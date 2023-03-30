import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_INSTANCE_USER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  ON_CLEAR_COBROWSING_STATUS,
} from '../../types';

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
        lobbyInstanceUserStatuses: {...state.lobbyInstanceUserStatuses, [payload.userMongoId]: payload.status }
      };
    case ON_COBROWSING_STATUS_UPDATE:
      return {
        ...state,
        cobrowsingMouses: {...state.cobrowsingMouses, [payload.userMongoId]: payload.cobrowsingMouse },
        phaserViews: {...state.phaserViews, [payload.userMongoId]: payload.phaserView },
        cobrowsingScrolls: {...state.cobrowsingScrolls, [payload.userMongoId]: payload.cobrowsingScroll }
      };
    case ON_CLEAR_COBROWSING_STATUS: {
      return {
        ...state,
        cobrowsingMouses: {...state.cobrowsingMouses, [payload.userMongoId]: null },
        phaserViews: {...state.phaserViews, [payload.userMongoId]: null },
        cobrowsingScrolls: {...state.cobrowsingScrolls, [payload.userMongoId]: null }
      };
    }
    default:
      return state;
  }
}
