import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromLayerId, snapBrushXY } from "../../utils/editor";

export class Pencil extends Phaser.GameObjects.Image {
  constructor(scene, brushId, brush){
    const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)
    super(scene, 0,0, spriteSheetName, spriteIndex)

    this.setOrigin(0, 0)
    this.brushId = brushId
    this.brush = brush
    this.lastSnapX = null 
    this.lastSnapY = null
    scene.add.existing(this)
    
    return this
  }

  update(pointer) {
    const brushSize = store.getState().editor.editorState.brushSize
    const nodeSize = store.getState().game.gameModel.world.nodeSize

    const { snappedX, snappedY } = snapBrushXY(pointer)
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize
    
    this.setPosition(snappedX, snappedY)
    this.setDisplaySize(newWidth, newHeight)
    this.setDepth(getDepthFromLayerId(this.brush.layerId))
  }

  stroke(pointer, layer) {
    const { snappedX, snappedY } = snapBrushXY(pointer)

    if(snappedX === this.lastSnapX && snappedY === this.lastSnapY) return

    this.lastSnapX = snappedX
    this.lastSnapY = snappedY
    layer.draw(this, snappedX, snappedY);
  }

  getLayerId() {
    return this.brush.layerId
  }
}

