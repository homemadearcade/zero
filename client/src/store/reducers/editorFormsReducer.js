import {
  CLEAR_EDITOR_FORMS,
  OPEN_CREATE_CLASS_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  UPDATE_CREATE_COLOR,
  UPDATE_CREATE_CLASS_STEP,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  UPDATE_CREATE_BRUSH_STEP,
} from '../types';

const initialState = {
  isCreateBrushFlowOpen: false,
  createBrushStep: '',
  brush: {
    layerId: null,
    textureId: null,
    descriptors: []
  },
  isCreateClassFlowOpen: false,
  createClassStep: '',
  class: {
    descriptors: [],
    textureId: null,
    tint: null,
  },
  isCreateColorFlowOpen: false,
  color: {
    hex: null,
    layerId: null,
    tint: null
  },
  // isCreateHeroFlowOpen: false,
  // isCreateWorldFlowOpen: false,
};

export const initialEditorState = initialState

export default function editorFormsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_CREATE_COLOR: 
      return {
        ...state,
        color: {...state.color, ...payload.color }
      }
    case OPEN_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: true,
        color: {
          ...initialState.color,
          layerId: payload.layerId
        }
      }
    case CLOSE_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: false
      }
    case UPDATE_CREATE_CLASS_STEP: 
      return {
        ...state,
        createClassStep: payload.step
      }
    case UPDATE_CREATE_CLASS: 
      return {
        ...state,
        class: {...state.class, ...payload.class }
      }
    case OPEN_CREATE_CLASS_FLOW: 
      return {
        ...state,
        isCreateClassFlowOpen: true
      }
    case CLOSE_CREATE_CLASS_FLOW: 
      return {
        ...state,
        isCreateClassFlowOpen: false
      }
    case UPDATE_CREATE_BRUSH_STEP: 
      return {
        ...state,
        createBrushStep: payload.step
      }
    case OPEN_CREATE_BRUSH_FLOW: 
      return {
        ...state,
        isCreateBrushFlowOpen: true,
        brush: {
          ...initialState.brush,
          layerId: payload.layerId
        }
      }
    case UPDATE_CREATE_BRUSH: 
      return {
        ...state,
        brush: {...state.brush, ...payload.brush }
      }
    case CLOSE_CREATE_BRUSH_FLOW: 
      return {
        ...state,
        isCreateBrushFlowOpen: false
      }
    case CLEAR_EDITOR_FORMS:
      return initialState
    default:
      return state;
  }
}
