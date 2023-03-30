import { LAYER_ID_PREFIX } from "..";
import { LAYER_GROUP_ID_FOREGROUND } from "../core";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { PLAYGROUND_LAYER_ID } from "../core";
import { FOREGROUND_LAYER_ID } from "../core";
import { BACKGROUND_LAYER_ID } from "../core";
import { LAYER_GROUP_ID_PLAYGROUND } from "../core";
import { FOREGROUND_LAYER_GROUP_DEPTH } from "../core";
import { BACKGROUND_LAYER_DEPTH } from "../core";
import { LAYER_GROUP_ID_BACKGROUND } from "../core";

export const defaultLayer = {
  layerId: null,
  textureId: null,
  hasCollisionBody: false,
  layerGroupId: null
}

export const layerGroupIdToDepth = {
  [LAYER_GROUP_ID_BACKGROUND] : BACKGROUND_LAYER_DEPTH,
  [LAYER_GROUP_ID_FOREGROUND] : FOREGROUND_LAYER_GROUP_DEPTH,
  [LAYER_GROUP_ID_PLAYGROUND] : PLAYGROUND_LAYER_GROUP_DEPTH
}

export const layerToDisplayName = {
  [LAYER_ID_PREFIX+BACKGROUND_LAYER_ID]: 'Background',
  [LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID]: 'Playground',
  [LAYER_ID_PREFIX+FOREGROUND_LAYER_ID]: 'Foreground',
}