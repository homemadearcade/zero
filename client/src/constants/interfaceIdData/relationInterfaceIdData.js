import { EVENT_IGID, RELATION_IGID } from "../interfaceIdGroups";
import { EFFECT_ADD_IID, EFFECT_ADVANCED_CONTAINER_IID, EFFECT_CONTAINER_IID, EFFECT_COOLDOWN_IID, EFFECT_DELAY_IID, EFFECT_PICK_RANDOM_ZONE_IID, EFFECT_REMOTE_IID, EFFECT_SELECT_IID, EVENT_ADD_IID, EVENT_ADVANCED_CONTAINER_IID, EVENT_BOUNDARY_IID, EVENT_CONTAINER_IID, EVENT_IGNORE_SIDES_IID, EVENT_ONLY_ONCE_IID, EVENT_SELECT_IID, RELATION_ADD_IID, RELATION_CONTAINER_IID, RELATION_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [EVENT_ADVANCED_CONTAINER_IID]: {
    ignoreTools: true
  },
  [EVENT_IGNORE_SIDES_IID]: {},
  [EVENT_ONLY_ONCE_IID]: {},
  [EVENT_BOUNDARY_IID]: {},

  [EFFECT_REMOTE_IID]: {},
  [EFFECT_PICK_RANDOM_ZONE_IID]: {},

  [EVENT_ADD_IID]: {
    previewText: 'Add Event',
    name: 'Add Event Button',
    leftClickAction: 'Add Event',
    leftClickIcon: 'faPlus',
    interfaceGroupId: EVENT_IGID
  }, 
  [EVENT_SELECT_IID]: {},
  [EVENT_CONTAINER_IID]: {}, 

  [EFFECT_ADD_IID]: {
    previewText: 'Add Effect',
    name: 'Add Effect Button',
    leftClickAction: 'Add Effect',
    leftClickIcon: 'faPlus',
    interfaceGroupId: EVENT_IGID
  },
  [EFFECT_SELECT_IID]: {},
  [EFFECT_CONTAINER_IID]: {},
  [EFFECT_ADVANCED_CONTAINER_IID]: {
    ignoreTools: true
  },

  [EFFECT_DELAY_IID]: {},
  [EFFECT_COOLDOWN_IID]: {},

  [RELATION_ADD_IID]: {
    previewText: 'Add Relationship',
    name: 'Add Relationship Button',
    leftClickAction: 'Add Relationship',
    leftClickIcon: 'faPlus',
    interfaceGroupId: RELATION_IGID
  }, 
  [RELATION_SELECT_IID]: {},
  [RELATION_CONTAINER_IID]: {
    // ignoreTools: true

  }, 

}