import _ from 'lodash';
import { defaultRelationship } from '../../../game/constants';
import { mergeDeep } from '../../../utils/utils';
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
  OPEN_BOUNDARY_RELATION,
  UPDATE_BOUNDARY_RELATION,
  CLOSE_BOUNDARY_RELATION,
  OPEN_STAGES_MENU,
  CLOSE_STAGES_MENU,
  OPEN_CREATE_STAGE,
  UPDATE_CREATE_STAGE,
  CLOSE_CREATE_STAGE,
  OPEN_CLASS_EDIT_MODAL,
  CLOSE_CLASS_EDIT_MODAL,
  OPEN_CREATE_EFFECT,
  UPDATE_CREATE_EFFECT,
  CLOSE_CREATE_EFFECT,
  OPEN_CREATE_RELATION_TAG,
  UPDATE_CREATE_RELATION_TAG,
  CLOSE_CREATE_RELATION_TAG,
  OPEN_CREATE_EVENT,
  UPDATE_CREATE_EVENT,
  CLOSE_CREATE_EVENT,
  UPDATE_CREATE_CANVAS_IMAGE,
  OPEN_CREATE_CANVAS_IMAGE_MODAL_LOADING,
  CLOSE_CREATE_CANVAS_IMAGE_MODAL,
  OPEN_CREATE_CANVAS_IMAGE_MODAL,
} from '../../types';

// game create editor
const initialState = {
  isCreateBrushFlowOpen: false,
  brush: {
    layerId: null,
    textureId: null,
    textureTint: null,
    visualTags: []
  },

  isEditEntityGraphicsOpen: false,
  isEditEntityModalOpen: false,
  entityModel: {
    visualTags: [],
    graphics : {
      textureId: null,
      textureTint: null,
    },
    editorInterface: {

    },
    name: "",
    entityInterfaceId: null,
  },

  isCreateColorFlowOpen: false,
  color: {
    hex: null,
    layerId: null,
    textureTint: null,
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
  isCreateStageModalOpen: false,
  stage: {
    name: '',
  },

  isCreateRelationTagOpen: false,
  relationTag: {

  },

  isCreateEventOpen: false,
  event: {
    sidesA: [],
    sidesB: []
  },

  isCreateEffectOpen: false,
  effect: {

  },

  isBoundaryRelationMenuOpen: false,
  isCreateRelationOpen: false,
  entityModelIdRelationsMenu: null,
  relation: {
    ...defaultRelationship,
  },

  isCanvasImageModalLoading: false,
  isCanvasImageModalOpen: false,
  canvasImage: {
    visualTags: []
  }
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
          layerId: payload.layerId
        },
      }
    case OPEN_CLASS_EDIT_MODAL: 
      return {
        ...state,
        isEditEntityModalOpen: true,
        entityModel: payload.entityModel
      }
    case CLOSE_CLASS_EDIT_MODAL:
      return {
        ...state,
        isEditEntityModalOpen: false,
        // entityModel: null
      }
    case CLOSE_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: null,

      }
    case UPDATE_CREATE_CLASS: 
      return {
        ...state,
        entityModel: mergeDeep(state.entityModel, payload.entityModel)
      }
    case OPEN_CREATE_CLASS_FLOW: 
      return {
        ...state,
        entityModel: {
          ..._.cloneDeep(initialState.entityModel),
          ...payload.entityModel ? _.cloneDeep(payload.entityModel) : {}
        },
        isEditEntityGraphicsOpen: true
      }
    case CLOSE_CREATE_CLASS_FLOW: 
      return {
        ...state,
        isEditEntityGraphicsOpen: false
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
    case OPEN_CREATE_EFFECT:
      return {
        ...state,
        isCreateEffectOpen: true,
        effect: {
          ..._.cloneDeep(initialState.effect),
          ...payload.initialEffect ? _.cloneDeep(payload.initialEffect) : {}
        },
      }
    case UPDATE_CREATE_EFFECT:
      return {
        ...state,
        effect: {
          ...state.effect, ...payload.effect
        }
      }
    case CLOSE_CREATE_EFFECT:
      return {
        ...state,
        isCreateEffectOpen: false,
        effect: {}
      }
    case OPEN_CREATE_RELATION_TAG: 
      return {
        ...state,
        isCreateRelationTagOpen: true,
        relationTag: {
          ..._.cloneDeep(initialState.relationTag),
          ...payload.initialRelationTag ? _.cloneDeep(payload.initialRelationTag) : {}
        },
      }
    case UPDATE_CREATE_RELATION_TAG:
      return {
        ...state,
        relationTag: {...state.relationTag, ...payload.relationTag }
      }
    case CLOSE_CREATE_RELATION_TAG:
      return {
        ...state,
        isCreateRelationTagOpen: false
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
        event: payload.event
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
        entityModel: {
          ..._.cloneDeep(initialState.entityModel),
          ...payload.initialEntityModel ? _.cloneDeep(payload.initialEntityModel) : {}
        },
      }
    case UPDATE_BOUNDARY_RELATION: 
      return {
        ...state,
        entityModel: {...state.entityModel, ...payload.entityModel }
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
        isCreateStageModalOpen: true,
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
        isCreateStageModalOpen: false
      }
    case UPDATE_CREATE_CANVAS_IMAGE: 
      return {
        ...state,
        canvasImage: mergeDeep(state.canvasImage, payload.canvasImage)
      }
    case OPEN_CREATE_CANVAS_IMAGE_MODAL:
      return {
        ...state,
        isCanvasImageModalOpen: true,
        imageCanvasTextureId: payload.textureId,
        canvasImage: payload.canvasImage,
        isCanvasImageModalLoading: false
      }
    case CLOSE_CREATE_CANVAS_IMAGE_MODAL: 
      return {
        ...state,
        isCanvasImageModalOpen: false,
        imageCanvasTextureId: null,
        isCanvasImageModalLoading: false
      }
    case OPEN_CREATE_CANVAS_IMAGE_MODAL_LOADING: 
      return {
        ...state,
        isCanvasImageModalLoading: true
      }
    case CLEAR_EDITOR_FORMS:
      return initialState
    default:
      return state;
  }
}
