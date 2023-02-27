import { SAVE_TEXTURE_FAIL, SAVE_TEXTURE_LOADING, SAVE_TEXTURE_SUCCESS } from '../types';

const initialState = {
  textureIdSaving: null
};

export default function cobrowsingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SAVE_TEXTURE_LOADING:
      return {
        ...state,
        textureIdSaving: payload.textureId,
      };
    case SAVE_TEXTURE_SUCCESS:
      return {
        ...state,
        textureIdSaving: null
      };
    case SAVE_TEXTURE_FAIL:
      return {
        ...state,
        textureIdSaving: null
      };
    default:
      return state;
  }
}
