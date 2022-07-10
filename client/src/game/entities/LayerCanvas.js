import Phaser from "phaser";
import store from "../../store";
import { addAwsImage } from "../../store/actions/gameActions";
import { urlToFile } from "../../utils/utils";

export class LayerCanvas extends Phaser.GameObjects.RenderTexture {
  constructor(scene, { layerId }){
    const gameModel = store.getState().game.gameModel
    super(scene, 0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = gameModel.id+'/' + layerId

    this.initialDraw()

    return this
  }

  save = async ()  => {
    const { bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)

    const fileId = this.textureId
    const file = await urlToFile(bufferCanvas.toDataURL(), fileId, 'image/png')
   
    store.dispatch(addAwsImage(file, fileId, {
      name: 'layer0',
      type: 'layer'
    }))
  }

  updateTexture = () => {
    this.scene.textures.remove(this.textureId)
    this.scene.load.image(this.textureId, window.awsUrl + this.textureId);
    this.scene.load.once('complete', () => {
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
          bufferCanvas.width = gameModel.world.boundaries.width
          bufferCanvas.height = gameModel.world.boundaries.height
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

  initialDraw() {
    if(this.scene.textures.exists(this.textureId)) {
      this.draw(this.textureId, 0, 0)
    }
  }
}

