import Phaser from "phaser";
import { getDepthFromLayerCanvasId, getHexFromColorId, getCanvasIdFromColorId, snapFreeXY } from "../../utils/editorUtils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { Brush } from "./Brush";

export class ColorPencil extends Brush {
  constructor(scene, { brushId }){

    const textureTint = getHexFromColorId(brushId)
    console.log(getCanvasIdFromColorId(brushId))
    const depth = scene.getDepthFromLayerCanvasId(getCanvasIdFromColorId(brushId))
    console.log(depth)
    super(scene, { brushId, textureTint, depth, textureId: DEFAULT_TEXTURE_ID })

    this.snapMethod = snapFreeXY

    return this
  }

  getCanvasId() {
    return getCanvasIdFromColorId(this.brushId)
  }
}

