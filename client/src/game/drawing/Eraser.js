import Phaser, { BlendModes } from "phaser";
import { DEFAULT_TEXTURE_ID, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH } from "../constants";
import store from "../../store";
import { getCanvasIdFromEraserId, getDepthFromEraserId, snapEraserXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";

export class Eraser extends Brush {
  constructor(scene, { brushId }){
    const depth = getDepthFromEraserId(brushId)
    super(scene, { brushId, textureId: DEFAULT_TEXTURE_ID, depth })

    this.createPreviewLayers()
    this.setBlendMode(BlendModes.ERASE)

    this.border = scene.add.graphics();
    this.border.lineStyle(4, 0xffffff, 1);
    this.border.strokeRect(0, 0, this.width, this.height);
    scene.uiLayer.add(this.border)

    this.isEraser = true
    this.snapMethod = snapEraserXY

    this.lastUpdateX = null
    this.lastUpdateY = null
    
    return this
  }

  update(pointer) {
    super.update(pointer)

    this.border.setPosition(this.x, this.y)

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
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stage = gameModel.stages[this.scene.stage.id]
    const previewWidth = stage.boundaries.maxWidth
    const previewHeight = stage.boundaries.maxHeight

    return [
      new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.objectInstanceGroup, 0, 0).setDepth(FOREGROUND_CANVAS_DEPTH + 5),
      new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.playerInstanceGroup, 0, 0).setDepth(FOREGROUND_CANVAS_DEPTH + 5)    
    ]
  }

  createPreviewLayers() {
    this.lowerLayerPreviews = []
    this.lowerInstancePreviews = []

    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stage = gameModel.stages[this.scene.stage.id]
    const eraserLayerId = getCanvasIdFromEraserId(this.brushId)
    const previewWidth = stage.boundaries.maxWidth
    const previewHeight = stage.boundaries.maxHeight

    if(eraserLayerId === PLAYGROUND_CANVAS_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(PLAYGROUND_CANVAS_DEPTH + 5)
      )
    } else if(eraserLayerId === FOREGROUND_CANVAS_ID) {
      this.lowerLayerPreviews.push(
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.backgroundLayer, 0, 0).setDepth(FOREGROUND_CANVAS_DEPTH + 5),
        new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.playgroundLayer, 0, 0).setDepth(FOREGROUND_CANVAS_DEPTH + 5),
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
    this.border.destroy()
    this.lowerLayerPreviews.forEach((preview) => {
      preview.destroy()
    })
  }

  getCanvasId() {
    return getCanvasIdFromEraserId(this.brushId)
  }
}

