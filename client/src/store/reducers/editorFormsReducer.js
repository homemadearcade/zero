import {
  CLEAR_EDITOR_FORMS,
  OPEN_CREATE_CLASS_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  CLOSE_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  UPDATE_CREATE_CLASS,
  UPDATE_CREATE_CLASS_STEP,
  UPDATE_CREATE_BRUSH_STEP,
} from '../types';

const initialState = {
  editorFormsState: {
    isCreateBrushFlowOpen: false,
    createBrushStep: '',
    brush: {
      layer: null,
      textureId: null,
      descriptors: []
    },
    isCreateClassFlowOpen: false,
    createClassStep: '',
    class: {
      descriptors: [],
      textureId: null,
    },
    // isCreateHeroFlowOpen: false,
    // isCreateWorldFlowOpen: false,
  }
};

export default function editorFormsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_CREATE_BRUSH_STEP: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          createBrushStep: payload.step
        }
      }
    case UPDATE_CREATE_CLASS_STEP: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          createClassStep: payload.step
        }
      }
    case UPDATE_CREATE_BRUSH: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          brush: {...state.editorFormsState.brush, ...payload.brush }
        }
      }
    case UPDATE_CREATE_CLASS: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          class: {...state.editorFormsState.class, ...payload.class }
        }
    }
    case OPEN_CREATE_BRUSH_FLOW: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          isCreateBrushFlowOpen: true
        }
      }
    case OPEN_CREATE_CLASS_FLOW: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          isCreateClassFlowOpen: true
        }
      }
    case CLOSE_CREATE_BRUSH_FLOW: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          isCreateBrushFlowOpen: false
        }
      }
    case CLOSE_CREATE_CLASS_FLOW: 
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          isCreateClassFlowOpen: false
        }
      }
    case CLEAR_EDITOR_FORMS:
      return {
        ...state,
        editorFormsState: {
          ...state.editorFormsState,
          brush: initialState.editorFormsState.brush,
          class: initialState.editorFormsState.class
        }
      }
    default:
      return state;
  }
}
