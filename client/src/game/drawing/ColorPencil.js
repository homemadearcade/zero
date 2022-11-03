import Phaser from "phaser";
import { getDepthFromCanvasId, getHexFromColorId, getCanvasIdFromColorId, snapBrushXY } from "../../utils/editorUtils";
import { DEFAULT_TEXTURE_ID } from "../constants";
import { Brush } from "./Brush";

export class ColorPencil extends Brush {
  constructor(scene, { brushId }){

    const tint = getHexFromColorId(brushId)
    const depth = getDepthFromCanvasId(getCanvasIdFromColorId(brushId))

    super(scene, { brushId, tint, depth, textureId: DEFAULT_TEXTURE_ID })

    this.snapMethod = snapBrushXY

    return this
  }

  getCanvasId() {
    return getCanvasIdFromColorId(this.brushId)
  }
}

