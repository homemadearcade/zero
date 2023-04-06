import { BACKGROUND_LAYER_GROUP_IID, DATA_SOURCE_GAME_MODEL_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from "../../../constants/interfaceIds";
import {  gameHeight, gameWidth } from "../core";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { FOREGROUND_LAYER_GROUP_DEPTH } from "../core";
import { BACKGROUND_LAYER_GROUP_DEPTH } from "../core";

export const defaultLayer = {
  layerId: null,
  textureId: null,
  hasCollisionBody: false,
  layerGroupIID: null,
  width: gameWidth,
  height: gameHeight,
  dataSourceIID: DATA_SOURCE_GAME_MODEL_IID
}

export const layerGroupIIDToDepth = {
  [BACKGROUND_LAYER_GROUP_IID] : BACKGROUND_LAYER_GROUP_DEPTH,
  [FOREGROUND_LAYER_GROUP_IID] : FOREGROUND_LAYER_GROUP_DEPTH,
  [PLAYGROUND_LAYER_GROUP_IID] : PLAYGROUND_LAYER_GROUP_DEPTH
}