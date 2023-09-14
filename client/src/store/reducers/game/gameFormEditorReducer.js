import _ from 'lodash';
import { defaultRelationship } from '../../../game/constants';
import { mergeDeep } from '../../../utils/utils';
import {
  CLEAR_EDITOR_FORMS,
  OPEN_EDIT_ENTITY_GRAPHICS,
  CLOSE_CREATE_ENTITY_FLOW,
  UPDATE_CREATE_ENTITY_MODEL,
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
  OPEN_CREATE_STAGE,
  UPDATE_CREATE_STAGE,
  CLOSE_CREATE_STAGE,
  OPEN_ENTITY_EDIT_DIALOG,
  CLOSE_ENTITY_EDIT_DIALOG,
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
  OPEN_CREATE_CANVAS_IMAGE_DIALOG_LOADING,
  CLOSE_CREATE_CANVAS_IMAGE_DIALOG,
  OPEN_CREATE_CANVAS_IMAGE_DIALOG,
  CLOSE_EFFECT_PROMPT_DIALOG,
  OPEN_EFFECT_PROMPT_DIALOG,
  CLEAR_EDITOR,
  OPEN_EDIT_RELATION_SYSTEM_DIALOG,
  CLOSE_EDIT_RELATION_SYSTEM_DIALOG,
  OPEN_EDIT_CONTENT_DIALOG,
  CLOSE_EDIT_CONTENT_DIALOG,
  UPDATE_GAME_MODEL_FORM_EDITOR,
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
  isEditEntityDialogOpen: false,
  entityModel: {
    visualTags: [],
    graphics : {
      textureId: null,
      textureTint: null,
    },
    editorInterface: {

    },
    name: "",
    entityIID: null,
  },

  isCreateColorFlowOpen: false,
  color: {
    hex: null,
    layerId: null,
    textureTint: null,
  },
  isEyeDropping: false,

  isCreateCutsceneOpen: false,
  cutscene: {
    name: '',
    scenes: [],
    cutsceneId: null
  },

  isCreateStageDialogOpen: false,
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

  isCanvasImageDialogLoading: false,
  isCanvasImageDialogOpen: false,
  canvasImage: {
    visualTags: []
  },
  canvasImageEntityModelId: null,
  canvasImageTextureId: null,
  canvasImageTextureTint: null,

  isEffectPromptDialogOpen: false,

  isEditRelationSystemDialogOpen: false,
  isEditContentDialogOpen: false,


  gameModelFormEditor: {

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
          layerId: payload.layerId
        },
      }
    case OPEN_ENTITY_EDIT_DIALOG: 
      return {
        ...state,
        isEditEntityDialogOpen: true,
        entityModel: payload.entityModel
      }
    case CLOSE_ENTITY_EDIT_DIALOG:
      return {
        ...state,
        isEditEntityDialogOpen: false,
        // entityModel: null
      }
    case OPEN_EDIT_CONTENT_DIALOG: 
      return {
        ...state,
        isEditContentDialogOpen: true,
      }
    case CLOSE_EDIT_CONTENT_DIALOG:
      return {
        ...state,
        isEditContentDialogOpen: false,
        // entityModel: null
      }
    case OPEN_EDIT_RELATION_SYSTEM_DIALOG: 
      return {
        ...state,
        isEditRelationSystemDialogOpen: true,
      }
    case CLOSE_EDIT_RELATION_SYSTEM_DIALOG:
      return {
        ...state,
        isEditRelationSystemDialogOpen: false,
        // entityModel: null
      }
    case CLOSE_CREATE_COLOR_FLOW: 
      return {
        ...state,
        isCreateColorFlowOpen: null,

      }
    case UPDATE_CREATE_ENTITY_MODEL: 
      return {
        ...state,
        entityModel: mergeDeep(state.entityModel, payload.entityModel)
      }
    case UPDATE_GAME_MODEL_FORM_EDITOR: 
      return {
        ...state,
        gameModelFormEditor: mergeDeep(state.gameModelFormEditor, payload.gameModelFormEditor)
      }
    case OPEN_EDIT_ENTITY_GRAPHICS: 
      return {
        ...state,
        entityModel: {
          ..._.cloneDeep(initialState.entityModel),
          ...payload.entityModel ? _.cloneDeep(payload.entityModel) : {}
        },
        isEditEntityGraphicsOpen: payload.interfaceId
      }
    case CLOSE_CREATE_ENTITY_FLOW: 
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
    case OPEN_CREATE_STAGE: 
      return {
        ...state,
        isCreateStageDialogOpen: true,
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
        isCreateStageDialogOpen: false
      }
    case UPDATE_CREATE_CANVAS_IMAGE: 
    console.log(state.canvasImage, payload.canvasImage)
      return {
        ...state,
        canvasImage: mergeDeep(state.canvasImage, payload.canvasImage)
      }
    case OPEN_CREATE_CANVAS_IMAGE_DIALOG:
      console.log(payload.canvasImage)
      return {
        ...state,
        isCanvasImageDialogOpen: true,
        canvasImageTextureId: payload.textureId,
        canvasImageTextureTint: payload.textureTint,
        canvasImageEntityModelId: payload.entityModelId,
        canvasImage: payload.canvasImage,
        isCanvasImageDialogLoading: false
      }
    case CLOSE_CREATE_CANVAS_IMAGE_DIALOG: 
      return {
        ...state,
        isCanvasImageDialogOpen: false,
        canvasImage: initialState.canvasImage,
        canvasImageTextureId: null,
        canvasImageTextureTint: null,
        canvasImageEntityModelId: null,
        isCanvasImageDialogLoading: false
      }
    case OPEN_CREATE_CANVAS_IMAGE_DIALOG_LOADING: 
      return {
        ...state,
        isCanvasImageDialogLoading: true
      }
    case CLOSE_EFFECT_PROMPT_DIALOG: 
      return {
        ...state,
        isEffectPromptDialogOpen: false
      }
    case OPEN_EFFECT_PROMPT_DIALOG:
      return {
        ...state,
        isEffectPromptDialogOpen: true
      }
    case CLEAR_EDITOR_FORMS:
    case CLEAR_EDITOR:
      return initialState
    default:
      return state;
  }
}
