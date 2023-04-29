import {
  // LEAVE_LOBBY_LOADING,
  ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE,
  ON_COBROWSING_STATUS_UPDATE,
  ON_CLEAR_COBROWSING_STATUS,
  LEAVE_LOBBY_SUCCESS,
} from '../../types';

const initialState = {
  lobbyInstanceMemberStatuses: {},
  cobrowsingMouses: {},
  cobrowsingScrolls: {},
  phaserViews: {}
};

export default function statusReducer(state = initialState, { type, payload }) {
  switch (type) {

    case LEAVE_LOBBY_SUCCESS: 
      return {
        ...state,
        lobbyInstanceMemberStatuses: {},
        cobrowsingMouses: {},
        cobrowsingScrolls: {},
        phaserViews: {}
      };
    case ON_LOBBY_INSTANCE_MEMBER_STATUS_UPDATE:
      return {
        ...state,
        lobbyInstanceMemberStatuses: {...state.lobbyInstanceMemberStatuses, [payload.userMongoId]: payload.status }
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
