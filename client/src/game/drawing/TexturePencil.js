import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromLayerCanvasId, snapFreeXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";

export class TexturePencil extends Brush {
  constructor(scene, {brushId}){
    const gameModel = store.getState().gameModel.gameModel
    const brush = gameModel.brushes[brushId]
    const depth = getDepthFromLayerCanvasId(brush.layerCanvasId)
    const textureTint = brush.textureTint

    const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)

    super(scene, {brushId, depth, textureTint, spriteSheetName, spriteIndex, textureId: brush.textureId})

    this.snapMethod = snapFreeXY

    return this
  }

  getCanvasId() {
    const gameModel = store.getState().gameModel.gameModel
    const brush = gameModel.brushes[this.brushId]
    return brush.layerCanvasId
  }
}

