import { COMPLETE_CLOSE_CONSTELLATION, OPEN_CONSTELLATION, START_CLOSE_CONSTELLATION } from '../types';

const initialState = {
  isConstellationClosing: false,
  isConstellationOpen: false,
  constellationZoomImageFile: null
};

export const initialHomemadeArcadeState = initialState

export default function homemadeArcadeReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: true
      }
    case COMPLETE_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: false,
        isConstellationOpen: false
      }
    case OPEN_CONSTELLATION:
      return {
        ...state,
        isConstellationOpen: true,
        constellationZoomImageFile: payload.imageBase64
      }
    default:
      return state;
  }
}
