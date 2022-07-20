import Phaser, { BlendModes } from "phaser";
import { OVERHEAD_LAYER_DEPTH, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_DEPTH, PLAYGROUND_LAYER_ID, UI_LAYER_DEPTH } from "../../constants";
import store from "../../store";
import { getCobrowsingState } from "../../utils/cobrowsing";
import { getLayerIdFromEraserId, getDepthFromEraserId, snapBrushXY } from "../../utils/editor";

export class Eraser extends Phaser.GameObjects.Image {
  constructor(scene, brushId){
    super(scene, 0,0, 'square10x10')

    this.scene = scene
    this.brushId = brushId
    this.createPreviewLayers()
    this.setBlendMode(BlendModes.ERASE)
    this.setOrigin(0, 0)
    this.scene.add.existing(this)

    const nodeSize = store.getState().game.gameModel.world.nodeSize
    const brushSize = getCobrowsingState().editorState.brushSize
    this.width = nodeSize * brushSize
    this.height = nodeSize * brushSize
    this.setDisplaySize(this.width, this.height)

    this.outline = scene.add.graphics();
    this.outline.lineStyle(3, 0xffffff, 1);
    this.outline.strokeRect(0, 0, this.width, this.height);
    this.outline.setDepth(UI_LAYER_DEPTH)
    
    return this
  }

  update(pointer) {
    const { snappedX, snappedY } = snapBrushXY(pointer)

    this.outline.setPosition(snappedX, snappedY)

    this.setPosition(snappedX, snappedY)
    
    const eraserDepth = getDepthFromEraserId(this.brushId)
    this.setDepth(eraserDepth)
    
    this.lowerLayerPreviews.forEach((preview) => {
      preview.setCrop(snappedX, snappedY, this.width, this.height)
    })
  }

  stroke(pointer, layer) {
    const { snappedX, snappedY } = snapBrushXY(pointer)
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
    this.outline.destroy()
    this.lowerLayerPreviews.forEach((preview) => {
      preview.destroy()
    })
  }

  getLayerId() {
    return getLayerIdFromEraserId(this.brushId)
  }
}

