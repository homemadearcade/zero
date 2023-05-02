import {
  CHANGE_ENTITY_ID_HOVERING,
  CHANGE_BRUSH_ID_HOVERING,
  CHANGE_INSTANCE_HOVERING,
  CHANGE_RELATION_TAG_ID_HOVERING,
  CHANGE_EVENT_ID_HOVERING,
  CHANGE_EFFECT_ID_HOVERING,
  CHANGE_RELATION_ID_HOVERING,
  CHANGE_KEY_TOOLBAR_ACTION_ID_HOVERING,
} from '../../types';

// these are editor things that take place within the game view
const initialState = {
  entityModelIdHovering: null,
  brushIdHovering: null,
  entityInstanceIdHovering: null,
  relationTagIdHovering: null,
  relationIdHovering: null,
  eventIdHovering: null,
  effectIdHovering: null,
  keyToolbarActionIdHovering: null,
};

export const initialGameViewEditorState = initialState

export default function gameViewEditorReducer(state = initialState, { type, payload }) {
  switch (type) {
   case CHANGE_EVENT_ID_HOVERING:
      return {
        ...state,
        eventIdHovering: payload.eventId
      }
    case CHANGE_EFFECT_ID_HOVERING:
      return {
        ...state,
        effectIdHovering: payload.effectId
      }
    case CHANGE_KEY_TOOLBAR_ACTION_ID_HOVERING:
      return {
        ...state,
        keyToolbarActionIdHovering: payload.effectId
      }
    case CHANGE_RELATION_ID_HOVERING:
      return {
        ...state,
        relationIdHovering: payload.relationId
      }
    case CHANGE_RELATION_TAG_ID_HOVERING:
      return {
        ...state,
        relationTagIdHovering: payload.relationTagId
      }
    case CHANGE_ENTITY_ID_HOVERING:
      return {
        ...state,
        entityModelIdHovering: payload.entityModelId
      }
    case CHANGE_BRUSH_ID_HOVERING:
      return {
        ...state,
        brushIdHovering: payload.brushId
      }
    case CHANGE_INSTANCE_HOVERING:
      return {
        ...state,
        instanceDataHovering: payload.data,
        entityModelIdHovering: payload.entityModelId,
        entityInstanceIdHovering: payload.entityInstanceId
      }
    default:
      return state;
  }
}
