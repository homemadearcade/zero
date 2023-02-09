import { UPDATE_THEME } from '../types';

// green #008F11
// matrix green #00FF41
// default blue #90CAF9

const initialState = {
  primaryColor: '#90CAF9',
};

export default function pageReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_THEME:
      return {
        ...initialState,
        ...payload
      };
    default:
      return state;
  }
}
