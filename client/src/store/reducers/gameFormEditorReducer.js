import _ from 'lodash';
import { defaultEffect, defaultRelationship, defaultTag } from '../../game/constants';
import { defaultStage } from '../../game/constants';
import { mergeDeep } from '../../utils/utils';
import {
  CLEAR_EDITOR_FORMS,
  OPEN_CREATE_CLASS_FLOW,
  CLOSE_CREATE_CLASS_FLOW,
  UPDATE_CREATE_CLASS,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  TOGGLE_EYE_DROPPER,
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
  OPEN_CUTSCENES_MENU,
  CLOSE_CUTSCENES_MENU,
  OPEN_RELATIONS_MENU,
  CLOSE_RELATIONS_MENU,
  OPEN_BOUNDARY_RELATION,
  UPDATE_BOUNDARY_RELATION,
  CLOSE_BOUNDARY_RELATION,
  OPEN_STAGES_MENU,
  CLOSE_STAGES_MENU,
  OPEN_CREATE_STAGE,
  UPDATE_CREATE_STAGE,
  CLOSE_CREATE_STAGE,
  OPEN_CLASS_NAME_MODAL,
  CLOSE_CLASS_NAME_MODAL,
  OPEN_CREATE_EFFECT,
  UPDATE_CREATE_EFFECT,
  CLOSE_CREATE_EFFECT,
  OPEN_CREATE_TAG,
  UPDATE_CREATE_TAG,
  CLOSE_CREATE_TAG,
  OPEN_CREATE_EVENT,
  UPDATE_CREATE_EVENT,
  CLOSE_CREATE_EVENT,
} from '../types';

// game create editor
const initialState = {
  isCreateBrushFlowOpen: false,
  brush: {
    canvasId: null,
    textureId: null,
    tint: null,
    descriptors: []
  },

  isCreateClassFlowOpen: false,
  isClassNameModalOpen: false,
  objectClass: {
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
  },
  isEyeDropping: false,

  isCutscenesMenuOpen: false,
  isCreateCutsceneOpen: false,
  cutscene: {
    name: '',
    scenes: [],
    cutsceneId: null
  },

  isStagesMenuOpen: false,
  isCreateStageOpen: false,
  stage: {
    ...defaultStage,
    name: '',
  },

  isCreateTagOpen: false,
  tag: {

  },

  isCreateEventOpen: false,
  event: {
    sidesA: [],
    sidesB: []
  },

  isCreateEffectOpen: false,
  effects: {

  },


  isBoundaryRelationMenuOpen: false,
  isRelationsMenuOpen: false,
  isCreateRelationOpen: false,
  classIdRelationsMenu: null,
  relation: {
    ...defaultRelationship,
  },
};

export const initialGameFormEditorState = initialState

export default function gameFormEditorReducer(state = initialState, { type, payload }) {
  switch (type) {
    case TOGGLE_EYE_DROPPER: 
      return {
        ...state,
        isEyeDropping: !state.isEyeDropping
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
    case OPEN_CLASS_NAME_MODAL: 
      return {
        ...state,
        isClassNameModalOpen: true,
        objectClass: payload.objectClass
      }
    case CLOSE_CLASS_NAME_MODAL:
      return {
        ...state,
        isClassNameModalOpen: false,
        objectClass: null
      }
    case CLOSE_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: null,

      }
    case UPDATE_CREATE_CLASS: 
      return {
        ...state,
        objectClass: mergeDeep(state.objectClass, payload.objectClass)
      }
    case OPEN_CREATE_CLASS_FLOW: 
      return {
        ...state,
        objectClass: {
          ..._.cloneDeep(initialState.objectClass),
          ...payload.objectClass ? _.cloneDeep(payload.objectClass) : {}
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
        isCreateBrushFlowOpen: false,
        brush: initialState.brush
      }
    case OPEN_CUTSCENES_MENU: 
      return {
        ...state,
        isCutscenesMenuOpen: true,
      }
    case CLOSE_CUTSCENES_MENU:
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
    case OPEN_RELATIONS_MENU: 
      return {
        ...state,
        isRelationsMenuOpen: true,
        classIdRelationsMenu: payload.classId
      }
    case CLOSE_RELATIONS_MENU:
      return {
        ...state,
        isRelationsMenuOpen: false,
        classIdRelationsMenu: null
      }
    case OPEN_CREATE_EFFECT:
      return {
        ...state,
        isCreateEffectOpen: true,
        effects: {
          ...state.effects,
          [payload.effectId]: {
            ..._.cloneDeep(initialState.effect),
            ...payload.initialEffect ? _.cloneDeep(payload.initialEffect) : {}
          }
        },
      }
    case UPDATE_CREATE_EFFECT:
      return {
        ...state,
        effects: {
          ...state.effects,
          [payload.effectId]: {
            ...state.effects[payload.effectId], ...payload.effect
          }
        }
      }
    case CLOSE_CREATE_EFFECT:
      return {
        ...state,
        isCreateEffectOpen: false,
        effects: {}
      }
    case OPEN_CREATE_TAG: 
      return {
        ...state,
        isCreateTagOpen: true,
        tag: {
          ..._.cloneDeep(initialState.tag),
          ...payload.initialTag ? _.cloneDeep(payload.initialTag) : {}
        },
      }
    case UPDATE_CREATE_TAG:
      return {
        ...state,
        tag: {...state.tag, ...payload.tag }
      }
    case CLOSE_CREATE_TAG:
      return {
        ...state,
        isCreateTagOpen: false
      }
    case OPEN_CREATE_EVENT: 
      return {
        ...state,
        isCreateEventOpen: true,
        event: {
          ..._.cloneDeep(initialState.event),
          ...payload.initialEvent ? _.cloneDeep(payload.initialEvent) : {}
        },
      }
    case UPDATE_CREATE_EVENT:
      return {
        ...state,
        event: {...state.event, ...payload.event }
      }
    case CLOSE_CREATE_EVENT:
      return {
        ...state,
        isCreateEventOpen: false
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
    case OPEN_BOUNDARY_RELATION: 
      return {
        ...state,
        isBoundaryRelationOpen: true,
        objectClass: {
          ..._.cloneDeep(initialState.objectClass),
          ...payload.initialObjectClass ? _.cloneDeep(payload.initialObjectClass) : {}
        },
      }
    case UPDATE_BOUNDARY_RELATION: 
      return {
        ...state,
        objectClass: {...state.objectClass, ...payload.objectClass }
      }
    case CLOSE_BOUNDARY_RELATION: 
      return {
        ...state,
        isBoundaryRelationOpen: false
      }
   case OPEN_STAGES_MENU: 
      return {
        ...state,
        isStagesMenuOpen: true,
      }
    case CLOSE_STAGES_MENU:
      return {
        ...state,
        isStagesMenuOpen: false
      }
    case OPEN_CREATE_STAGE: 
      return {
        ...state,
        isCreateStageOpen: true,
        stage: {
          ..._.cloneDeep(initialState.stage),
          ...payload.initialStage ? _.cloneDeep(payload.initialStage) : {}
        },
      }
    case UPDATE_CREATE_STAGE: 
      return {
        ...state,
        stage: {...state.stage, ...payload.stage }
      }
    case CLOSE_CREATE_STAGE: 
      return {
        ...state,
        isCreateStageOpen: false
      }
    case CLEAR_EDITOR_FORMS:
      return initialState
    default:
      return state;
  }
}
