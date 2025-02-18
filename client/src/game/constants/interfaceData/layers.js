import { BACKGROUND_LAYER_GROUP_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from "../../../constants/interfaceIds";
import {  PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { FOREGROUND_LAYER_GROUP_DEPTH } from "../core";
import { BACKGROUND_LAYER_GROUP_DEPTH } from "../core";

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