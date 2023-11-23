import { DERIVED_AUTOGENERATION_IID, DERIVED_ENTITY_MODEL_IID, NOT_DERIVED_IID, IS_DATA_HIDDEN_IID, IS_DATA_REMOVED_IID, DERIVED_DEFAULT_SYSTEM_IID, DERIVED_INTERFACE_ACTION_IID } from "../../../constants/interfaceIds";

// autogeneated maybe can be called Preset or Created Automatically
export const dataSourceIIDToDisplayName = {
  [DERIVED_AUTOGENERATION_IID]: 'Autogeneration',
  [NOT_DERIVED_IID]: 'This Game',
  [DERIVED_ENTITY_MODEL_IID]: 'Class',
  [DERIVED_DEFAULT_SYSTEM_IID]: 'Default',
  [DERIVED_INTERFACE_ACTION_IID]: 'Interface',
  [IS_DATA_HIDDEN_IID]: 'Hidden',
  [IS_DATA_REMOVED_IID]: 'Removed',
}

export const dataSourceIIDToIcon = {
  [DERIVED_AUTOGENERATION_IID]: 'faWandMagicSparkles',
  [DERIVED_ENTITY_MODEL_IID]: 'faChessPawn',
  [DERIVED_DEFAULT_SYSTEM_IID]: 'faRobot',
  [DERIVED_INTERFACE_ACTION_IID]: 'faArrowPointer',
  [IS_DATA_HIDDEN_IID]: 'faEyeSlash',
  [IS_DATA_REMOVED_IID]: 'faSquareMinus',
  [NOT_DERIVED_IID]: 'faGamepad'
}


