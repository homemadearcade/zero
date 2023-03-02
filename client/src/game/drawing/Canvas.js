import Phaser from "phaser";
import store from "../../store";
import { urlToFile } from "../../utils/utils";
import _ from "lodash";
import { SPRITE_EDITOR_CANVAS_ID, UNDO_MEMORY_MAX } from "../constants";
import { editTexture, saveTexture } from "../../store/actions/textureActions";
import { MARK_TEXTURE_UNSAVED } from "../../store/types";

window.instanceUndoStack = []
window.spriteEditorUndoStack = []

export class Canvas extends Phaser.GameObjects.RenderTexture {
  constructor(scene, { textureId, boundaries, autoSave }){
    super(scene, 0, 0, boundaries.maxWidth, boundaries.maxHeight)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = textureId
    this.textureIdMongo = null

    this.initialDraw()

    this.previousRenderTexture = null
    this.undoTextureStack = []
    this.boundaries = boundaries

    this.autoSave = autoSave

    return this
  }

  rotate() {
    const renderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
    renderTexture.draw(this, 0,0)
    this.camera.setAngle(90);
    this.clear()
    super.draw(renderTexture, 0, 0)
    this.camera.setAngle(0)
  }

  save = async ()  => {
    if(!this.isCodrawingHost) return
    if(!this.strokeHistory.length) return
    return new Promise(async (resolve, reject) => {
      try {    
        const fileId = this.textureId
        const { bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)

        if(this.textureIdMongo) {
          store.dispatch(editTexture(this.textureIdMongo, {
            strokeHistory: []
          }))
        }
        this.strokeHistory = []
        const file = await urlToFile(bufferCanvas.toDataURL(), fileId, 'image/png')
        if(!this.strokeHistory.length) this.markSaved()

        await store.dispatch(saveTexture(file, fileId, {
          name: fileId,
          type: 'layer'
        }))

        resolve(fileId)
      } catch(e) {
        reject(e)
      }
    })
  }

  debouncedSave = _.debounce(this.save, 6000);

  updateTexture = (options) => {
    this.scene.textures.remove(this.textureId)
    this.scene.load.image(this.textureId, window.awsUrl + this.textureId);
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
          console.log(e)
          reject(e)
        }
      })
    })
  }

  storeRenderTextureForUndoStack() {
    if(!this.previousRenderTexture) {
      this.previousRenderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, this.boundaries.maxWidth, this.boundaries.maxHeight);
      this.previousRenderTexture.draw(this, 0,0)
      if(this.textureId.indexOf(SPRITE_EDITOR_CANVAS_ID) > -1) {
        window.spriteEditorUndoStack.push(this.textureId)
        window.spriteEditorUndoStack = window.spriteEditorUndoStack.slice(-UNDO_MEMORY_MAX)
      } else {
        window.instanceUndoStack.push(this.textureId)
        window.instanceUndoStack = window.instanceUndoStack.slice(-UNDO_MEMORY_MAX)
      }
    }
  }

  addRenderTextureToUndoStack() {
    this.undoTextureStack.push(this.previousRenderTexture)
    this.undoTextureStack = this.undoTextureStack.slice(-UNDO_MEMORY_MAX)
    this.previousRenderTexture = null
  }

  undo() {
    const texture = this.undoTextureStack.pop()
    this.clear()
    super.draw(texture, 0,0)
    if(this.textureId.indexOf(SPRITE_EDITOR_CANVAS_ID) === -1) {
      this.debouncedSave()
    }
  }

  markSaved() {
    this.unsavedChanges = false
    store.dispatch({
      type: MARK_TEXTURE_UNSAVED,
      payload: {
        textureId: this.textureId,
        unsaved: false
      }
    })
  }

  markUnsaved() {
    this.unsavedChanges = true
    store.dispatch({
      type: MARK_TEXTURE_UNSAVED,
      payload: {
        textureId: this.textureId,
        unsaved: true
      }
    })
  }

  draw(entries, x, y) {
    this.storeRenderTextureForUndoStack()
    super.draw(entries, x, y)
  }

  erase(entries, x, y) {
    this.storeRenderTextureForUndoStack()
    super.erase(entries, x, y)
  }

  onStrokeReleased() {
    this.addRenderTextureToUndoStack()
    if(this.autoSave) this.debouncedSave()
  }

  initialDraw() {
    if(this.scene.textures.exists(this.textureId)) {
      super.draw(this.textureId, 0, 0)
    }
  }
}

