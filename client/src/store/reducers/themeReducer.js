import { DEFAULT_THEME_COLOR } from '../../constants';
import { UPDATE_THEME } from '../types';

// green #008F11
// matrix green #00FF41
// default blue #90CAF9

const initialState = {
  primaryColor: DEFAULT_THEME_COLOR,
};

export default function pageReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_THEME:
      console.log(payload)
      return {
        ...initialState,
        ...payload
      };
    default:
      return state;
  }
}
