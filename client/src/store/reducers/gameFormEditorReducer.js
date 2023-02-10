import _ from 'lodash';
import { defaultStage } from '../../game/defaultData/stage';
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
} from '../types';

// game create editor
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

  isStagesMenuOpen: false,
  isCreateStageOpen: false,
  stage: {
    ...defaultStage,
    name: '',
  },


  isRelationsMenuOpen: false,
  isCreateRelationOpen: false,
  classIdRelationsMenu: null,
  relation: {
    event: {
      type: '',
      classIdA: null,
      classIdB: null,
    },
    effect: {
      effectedType: null,
      remoteEffectedClassId: null,
      spawnClassId: null,
      type: '',
      classId: null,
      zoneClassId: null,
      cutsceneId: null,
      text: '',
      pickRandomZone: false
    },
    onlyOnce: false,
    delayInterval: null,
    relationId: null,
    sides: []
  },
  isBoundaryRelationMenuOpen: false,
  objectClass: {
    classId: null,
    boundaryRelation: null,
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
