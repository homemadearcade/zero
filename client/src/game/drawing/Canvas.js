import Phaser from "phaser";
import store from "../../store";
import { getImageUrlFromTextureId, urlToFile } from "../../utils/utils";
import _, { initial } from "lodash";
import { CANVAS_IMAGE_LAYER_ID, UNDO_MEMORY_MAX } from "../constants";
import { editCanvasImage, uploadCanvasImageAndAddToGameModel } from "../../store/actions/media/canvasImageActions";
import { MARK_CANVAS_IMAGE_UNSAVED } from "../../store/types";
import { IMAGE_TYPE_CANVAS } from "../../constants";

window.instanceUndoStack = []
window.imageCanvasUndoStack = []

export class Canvas extends Phaser.GameObjects.RenderTexture {
  constructor(scene, { textureId, boundaries, autoSave, layerGroupIID, layerId }){
    super(scene, 0, 0, boundaries.maxWidth, boundaries.maxHeight)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = textureId
    this.layerGroupIID = layerGroupIID
    this.layerId = layerId
    this.canvasImageMongoId = null
    this.setOrigin(0, 0)

    this.initialDraw()

    this.previousRenderTexture = null
    this.undoCanvasStack = []
    this.boundaries = boundaries

    this.autoSave = autoSave

    return this
  }

  rotate() {
    const renderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
    renderTexture.setOrigin(0, 0)
    renderTexture.draw(this, 0,0)
    this.camera.setAngle(90);
    this.clear()
    super.draw(renderTexture, 0, 0)
    this.camera.setAngle(0)
    this.save()
  }

  flipHorizontal () {
    const renderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
    renderTexture.setOrigin(0, 0)
    renderTexture.draw(this, 0,0)
    renderTexture.flipX = !renderTexture.flipX
    this.clear()
    super.draw(renderTexture, 0, 0)
    this.save()
  }

  flipVertical () {
    const renderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
    renderTexture.setOrigin(0, 0)
    renderTexture.draw(this, 0,0)
    renderTexture.flipY = !renderTexture.flipY
    this.clear()
    super.draw(renderTexture, 0, 0)
    this.save()
  }

  save = async ()  => {
    return new Promise(async (resolve, reject) => {
      try {
        if(!this.isCodrawingHost) reject('not codrawing host')
        if(!this.strokeHistory.length) reject('no stroke history')
        const textureId = this.textureId
        const { bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)

        if(this.canvasImageMongoId) {
          store.dispatch(editCanvasImage(this.canvasImageMongoId, {
            strokeHistory: [],
            initialTextureId: null
          }))
        }
        this.strokeHistory = []
        const imageFile = await urlToFile(bufferCanvas.toDataURL(), textureId, 'image/png')
        if(!this.strokeHistory.length) this.markSaved()

        const arcadeGameMongoId = store.getState().gameModel.gameModel.id
        await store.dispatch(uploadCanvasImageAndAddToGameModel({imageFile, arcadeGameMongoId, textureId, imageType: this.imageType || IMAGE_TYPE_CANVAS}))

        resolve(textureId)
      } catch(e) {
        reject(e)
      }
    })
  }

  debouncedSave = _.debounce(this.save, 6000);

  updateTexture = (options) => {
    this.scene.textures.remove(this.textureId)
    this.scene.load.image(this.textureId, getImageUrlFromTextureId(this.textureId));
    this.scene.load.once('complete', () => {

      // //sometimes this bugs out
      // this.clear()
      // this.initialDraw()

      if(options?.callback) {
        options.callback()
      }
    });
    this.scene.load.start();
  }

  getBufferCanvasFromRenderTexture = (renderTexture) => {
    return new Promise((resolve, reject) => {
      renderTexture.snapshot(async (imageData) => {
        try {
          const bufferCanvas = document.createElement('canvas')
          bufferCanvas.width = this.boundaries.maxWidth
          bufferCanvas.height = this.boundaries.maxHeight
          const bufferCanvasContext = bufferCanvas.getContext('2d')
          bufferCanvasContext.drawImage(imageData, 0,  0, bufferCanvas.width, bufferCanvas.height)
    
          resolve({ bufferCanvas, bufferCanvasContext })
        } catch(e) {
          console.error(e)
          reject(e)
        }
      })
    })
  }

  storeCanvasForUndoStack() {
    if(!this.previousRenderTexture) {
      this.previousRenderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
      this.previousRenderTexture.draw(this, 0,0)
      if(this.textureId.indexOf(CANVAS_IMAGE_LAYER_ID) > -1) {
        window.imageCanvasUndoStack.push(this.textureId)
        window.imageCanvasUndoStack = window.imageCanvasUndoStack.slice(-UNDO_MEMORY_MAX)
      } else {
        window.instanceUndoStack.push(this.textureId)
        window.instanceUndoStack = window.instanceUndoStack.slice(-UNDO_MEMORY_MAX)
      }
    }
  }

  addCanvasToUndoStack() {
    this.undoCanvasStack.push(this.previousRenderTexture)
    this.undoCanvasStack = this.undoCanvasStack.slice(-UNDO_MEMORY_MAX)
    this.previousRenderTexture = null
  }

  undo() {
    const canvas = this.undoCanvasStack.pop()
    this.clear()
    super.draw(canvas, 0,0)
    if(this.textureId.indexOf(CANVAS_IMAGE_LAYER_ID) === -1) {
      this.debouncedSave()
    }
  }

  markSaved() {
    this.unsavedChanges = false
    store.dispatch({
      type: MARK_CANVAS_IMAGE_UNSAVED,
      payload: {
        textureId: this.textureId,
        unsaved: false
      }
    })
  }

  markUnsaved() {
    this.unsavedChanges = true
    store.dispatch({
      type: MARK_CANVAS_IMAGE_UNSAVED,
      payload: {
        textureId: this.textureId,
        unsaved: true
      }
    })
  }

  draw(entries, x, y) {
    this.storeCanvasForUndoStack()
    super.draw(entries, x, y)
  }

  erase(entries, x, y) {
    this.storeCanvasForUndoStack()
    super.erase(entries, x, y)
  }

  onStrokeReleased() {
    this.addCanvasToUndoStack()
    if(this.autoSave) this.debouncedSave()
  }

  initialDraw() {
    if(this.scene.textures.exists(this.textureId)) {
      super.draw(this.textureId, 0, 0)
    }
  }
}

