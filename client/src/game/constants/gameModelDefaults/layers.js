import { BACKGROUND_LAYER_GROUP_IID, DATA_SOURCE_GAME_MODEL_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from "../../../constants/interfaceIds";
import { gameGridHeight, gameGridWidth, nodeSize, PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { FOREGROUND_LAYER_GROUP_DEPTH } from "../core";
import { BACKGROUND_LAYER_GROUP_DEPTH } from "../core";

export const defaultLayer = {
  layerId: null,
  textureId: null,
  initialTextureId: null,
  stageId: null,
  hasCollisionBody: false,
  layerGroupIID: null,
  width: nodeSize * gameGridWidth,
  height: nodeSize * gameGridHeight,
  dataSourceIID: DATA_SOURCE_GAME_MODEL_IID
}

export const layerGroupIIDToDepth = {
  [BACKGROUND_LAYER_GROUP_IID] : BACKGROUND_LAYER_GROUP_DEPTH,
  [FOREGROUND_LAYER_GROUP_IID] : FOREGROUND_LAYER_GROUP_DEPTH,
  [PLAYGROUND_LAYER_GROUP_IID] : PLAYGROUND_LAYER_GROUP_DEPTH
}

export const layerGroupIIDtoName = {
  [BACKGROUND_LAYER_GROUP_IID]: 'Background',
  [FOREGROUND_LAYER_GROUP_IID]: 'Foreground',
  [PLAYGROUND_LAYER_GROUP_IID]: 'Playground'
}

export const layerGroupIIDtoShortName = {
  [BACKGROUND_LAYER_GROUP_IID]: 'BG',
  [FOREGROUND_LAYER_GROUP_IID]: 'FG',
  [PLAYGROUND_LAYER_GROUP_IID]: 'PG'
}