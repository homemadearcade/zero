import { 
  DERIVED_AUTOGENERATION_IID, 
  EFFECT_LIST_IID, 
  EVENT_LIST_IID, 
  IS_DATA_REMOVED_IID, 
  RELATION_LIST_IID, 
  RELATION_TAG_LIST_IID, 
  SELECT_ENTITY_MODEL_IID, SELECT_RELATION_TAG_IID,
   DERIVED_DEFAULT_SYSTEM_IID, DERIVED_ENTITY_MODEL_IID,
    DERIVED_INTERFACE_ACTION_IID,
    EVENT_ADD_RELATION_TAG_A_IID,
    EVENT_ADD_RELATION_TAG_B_IID,
    ENTITY_RELATION_TAGS_IID,
    PROJECTILE_ENTITY_SELECTOR_IID,
    RELATION_ENTITY_MODEL_IID,
    RELATION_SPAWN_ENTITY_MODEL_IID,
    RELATION_SPAWN_ZONE_ENTITY_IID,
    ENTITY_SPAWN_ZONE_ENTITY_IID,
    STAGE_CUSTOMIZE_IID,
    STAGE_SPAWN_ZONE_SELECT_IID,
    SELECT_SPEAKER_ENTITY_MODEL_IID,
    PROJECTILE_ENTITY_TARGET_SELECTOR_IID,
    EFFECT_REMOTE_IID
 } from "../../../constants/interfaceIds";
  
export const defaultSelectorClassDataSourceInvisibility = {
  [EFFECT_LIST_IID]: {
    [DERIVED_AUTOGENERATION_IID]: true,
    [DERIVED_DEFAULT_SYSTEM_IID]: true,
    [DERIVED_INTERFACE_ACTION_IID]: true,
    [IS_DATA_REMOVED_IID]: true,
  },
  [EVENT_LIST_IID]: {
    [DERIVED_AUTOGENERATION_IID]: true,
    [DERIVED_DEFAULT_SYSTEM_IID]: true,
    [IS_DATA_REMOVED_IID]: true,
  },
  [RELATION_TAG_LIST_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [DERIVED_ENTITY_MODEL_IID]: true,
    [IS_DATA_REMOVED_IID]: true,
  },
  [RELATION_LIST_IID]: {
    [DERIVED_AUTOGENERATION_IID]: true,
    [DERIVED_DEFAULT_SYSTEM_IID]: true,
    [IS_DATA_REMOVED_IID]: true,
  },


  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  // SELECT ENTITY MODEL
  //
  [SELECT_SPEAKER_ENTITY_MODEL_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [SELECT_ENTITY_MODEL_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [PROJECTILE_ENTITY_SELECTOR_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [PROJECTILE_ENTITY_TARGET_SELECTOR_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [RELATION_ENTITY_MODEL_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [RELATION_SPAWN_ENTITY_MODEL_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [RELATION_SPAWN_ZONE_ENTITY_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [ENTITY_SPAWN_ZONE_ENTITY_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [STAGE_SPAWN_ZONE_SELECT_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [STAGE_CUSTOMIZE_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },

  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  ///////////////////////////////////////////
  // RELATION TAGS
  //
  [EFFECT_REMOTE_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [SELECT_RELATION_TAG_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [ENTITY_RELATION_TAGS_IID]: {
    [DERIVED_AUTOGENERATION_IID]: false,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [EVENT_ADD_RELATION_TAG_A_IID]: {
    [DERIVED_AUTOGENERATION_IID]: true,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [DERIVED_ENTITY_MODEL_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
  [EVENT_ADD_RELATION_TAG_B_IID]: {
    [DERIVED_AUTOGENERATION_IID]: true,
    [DERIVED_DEFAULT_SYSTEM_IID]: false,
    [DERIVED_ENTITY_MODEL_IID]: false,
    [IS_DATA_REMOVED_IID]: true,
  },
}