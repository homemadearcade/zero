import { VIDEO_USER_LEFT, VIDEO_USER_JOINED} from '../types';

const initialState = {
  users: [],
};

export default function videoReducer(state = initialState, { type, payload }) {
  switch (type) {
    case VIDEO_USER_JOINED:
      return {
        ...state,
        users: [...state.users, payload.user]
      };
    case VIDEO_USER_LEFT:
      return {
        ...state,
        users: state.users.filter((u) => u.uid !== payload.user.uid)
      };
    default:
      return state;
  }
}
