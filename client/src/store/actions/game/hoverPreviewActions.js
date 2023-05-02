import { 
  CHANGE_ENTITY_ID_HOVERING,
  CHANGE_BRUSH_ID_HOVERING,
  CHANGE_INSTANCE_HOVERING,
  CHANGE_EFFECT_ID_HOVERING,
  CHANGE_EVENT_ID_HOVERING,
  CHANGE_RELATION_TAG_ID_HOVERING,
  CHANGE_RELATION_ID_HOVERING,
  CHANGE_KEY_TOOLBAR_ACTION_ID_HOVERING,
} from '../../types';


export const changeEntityIdHovering = (entityModelId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_ENTITY_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      entityModelId
    }
  });
}

export const changeInstanceHovering = (entityInstanceId, entityModelId, data) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_INSTANCE_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload:  {
      entityInstanceId,
      entityModelId,
      data
    }
  });
}

export const changeBrushIdHovering = (brushId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_BRUSH_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      brushId
    }
  });
}

export const changeEffectIdHovering = (effectId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EFFECT_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      effectId
    }
  });
}


export const changeKeyToolbarActionIdHovering = (effectId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_KEY_TOOLBAR_ACTION_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      effectId
    }
  });
}


export const changeEventIdHovering = (eventId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_EVENT_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      eventId
    }
  });
}
export const changeRelationTagIdHovering = (relationTagId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_RELATION_TAG_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      relationTagId
    }
  });
}
export const changeRelationIdHovering = (relationId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_RELATION_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      relationId
    }
  });
}