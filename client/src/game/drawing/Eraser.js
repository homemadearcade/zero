import Phaser, { BlendModes } from "phaser";
import { BACKGROUND_LAYER_GROUP_DEPTH, 
  DEFAULT_TEXTURE_ID, 
  FOREGROUND_LAYER_GROUP_DEPTH, PLAYGROUND_LAYER_GROUP_DEPTH, 
   UI_LAYER_DEPTH } from "../constants";
import store from "../../store";
import { getLayerIdFromEraserId, 
   snapFreeXY } from "../../utils/editorUtils";
import { Brush } from "./Brush";
import { throttle } from "lodash";
import { getThemePrimaryColor } from "../../utils/webPageUtils";
import { BACKGROUND_LAYER_GROUP_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID } from "../../constants/interfaceIds";

export class Eraser extends Brush {
  constructor(scene, { brushId }){
    const depth = scene.getDepthFromEraserId(brushId)
    super(scene, { brushId, textureId: DEFAULT_TEXTURE_ID, depth })

    this.lowerLayerPreviews = []
    this.lowerInstancePreviews = []
    this.createPreviewLayers()
    this.createLowerInstancePreviews()
    this.setBlendMode(BlendModes.ERASE)

    this.border = scene.add.graphics();
    this.border.lineStyle(4, getThemePrimaryColor().hexCode, 1);
    this.border.strokeRect(0, 0, this.width, this.height);
    this.border.setDepth(UI_LAYER_DEPTH)

    this.isEraser = true
    this.snapMethod = snapFreeXY

    this.lastUpdateX = null
    this.lastUpdateY = null
    
    return this
  }

  update(pointer) {
    super.update(pointer)

    this.border.setPosition(this.x, this.y)

    if(this.x === this.lastUpdateX && this.y === this.lastUpdateY) return

    this.throttledUpdatePreviews()
  }

  updatePreviews() {
    this.lastTime = Date.now()

    this.lastUpdateX = this.x
    this.lastUpdateY = this.y

    const borderSize = 0

    this.lowerLayerPreviews.forEach((preview, index) => {
      preview.setCrop(this.x - borderSize, this.y - borderSize, this.width + (borderSize * 2), this.height + (borderSize * 2))
    })
    if(this.lowerInstancePreviews.length) {
      this.lowerInstancePreviews.forEach((preview) => {
        preview.destroy()
      })
      this.lowerInstancePreviews = this.createLowerInstancePreviews()
      this.lowerInstancePreviews.forEach((preview) => {
        this.scene.add.existing(preview)
        preview.setCrop(this.x - borderSize, this.y - borderSize, this.width + (borderSize * 2), this.height + (borderSize * 2))
      })
    }
  }

  createLowerInstancePreviews = ()  => {
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stage = gameModel.stages[this.scene.stage.stageId]
    const previewWidth = stage.boundaries.maxWidth
    const previewHeight = stage.boundaries.maxHeight

    return [
      new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.entityInstanceGroup, 0, 0).setDepth(FOREGROUND_LAYER_GROUP_DEPTH + 5),
    ]
  }

  throttledUpdatePreviews = throttle(this.updatePreviews, 100)

  createPreviewLayers() {
    const gameModel = this.scene.getGameModel()
    const stage = this.scene.getCurrentStage()
    const eraserLayerId = getLayerIdFromEraserId(this.brushId)
    const eraserLayerGroupId = gameModel.layers[eraserLayerId].layerGroupIID

    const previewWidth = stage.boundaries.maxWidth
    const previewHeight = stage.boundaries.maxHeight

    this.lowerLayerPreviews = []

    if(eraserLayerGroupId === BACKGROUND_LAYER_GROUP_IID) {
      const colorLayer = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.stage.colorLayer, 0, 0).setDepth(BACKGROUND_LAYER_GROUP_DEPTH + 5)
      this.lowerLayerPreviews.push(colorLayer)
    } else if(eraserLayerGroupId === PLAYGROUND_LAYER_GROUP_IID) {
      const colorLayer = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.stage.colorLayer, 0, 0).setDepth(PLAYGROUND_LAYER_GROUP_DEPTH + 5)
      const backgroundPreview = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).setDepth(PLAYGROUND_LAYER_GROUP_DEPTH + 5)
      this.scene.drawVisibleLayerGroupToRenderTexture(BACKGROUND_LAYER_GROUP_IID, backgroundPreview)
      this.lowerLayerPreviews.push(
        colorLayer,
        backgroundPreview
      )
      this.lowerInstancePreviews = this.createLowerInstancePreviews()
    } else if(eraserLayerGroupId === FOREGROUND_LAYER_GROUP_IID) {
      const colorLayer = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).draw(this.scene.stage.colorLayer, 0, 0).setDepth(FOREGROUND_LAYER_GROUP_DEPTH + 5)
      const backgroundPreview = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).setDepth(FOREGROUND_LAYER_GROUP_DEPTH + 5)
      this.scene.drawVisibleLayerGroupToRenderTexture(BACKGROUND_LAYER_GROUP_IID, backgroundPreview)
      const playgroundPreview = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, previewWidth, previewHeight).setDepth(FOREGROUND_LAYER_GROUP_DEPTH + 5)
      this.scene.drawVisibleLayerGroupToRenderTexture(PLAYGROUND_LAYER_GROUP_IID, playgroundPreview)
      this.lowerLayerPreviews.push(
        colorLayer,
        backgroundPreview,
        playgroundPreview
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
    this.lowerInstancePreviews.forEach((preview) => {
      preview.destroy()
    })
  }

  getLayerId() {
    return getLayerIdFromEraserId(this.brushId)
  }
}

