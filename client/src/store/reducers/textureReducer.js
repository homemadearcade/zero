import { SAVE_TEXTURE_FAIL, SAVE_TEXTURE_LOADING, SAVE_TEXTURE_SUCCESS, MARK_TEXTURE_UNSAVED, MARK_TEXTURE_STROKES_PENDING } from '../types';

const initialState = {
  textureIdStrokesPending: {},
  textureIdSaving: {},
  textureIdUnsaved: {}
};

export default function cobrowsingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case MARK_TEXTURE_STROKES_PENDING:
      return {
        ...state,
        textureIdStrokesPending: {
          [payload.textureId]: payload.pending
        }
      }
    case MARK_TEXTURE_UNSAVED:
      return {
        ...state,
        textureIdUnsaved: {
          [payload.textureId]: payload.unsaved
        }
      }
    case SAVE_TEXTURE_LOADING:
      return {
        ...state,
        textureIdSaving: {
          [payload.textureId]: true,
        }
      };
    case SAVE_TEXTURE_SUCCESS:
      return {
        ...state,
        textureIdSaving: {
          [payload.textureId]: false
        },
        textureIdUnsaved: {
          [payload.textureId]: false
        }
      };
    case SAVE_TEXTURE_FAIL:
      return {
        ...state,
        textureIdSaving: {
          [payload.textureId]: false
        }
      };
    default:
      return state;
  }
}
