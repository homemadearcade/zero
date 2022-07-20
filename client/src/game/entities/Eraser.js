import Phaser, { BlendModes } from "phaser";
import { OVERHEAD_LAYER_DEPTH, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_DEPTH, PLAYGROUND_LAYER_ID } from "../../constants";
import store from "../../store";
import { getLayerIdFromEraserId, getDepthFromEraserId } from "../../utils/editor";

export class Eraser extends Phaser.GameObjects.Image {
  constructor(scene, brushId){
    super(scene, 0,0, 'square10x10')

    this.scene = scene
    this.brushId = brushId
    this.createPreviewLayers()
    this.setBlendMode(BlendModes.ERASE)
    this.setOrigin(0, 0)
    this.scene.add.existing(this)
    
    return this
  }

  update(pointer) {
    const nodeSize = store.getState().game.gameModel.world.nodeSize
    const brushSize = store.getState().editor.editorState.brushSize

    const { snappedX, snappedY } = this.getSnapXY(pointer)
    const newWidth = nodeSize * brushSize
    const newHeight = nodeSize * brushSize
    this.setPosition(snappedX, snappedY)
    this.setDisplaySize(newWidth, newHeight)
    
    const eraserDepth = getDepthFromEraserId(this.brushId)
    this.setDepth(eraserDepth)
    
    this.lowerLayerPreviews.forEach((preview) => {
      preview.setCrop(snappedX, snappedY, newWidth, newHeight)
    })
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
    layer.erase(this, snappedX, snappedY);
  }

  createPreviewLayers() {
    this.lowerLayerPreviews = []

    const gameModel = store.getState().game.gameModel
    const eraserLayerId = getLayerIdFromEraserId(this.brushId)
    const previewWidth = gameModel.world.boundaries.width
    const previewHeight = gameModel.world.boundaries.height

    if(eraserLayerId === PLAYGROUND_LAYER_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(PLAYGROUND_LAYER_DEPTH + 5)
      )
    } else if(eraserLayerId === OVERHEAD_LAYER_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(OVERHEAD_LAYER_DEPTH + 5),
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.playgroundLayer, 0, 0).setDepth(OVERHEAD_LAYER_DEPTH + 5)
      )
    }

    this.lowerLayerPreviews.forEach((preview) => {
      this.scene.add.existing(preview)
    })
  }


  destroy() {
    super.destroy()
    this.lowerLayerPreviews.forEach((preview) => {
      preview.destroy()
    })
  }

  getLayerId() {
    return getLayerIdFromEraserId(this.brushId)
  }
}

