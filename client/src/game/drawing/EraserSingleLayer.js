import Phaser, { BlendModes } from "phaser";
import { DEFAULT_TEXTURE_ID, UI_CANVAS_DEPTH } from "../constants";
import { getCanvasIdFromEraserId, getDepthFromEraserId, snapFreeXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";
import { getThemePrimaryColor } from "../../utils/webPageUtils";

export class EraserSingleLayer extends Brush {
  constructor(scene, { brushId }){
    const depth = scene.getDepthFromEraserId(brushId)
    super(scene, { brushId, textureId: DEFAULT_TEXTURE_ID, depth })

    this.setBlendMode(BlendModes.ERASE)

    this.border = scene.add.graphics();
    this.border.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    this.border.strokeRect(0, 0, this.width, this.height);
    this.border.setDepth(UI_CANVAS_DEPTH - 1)

    this.isEraser = true
    this.snapMethod = snapFreeXY

    this.lastUpdateX = null
    this.lastUpdateY = null
    
    return this
  }

  update(pointer) {
    super.update(pointer)

    this.border.setPosition(this.x, this.y)
  }

  destroy() {
    super.destroy()
    this.border.destroy()
  }

  getCanvasId() {
    return getCanvasIdFromEraserId(this.brushId)
  }
}

