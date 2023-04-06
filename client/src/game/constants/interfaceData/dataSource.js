import { DATA_SOURCE_AUTOGENERATED_IID, DATA_SOURCE_IMPORTED_GAME_MODE_IID, DATA_SOURCE_ENTITY_MODEL_IID, DATA_SOURCE_GAME_MODEL_IID, IS_DATA_HIDDEN_IID, IS_DATA_REMOVED_IID, DATA_SOURCE_SYSTEM_IID } from "../../../constants/interfaceIds";

// autogeneated maybe can be called Preset or Created Automatically
export const dataSourceIIDToDisplayName = {
  [DATA_SOURCE_AUTOGENERATED_IID]: 'Autogenerated',
  [DATA_SOURCE_IMPORTED_GAME_MODE_IID]: 'Library',
  [DATA_SOURCE_GAME_MODEL_IID]: 'This Game',
  [DATA_SOURCE_ENTITY_MODEL_IID]: 'Class',
  [DATA_SOURCE_SYSTEM_IID]: 'System',
  [IS_DATA_HIDDEN_IID]: 'Hidden',
  [IS_DATA_REMOVED_IID]: 'Removed',
}

export const dataSourceIIDToIcon = {
  [DATA_SOURCE_IMPORTED_GAME_MODE_IID]: 'faBookAtlas',
  [DATA_SOURCE_AUTOGENERATED_IID]: 'faWandMagicSparkles',
  [DATA_SOURCE_ENTITY_MODEL_IID]: 'faChessPawn',
  [DATA_SOURCE_SYSTEM_IID]: 'faRobot',
  [IS_DATA_HIDDEN_IID]: 'faEyeSlash',
  [IS_DATA_REMOVED_IID]: 'faTrash',
  [DATA_SOURCE_GAME_MODEL_IID]: 'faGamepad'
}


