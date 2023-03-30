import { 
  SAVE_CANVAS_IMAGE_FAIL, 
  SAVE_CANVAS_IMAGE_LOADING, 
  SAVE_CANVAS_IMAGE_SUCCESS, 
  MARK_CANVAS_IMAGE_UNSAVED, 
  MARK_CANVAS_IMAGE_STROKES_PENDING, 
} from '../../types';

const initialState = {
  textureIdStrokesPending: {},
  textureIdSaving: {},
  textureIdUnsaved: {},
  isLoadingTextureId: null
};

export default function cobrowsingReducer(state = initialState, { type, payload }) {
  switch (type) {
    case MARK_CANVAS_IMAGE_STROKES_PENDING:
      return {
        ...state,
        textureIdStrokesPending: {
          [payload.textureId]: payload.pending
        }
      }
    case MARK_CANVAS_IMAGE_UNSAVED:
      return {
        ...state,
        textureIdUnsaved: {
          [payload.textureId]: payload.unsaved
        }
      }
    case SAVE_CANVAS_IMAGE_LOADING:
      return {
        ...state,
        textureIdSaving: {
          [payload.textureId]: true,
        }
      };
    case SAVE_CANVAS_IMAGE_SUCCESS:
      return {
        ...state,
        textureIdSaving: {
          [payload.textureId]: false
        },
        textureIdUnsaved: {
          [payload.textureId]: false
        }
      };
    case SAVE_CANVAS_IMAGE_FAIL:
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
