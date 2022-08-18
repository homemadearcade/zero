import Phaser, { BlendModes } from "phaser";
import { DEFAULT_TEXTURE_ID, OVERHEAD_CANVAS_DEPTH, OVERHEAD_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH } from "../../constants";
import store from "../../store";
import { getCanvasIdFromEraserId, getDepthFromEraserId, snapEraserXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";

export class Eraser extends Brush {
  constructor(scene, { brushId }){
    const depth = getDepthFromEraserId(brushId)
    super(scene, { brushId, textureId: DEFAULT_TEXTURE_ID, depth })

    this.createPreviewLayers()
    this.setBlendMode(BlendModes.ERASE)

    this.outline = scene.add.graphics();
    this.outline.lineStyle(4, 0xffffff, 1);
    this.outline.strokeRect(0, 0, this.width, this.height);
    scene.uiLayer.add(this.outline)

    this.isEraser = true
    this.snapMethod = snapEraserXY

    this.lastUpdateX = null
    this.lastUpdateY = null
    
    return this
  }

  update(pointer) {
    super.update(pointer)

    this.outline.setPosition(this.x, this.y)

    if(this.x === this.lastUpdateX && this.y === this.lastUpdateY) return
    
    this.lastUpdateX = this.x
    this.lastUpdateY = this.y

    this.lowerLayerPreviews.forEach((preview) => {
      preview.setCrop(this.x, this.y, this.width, this.height)
    })
    if(this.lowerInstancePreviews.length) {
      this.lowerInstancePreviews.forEach((preview) => {
        preview.destroy()
      })
      this.lowerInstancePreviews = this.createLowerInstancePreviews()
      this.lowerInstancePreviews.forEach((preview) => {
        this.scene.add.existing(preview)
        preview.setCrop(this.x, this.y, this.width, this.height)
      })
    }
  }

  createLowerInstancePreviews() {
    const gameModel = store.getState().game.gameModel
    const previewWidth = gameModel.world.boundaries.width
    const previewHeight = gameModel.world.boundaries.height

    return [
      new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.objectInstanceGroup, 0, 0).setDepth(OVERHEAD_CANVAS_DEPTH + 5),
      new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.playerInstanceGroup, 0, 0).setDepth(OVERHEAD_CANVAS_DEPTH + 5)    
    ]
  }

  createPreviewLayers() {
    this.lowerLayerPreviews = []
    this.lowerInstancePreviews = []

    const gameModel = store.getState().game.gameModel
    const eraserLayerId = getCanvasIdFromEraserId(this.brushId)
    const previewWidth = gameModel.world.boundaries.width
    const previewHeight = gameModel.world.boundaries.height

    if(eraserLayerId === PLAYGROUND_CANVAS_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(PLAYGROUND_CANVAS_DEPTH + 5)
      )
    } else if(eraserLayerId === OVERHEAD_CANVAS_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(OVERHEAD_CANVAS_DEPTH + 5),
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.playgroundLayer, 0, 0).setDepth(OVERHEAD_CANVAS_DEPTH + 5),
      )
      this.lowerInstancePreviews = this.createLowerInstancePreviews()
    }

    this.lowerLayerPreviews.forEach((preview) => {
      this.scene.add.existing(preview)
    })
    this.lowerInstancePreviews.forEach((preview) => {
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

  getCanvasId() {
    return getCanvasIdFromEraserId(this.brushId)
  }
}

