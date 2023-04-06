import Phaser from "phaser";
import { getDepthFromLayerId, getHexFromColorId, getLayerIdFromColorId, snapFreeXY } from "../../utils/editorUtils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { Brush } from "./Brush";

export class ColorPencil extends Brush {
  constructor(scene, { brushId }){

    const textureTint = getHexFromColorId(brushId)
    const depth = scene.getDepthFromLayerId(getLayerIdFromColorId(brushId))
    console.log(depth)
    super(scene, { brushId, textureTint, depth, textureId: DEFAULT_TEXTURE_ID })

    this.snapMethod = snapFreeXY

    return this
  }

  getLayerId() {
    return getLayerIdFromColorId(this.brushId)
  }
}

