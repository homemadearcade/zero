import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromLayerId, snapBrushXY } from "../../utils/editor";
import { getCobrowsingState } from "../../utils/cobrowsing";

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

    const brushSize = getCobrowsingState().editor.brushSize
    const nodeSize = store.getState().game.gameModel.world.nodeSize
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize

    this.setDisplaySize(newWidth, newHeight)
    this.setDepth(getDepthFromLayerId(this.brush.layerId))
    
    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapBrushXY(pointer)
    this.setPosition(snappedX, snappedY)
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

