import { LAYER_ID_PREFIX, PLAYGROUND_LAYER_ID } from "../core";
import { FOREGROUND_LAYER_ID } from "../core";
import { BACKGROUND_LAYER_ID } from "../core";

export const layerToDisplayName = {
  [LAYER_ID_PREFIX+BACKGROUND_LAYER_ID]: 'Background',
  [LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID]: 'Playground',
  [LAYER_ID_PREFIX+FOREGROUND_LAYER_ID]: 'Foreground',
}