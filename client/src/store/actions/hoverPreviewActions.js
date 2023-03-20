import { 
  CHANGE_CLASS_ID_HOVERING,
  CHANGE_BRUSH_ID_HOVERING,
  CHANGE_INSTANCE_HOVERING,
  CHANGE_EFFECT_ID_HOVERING,
  CHANGE_EVENT_ID_HOVERING,
  CHANGE_TAG_ID_HOVERING,
  CHANGE_RELATION_ID_HOVERING,
} from '../types';


export const changeClassIdHovering = (entityClassId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_CLASS_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      entityClassId
    }
  });
}

export const changeInstanceHovering = (entityInstanceId, entityClassId, data) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_INSTANCE_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload:  {
      entityInstanceId,
      entityClassId,
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
export const changeTagIdHovering = (tagId) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_TAG_ID_HOVERING,
    updateCobrowsing: true,
    cobrowsingPublisherOnly: true,
    payload: {
      tagId
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