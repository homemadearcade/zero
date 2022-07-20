import Phaser from "phaser";
import { getTextureMetadata } from "../../utils/utils";
import store from "../../store";
import { getDepthFromLayerId } from "../../utils/editor";

export class Pencil extends Phaser.GameObjects.Image {
  constructor(scene, brushId, brush){
    const { spriteSheetName, spriteIndex } = getTextureMetadata(brush.textureId)
    super(scene, 0,0, spriteSheetName, spriteIndex)

    this.setOrigin(0, 0)
    this.brushId = brushId
    this.brush = brush
    scene.add.existing(this)
    
    return this
  }

  update(pointer) {
    const brushSize = store.getState().editor.editorState.brushSize
    const nodeSize = store.getState().game.gameModel.world.nodeSize

    const { snappedX, snappedY } = this.getSnapXY(pointer)
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize
    
    this.setPosition(snappedX, snappedY)
    this.setDisplaySize(newWidth, newHeight)
    this.setDepth(getDepthFromLayerId(this.brush.layerId))
  }

  getSnapXY({x, y}) {
    const gameModel = store.getState().game.gameModel
    const nodeSize = gameModel.world.nodeSize
    const brushSize = store.getState().editor.editorState.brushSize
    const blockSize = nodeSize * brushSize

    const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x - (blockSize/2), blockSize), 0, gameModel.world.boundaries.width)
    const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y - (blockSize/2), blockSize), 0, gameModel.world.boundaries.height)

    return {
      snappedX,
      snappedY
    }
  }

  stroke(pointer, layer) {
    const { snappedX, snappedY } = this.getSnapXY(pointer)
    layer.draw(this, snappedX, snappedY);
  }

  getLayerId() {
    return this.brush.layerId
  }
}

