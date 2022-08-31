import Phaser from "phaser";
import store from "../../store";
import { addAwsImage } from "../../store/actions/gameActions";
import { urlToFile } from "../../utils/utils";
import _ from "lodash";

export class Canvas extends Phaser.GameObjects.RenderTexture {
  constructor(scene, { canvasId }){
    const state = store.getState()
    const gameModel = state.game.gameModel
    super(scene, 0, 0, gameModel.world.boundaries.maxWidth, gameModel.world.boundaries.maxHeight)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = gameModel.id+'/' + canvasId

    this.initialDraw()

    const lobby = state.lobby.lobby
    const me = state.auth.me 
    const gameHostId = lobby.gameHostId
    this.isHost = !lobby.id || me.id === gameHostId

    this.isSavingToAws = false

    return this
  }

  save = async ()  => {
    if(!this.isHost) return
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

  updateTexture = () => {
    this.scene.textures.remove(this.textureId)
    this.scene.load.image(this.textureId, window.awsUrl + this.textureId);
    this.scene.load.once('complete', () => {
      this.isSavingToAws = false
      this.scene.input.setDefaultCursor('default');
      this.clear()
      this.initialDraw()
    });
    this.scene.load.start();
  }

  onStrokeReleased() {
    this.debouncedSave()
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

  draw(entries, x, y) {
    if(this.isSavingToAws) {
      return false
    }
    super.draw(entries, x, y)
  }

  erase(entries, x, y) {
    if(this.isSavingToAws) {
      return false
    }
    super.erase(entries, x, y)
  }

  initialDraw() {
    if(this.scene.textures.exists(this.textureId)) {
      this.draw(this.textureId, 0, 0)
    }
  }

  destroy() {
    this.save()
    super.destroy()
  }
}

