import { DATA_SOURCE_GAME_MODEL_IID  } from "../../../../constants/interfaceIds";
import { gameGridHeight, gameGridWidth, nodeSize  } from "../../core";

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