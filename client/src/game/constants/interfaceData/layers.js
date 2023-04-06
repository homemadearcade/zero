import { LAYER_DID, PLAYGROUND_LAYER_ID } from "../core";
import { FOREGROUND_LAYER_ID } from "../core";
import { BACKGROUND_LAYER_ID } from "../core";

export const layerToDisplayName = {
  [LAYER_DID+BACKGROUND_LAYER_ID]: 'Background',
  [LAYER_DID+PLAYGROUND_LAYER_ID]: 'Playground',
  [LAYER_DID+FOREGROUND_LAYER_ID]: 'Foreground',
}