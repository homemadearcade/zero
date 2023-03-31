import { DATA_SOURCE_GAME_MODEL, gameSize, LAYER_GROUP_ID_FOREGROUND } from "../core";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { LAYER_GROUP_ID_PLAYGROUND } from "../core";
import { FOREGROUND_LAYER_GROUP_DEPTH } from "../core";
import { BACKGROUND_LAYER_DEPTH } from "../core";
import { LAYER_GROUP_ID_BACKGROUND } from "../core";

export const defaultLayer = {
  layerId: null,
  textureId: null,
  hasCollisionBody: false,
  layerGroupId: null,
  width: gameSize,
  height: gameSize,
  dataSource: DATA_SOURCE_GAME_MODEL
}

export const layerGroupIdToDepth = {
  [LAYER_GROUP_ID_BACKGROUND] : BACKGROUND_LAYER_DEPTH,
  [LAYER_GROUP_ID_FOREGROUND] : FOREGROUND_LAYER_GROUP_DEPTH,
  [LAYER_GROUP_ID_PLAYGROUND] : PLAYGROUND_LAYER_GROUP_DEPTH
}