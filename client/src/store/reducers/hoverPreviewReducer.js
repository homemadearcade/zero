import {
  CHANGE_CLASS_ID_HOVERING,
  CHANGE_BRUSH_ID_HOVERING,
  CHANGE_INSTANCE_HOVERING,
  CHANGE_TAG_ID_HOVERING,
  CHANGE_EVENT_ID_HOVERING,
  CHANGE_EFFECT_ID_HOVERING,
  CHANGE_RELATION_ID_HOVERING,
} from '../types';

// these are editor things that take place within the game view
const initialState = {
  entityClassIdHovering: null,
  brushIdHovering: null,
  instanceClassIdHovering: null,
  entityInstanceIdHovering: null,
  tagIdHovering: null,
  relationIdHovering: null,
  eventIdHovering: null,
  effectIdHovering: null
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
    case CHANGE_RELATION_ID_HOVERING:
      return {
        ...state,
        relationIdHovering: payload.relationId
      }
    case CHANGE_TAG_ID_HOVERING:
      return {
        ...state,
        tagIdHovering: payload.tagId
      }
    case CHANGE_CLASS_ID_HOVERING:
      return {
        ...state,
        entityClassIdHovering: payload.entityClassId
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
        instanceClassIdHovering: payload.entityClassId,
        entityInstanceIdHovering: payload.entityInstanceId
      }
    default:
      return state;
  }
}
