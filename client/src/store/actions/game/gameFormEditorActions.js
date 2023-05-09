import _ from 'lodash';
import { IMAGE_TYPE_SPRITE } from '../../../constants';
import { EDIT_CONTENT_TAB_CONTANER_IID, EDIT_ENTITY_MODEL_TAB_CONTANER_IID } from '../../../constants/interfaceIds';
import { CANVAS_IMAGE_DID, newTextureSize } from '../../../game/constants';
import { generateUniqueId, getImageUrlFromTextureId } from '../../../utils';

import { 
  OPEN_EDIT_ENTITY_GRAPHICS,
  CLOSE_CREATE_ENTITY_FLOW,
  UPDATE_CREATE_ENTITY_MODEL,
  OPEN_CREATE_COLOR_FLOW,
  CLOSE_CREATE_COLOR_FLOW,
  TOGGLE_EYE_DROPPER,
  CLOSE_CREATE_BRUSH_FLOW,
  OPEN_CREATE_BRUSH_FLOW,
  UPDATE_CREATE_BRUSH,
  CLEAR_EDITOR_FORMS,
  CHANGE_EDITOR_CAMERA_ZOOM,
  UPDATE_CREATE_CUTSCENE,
  CLOSE_CREATE_CUTSCENE,
  OPEN_CREATE_CUTSCENE,
  OPEN_CREATE_RELATION,
  CLOSE_CREATE_RELATION,
  UPDATE_CREATE_RELATION,
  OPEN_CUTSCENES_MENU,
  CLOSE_CUTSCENES_MENU,
  OPEN_CREATE_STAGE,
  CLOSE_CREATE_STAGE,
  UPDATE_CREATE_STAGE,
  OPEN_ENTITY_EDIT_DIALOG,
  CLOSE_ENTITY_EDIT_DIALOG,
  OPEN_CREATE_RELATION_TAG,
  CLOSE_CREATE_RELATION_TAG,
  UPDATE_CREATE_RELATION_TAG,
  OPEN_CREATE_EFFECT,
  CLOSE_CREATE_EFFECT,
  UPDATE_CREATE_EFFECT,
  OPEN_CREATE_EVENT,
  CLOSE_CREATE_EVENT,
  UPDATE_CREATE_EVENT,
  UPDATE_CREATE_CANVAS_IMAGE,
  OPEN_CREATE_CANVAS_IMAGE_DIALOG_LOADING,
  OPEN_CREATE_CANVAS_IMAGE_DIALOG,
  CLOSE_CREATE_CANVAS_IMAGE_DIALOG,
  OPEN_EFFECT_PROMPT_DIALOG,
  CLOSE_EFFECT_PROMPT_DIALOG,
  OPEN_EDIT_RELATION_SYSTEM_DIALOG,
  CLOSE_EDIT_RELATION_SYSTEM_DIALOG,
  OPEN_EDIT_CONTENT_DIALOG,
  CLOSE_EDIT_CONTENT_DIALOG,
} from '../../types';
import { addCanvasImage } from '../media/canvasImageActions';
import { saveAllCurrentCanvases } from '../media/codrawingActions';
import { updateOpenInterfaceId } from './gameSelectorActions';

export const changeEditorCameraZoom = (zoom) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EDITOR_CAMERA_ZOOM,
    payload: {
      cameraZoom: zoom
    }
  });
}

export const clearGameFormEditor = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: CLEAR_EDITOR_FORMS,
    payload: {}
  });
}

export const openEditEntityGraphics = (interfaceId, entityModel) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_EDIT_ENTITY_GRAPHICS,
    payload: { interfaceId, entityModel: _.cloneDeep(entityModel) }
  });
}

export const closeEditEntityGraphics = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_ENTITY_FLOW,
    payload: {}
  });
}

export const updateCreateEntity = (entityModel) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_ENTITY_MODEL,
    payload: { entityModel }
  });
}

export const openCreateCanvasImageDialog= (entityModelId, textureId, textureTint) => async (dispatch, getState) => {
  const state = getState()
  const newTextureId = state.gameModel.gameModel.id + '/' +CANVAS_IMAGE_DID + generateUniqueId()

  console.log('openCreateCanvasImageDialog', newTextureId)
  try {
    dispatch({
      updateCobrowsing: true,
      type: OPEN_CREATE_CANVAS_IMAGE_DIALOG_LOADING,
    });

    const canvasImage = await dispatch(addCanvasImage({
      textureId: newTextureId, 
      visualTags: [],
      imageData: {
        width: newTextureSize,
        height: newTextureSize
      },
      imageUrl: getImageUrlFromTextureId(newTextureId),
      imageType: IMAGE_TYPE_SPRITE,
      userMongoId: state.gameModel.gameModel.owner.id,
    }))

    dispatch({
      updateCobrowsing: true,
      noCobrowsingToolNeeded: true,
      type: OPEN_CREATE_CANVAS_IMAGE_DIALOG,
      payload: {
        entityModelId,
        textureId,
        textureTint,
        canvasImage,
      }
    });
  } catch(e) {
    console.error(e)
  }
}

export const closeCreateCanvasImageDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_CANVAS_IMAGE_DIALOG,
    payload: {}
  });
}

export const updateCreateCanvasImage = (canvasImage) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_CANVAS_IMAGE,
    payload: { canvasImage }
  });
}


export const openCreateColorFlow = (componentName, layerId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_COLOR_FLOW,
    payload: {
      componentName,
      layerId,
    }
  });
}

export const openEditEntityDialog = (entityModel, tabIID) => (dispatch, getState) => {

  dispatch(updateOpenInterfaceId(EDIT_ENTITY_MODEL_TAB_CONTANER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_ENTITY_EDIT_DIALOG,
    payload: { entityModel: _.cloneDeep(entityModel) }
  });
}

export const closeEditEntityDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_ENTITY_EDIT_DIALOG,
    payload: {}
  });
}

export const openEditRelationSystemDialog = (tabIID) => (dispatch, getState) => {
  // dispatch(updateOpenInterfaceId(EDIT_ENTITY_MODEL_TAB_CONTANER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_EDIT_RELATION_SYSTEM_DIALOG,
  });
}

export const closeEditRelationSystemDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_EDIT_RELATION_SYSTEM_DIALOG,
    payload: {}
  });
}

export const openEditContentDialog = (tabIID) => (dispatch, getState) => {
  dispatch(updateOpenInterfaceId(EDIT_CONTENT_TAB_CONTANER_IID, tabIID))

  dispatch({
    updateCobrowsing: true,
    type: OPEN_EDIT_CONTENT_DIALOG
  });
}

export const closeEditContentDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_EDIT_CONTENT_DIALOG,
    payload: {}
  });
}


export const closeCreateColorFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_COLOR_FLOW,
    payload: {}
  });
}

export const toggleEyeDropper = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: TOGGLE_EYE_DROPPER,
    payload: {}
  });
}

export const openCreateBrushFlow = (layerId) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_BRUSH_FLOW,
    payload: {
      layerId
    }
  });
}

export const closeCreateBrushFlow = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_BRUSH_FLOW,
    payload: {}
  });
}

export const updateCreateBrush = (brush) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_BRUSH,
    payload: { brush }
  });
}

export const openCreateStageDialog = (initialStage) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_STAGE,
    payload: { initialStage }
  });
}

export const closeCreateStageDialog= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_STAGE,
    payload: {}
  });
}

export const updateCreateStage = (stage) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_STAGE,
    payload: { stage }
  });
}

export const openCreateCutscene = (initialCutscene) => (dispatch, getState) => {
  saveAllCurrentCanvases()

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_CUTSCENE,
    payload: { initialCutscene }
  });
}

export const closeCreateCutscene= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_CUTSCENE,
    payload: {}
  });
}

export const updateCreateCutscene = (cutscene) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_CUTSCENE,
    payload: { cutscene }
  });
}

export const openCreateRelation = (initialRelation) => (dispatch, getState) => {
  const gameModel = getState().gameModel.gameModel

  let event = initialRelation?.event
  if(initialRelation?.eventId) {
    event = gameModel.events[initialRelation.eventId]
  }

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_RELATION,
    payload: { 
      initialRelation,
      event,
    }
  });
}
export const closeCreateRelation= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_RELATION,
    payload: {}
  });
}
export const updateCreateRelation = (relation) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_RELATION,
    payload: { relation }
  });
}

export const openCreateRelationTag = (initialRelationTag) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_RELATION_TAG,
    payload: { initialRelationTag }
  });
}
export const closeCreateRelationTag= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_RELATION_TAG,
    payload: {}
  });
}
export const updateCreateRelationTag = (relationTag) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_RELATION_TAG,
    payload: { relationTag }
  });
}

export const openEffectPromptDialog = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_EFFECT_PROMPT_DIALOG,
    payload: {}
  });
}
export const closeEffectPromptDialog= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_EFFECT_PROMPT_DIALOG,
    payload: {}
  });
}



export const openCreateEffect = (initialEffect) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_EFFECT,
    payload: { initialEffect }
  });
}
export const closeCreateEffect= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_EFFECT,
    payload: {}
  });
}
export const updateCreateEffect = (effect) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_EFFECT,
    payload: { 
      effect
    }
  });
}

export const openCreateEvent = (initialEvent) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: OPEN_CREATE_EVENT,
    payload: { initialEvent }
  });
}

export const closeCreateEvent= () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CREATE_EVENT,
    payload: {}
  });
}

export const updateCreateEvent = (event) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    noCobrowsingToolNeeded: true,
    type: UPDATE_CREATE_EVENT,
    payload: { event }
  });
}
