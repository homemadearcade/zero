import {
  START_VIDEO_CALL
} from '../types';

const initialState = {
  isStarted: false,
  lobbyId: false,
};

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_VIDEO_CALL:
      return {
        ...state,
        isStarted: true,
        lobbyId: payload.lobbyId
      };
    default:
      return state;
  }
}
