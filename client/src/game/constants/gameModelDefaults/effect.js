/////////////////////////////////////
/////////////////////////////////////

import { DATA_SOURCE_GAME_MODEL_IID } from "../../../constants/interfaceIds";

// WHAT HAPPENS
export const defaultEffect = {
  effectBehavior: '',
  effectId: null,

  remoteEffectedRelationTagIds: [],

  stageId: null,
  spawnEntityModelId: null,
  entityModelId: null,
  arcadeGameMongoId: null,
  zoneEntityModelId: null,
  cutsceneId: null,
  text: '',
  
  dataSourceId: DATA_SOURCE_GAME_MODEL_IID,
  isRemoved: false,
  isReadOnly: false,

  customSelectorCategory: null
}

