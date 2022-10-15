import _ from 'lodash';
import { mergeDeep } from '../../utils/utils';
import {
  CLEAR_EDITOR_FORMS,
  OPEN_CREATE_CLASS_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  UPDATE_CREATE_COLOR,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  UPDATE_CREATE_BRUSH_STEP,
  OPEN_CREATE_CUTSCENE,
  UPDATE_CREATE_CUTSCENE,
  CLOSE_CREATE_CUTSCENE,
  OPEN_CREATE_RELATION,
  UPDATE_CREATE_RELATION,
  CLOSE_CREATE_RELATION,
  OPEN_CUTSCENE_MENU,
  CLOSE_CUTSCENE_MENU,
  OPEN_RELATION_MENU,
  CLOSE_RELATION_MENU,
  OPEN_WORLD_RELATION,
  UPDATE_WORLD_RELATION,
  CLOSE_WORLD_RELATION,
} from '../types';

const initialState = {
  isCreateBrushFlowOpen: false,
  brush: {
    canvasId: null,
    textureId: null,
    descriptors: []
  },

  isCreateClassFlowOpen: false,
  class: {
    descriptors: [],
    graphics : {
      textureId: null,
      tint: null,
    },
    name: "",
    type: null,
  },

  isCreateColorFlowOpen: false,
  color: {
    hex: null,
    canvasId: null,
    tint: null,
    isEyeDropping: false
  },

  isCutscenesMenuOpen: false,
  isCreateCutsceneOpen: false,
  cutscene: {
    name: '',
    scenes: [],
  },

  isRelationsMenuOpen: false,
  isCreateRelationOpen: false,
  classIdRelationsMenu: null,
  relation: {
    relationId: null,
    sides: {},
    event: {
      type: null,
      classIdA: null,
      classIdB: null,
    },
    effect: {
      type: null,
      effectedClassId: null,
      text: '',
      classId: null,
      cutsceneId: null,
      zoneClassId: null
    }, 
  },

  isWorldRelationMenuOpen: false,
  objectClass: {
    classId: null,
    worldBoundaryRelation: null,
  }
};

export const initialGameFormEditorState = initialState

export default function gameFormEditorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_CREATE_COLOR: 
      return {
        ...state,
        color: {...state.color, ...payload.color }
      }
    case OPEN_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: payload.componentName,
        color: {
          ...initialState.color,
          canvasId: payload.canvasId
        },
      }
    case CLOSE_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: null,

      }
    case UPDATE_CREATE_CLASS: 
      return {
        ...state,
        class: mergeDeep(state.class, payload.class)
      }
    case OPEN_CREATE_CLASS_FLOW: 
      return {
        ...state,
        class: {
          ..._.cloneDeep(initialState.class),
          ...payload.initialClass ? _.cloneDeep(payload.initialClass) : {}
        },
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
          canvasId: payload.canvasId
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
    case OPEN_CUTSCENE_MENU: 
      return {
        ...state,
        isCutscenesMenuOpen: true,
      }
    case CLOSE_CUTSCENE_MENU:
      return {
        ...state,
        isCutscenesMenuOpen: false
      }
    case OPEN_CREATE_CUTSCENE: 
      return {
        ...state,
        isCreateCutsceneOpen: true,
        cutscene: {
          ..._.cloneDeep(initialState.cutscene),
          ...payload.initialCutscene ? _.cloneDeep(payload.initialCutscene) : {}
        },
      }
    case UPDATE_CREATE_CUTSCENE: 
      return {
        ...state,
        cutscene: {...state.cutscene, ...payload.cutscene }
      }
    case CLOSE_CREATE_CUTSCENE: 
      return {
        ...state,
        isCreateCutsceneOpen: false
      }
    case OPEN_RELATION_MENU: 
      return {
        ...state,
        isRelationsMenuOpen: true,
        classIdRelationsMenu: payload.classId
      }
    case CLOSE_RELATION_MENU:
      return {
        ...state,
        isRelationsMenuOpen: false,
        classIdRelationsMenu: null
      }
    case OPEN_CREATE_RELATION: 
      return {
        ...state,
        isCreateRelationOpen: true,
        relation: {
          ..._.cloneDeep(initialState.relation),
          ...payload.initialRelation ? _.cloneDeep(payload.initialRelation) : {}
        },
      }
    case UPDATE_CREATE_RELATION:
      return {
        ...state,
        relation: {...state.relation, ...payload.relation }
      }
    case CLOSE_CREATE_RELATION:
      return {
        ...state,
        isCreateRelationOpen: false
      }
    case OPEN_WORLD_RELATION: 
      return {
        ...state,
        isWorldRelationOpen: true,
        objectClass: {
          ..._.cloneDeep(initialState.objectClass),
          ...payload.initialObjectClass ? _.cloneDeep(payload.initialObjectClass) : {}
        },
      }
    case UPDATE_WORLD_RELATION: 
      return {
        ...state,
        objectClass: {...state.objectClass, ...payload.objectClass }
      }
    case CLOSE_WORLD_RELATION: 
      return {
        ...state,
        isWorldRelationOpen: false
      }
    case CLEAR_EDITOR_FORMS:
      return initialState
    default:
      return state;
  }
}
