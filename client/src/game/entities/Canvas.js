import Phaser from "phaser";
import store from "../../store";
import { addAwsImage } from "../../store/actions/gameActions";
import { urlToFile } from "../../utils/utils";
import _ from "lodash";

window.undoStack = []

export class Canvas extends Phaser.GameObjects.RenderTexture {
  constructor(scene, { canvasId }){
    const state = store.getState()
    const gameModel = state.game.gameModel
    super(scene, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = gameModel.id+'/' + canvasId
    this.canvasId = canvasId

    this.initialDraw()

    const lobby = state.lobby.lobby
    const me = state.auth.me 
    const gameHostId = lobby.gameHostId
    this.isHost = !lobby.id || me.id === gameHostId

    this.isSavingToAws = false

    this.previousRenderTexture = null
    this.undoTextureStack = []

    return this
  }

  save = async ()  => {
    this.isSavingToAws = true
    
    this.scene.input.setDefaultCursor('wait');

    const fileId = this.textureId
    const { bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)

    const file = await urlToFile(bufferCanvas.toDataURL(), fileId, 'image/png')
   
    store.dispatch(addAwsImage(file, fileId, {
      name: fileId,
      type: 'layer'
    }))
  }

  debouncedSave = _.debounce(this.save, 30000);

  debouncedSaveShort = _.debounce(this.save, 100);

  updateTexture = () => {
    this.scene.textures.remove(this.textureId)
    this.scene.load.image(this.textureId, window.awsUrl + this.textureId);
    this.scene.load.once('complete', () => {
      this.isSavingToAws = false
      //sometimes this bugs out
      this.scene?.input.setDefaultCursor('default');
      this.clear()
      this.initialDraw()
    });
    this.scene.load.start();
  }

  getBufferCanvasFromRenderTexture = (renderTexture) => {
    return new Promise((resolve, reject) => {
      renderTexture.snapshot(async (imageData) => {

        try {
          const gameModel = store.getState().game.gameModel 
  
          const bufferCanvas = document.createElement('canvas');
          bufferCanvas.width = gameModel.world.boundaries.maxWidth
          bufferCanvas.height = gameModel.world.boundaries.maxHeight
          const bufferCanvasContext = bufferCanvas.getContext('2d');
          bufferCanvasContext.drawImage(imageData, 0,  0, bufferCanvas.width, bufferCanvas.height);
    
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
      const state = store.getState()
      const gameModel = state.game.gameModel
      this.previousRenderTexture = new Phaser.GameObjects.RenderTexture(this.scene, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight);
      this.previousRenderTexture.draw(this, 0,0)
      window.undoStack.push(this.canvasId)
    }
  }

  addRenderTextureToUndoStack() {
    this.undoTextureStack.push(this.previousRenderTexture)
    this.previousRenderTexture = null
  }

  undo() {
    const texture = this.undoTextureStack.pop()
    this.clear()
    super.draw(texture, 0,0)
    this.debouncedSaveShort()
  }

  draw(entries, x, y) {
    this.storeRenderTextureForUndoStack()

    if(this.isSavingToAws) {
      return false
    }
    super.draw(entries, x, y)
  }

  erase(entries, x, y) {
    this.storeRenderTextureForUndoStack()

    if(this.isSavingToAws) {
      return false
    }
    super.erase(entries, x, y)
  }

  onStrokeReleased() {
    this.addRenderTextureToUndoStack()
    if(this.isHost) this.debouncedSave()
  }

  initialDraw() {
    if(this.scene.textures.exists(this.textureId)) {
      super.draw(this.textureId, 0, 0)
    }
  }

  destroy() {
    if(this.isHost) this.save()
    super.destroy()
  }
}

