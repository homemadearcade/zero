import { NOT_DERIVED_IID  } from "../../../../constants/interfaceIds";
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
  dataSourceIID: NOT_DERIVED_IID
}