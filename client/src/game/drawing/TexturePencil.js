import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromCanvasId, snapBrushXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";

export class TexturePencil extends Brush {
  constructor(scene, {brushId}){
    const gameModel = store.getState().game.gameModel
    const brush = gameModel.brushes[brushId]
    const depth = getDepthFromCanvasId(brush.canvasId)
    const tint = brush.tint

    const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)

    super(scene, {brushId, depth, tint, spriteSheetName, spriteIndex})

    this.snapMethod = snapBrushXY

    return this
  }

  getCanvasId() {
    const gameModel = store.getState().game.gameModel
    const brush = gameModel.brushes[this.brushId]
    return brush.canvasId
  }
}

