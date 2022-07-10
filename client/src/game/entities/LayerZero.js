import Phaser from "phaser";
import store from "../../store";
import { WorldCollisionBody } from "./WorldCollisionBody";
import { addAwsImage } from "../../store/actions/gameActions";
import { urlToFile } from "../../utils/utils";

export class LayerZero extends Phaser.GameObjects.RenderTexture {
  constructor(scene){
    const gameModel = store.getState().game.gameModel
    super(scene, 0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height)

    this.scene = scene
    this.scene.add.existing(this)

    this.textureId = gameModel.id+'/layer0'

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
    const gameModel = store.getState().game.gameModel
    if(this.scene.textures.exists(this.textureId)) {
      this.draw(this.textureId, 0, 0)
      this.createCollisionBody()
    }
  }

  createCollisionBody = async () => {
    const { bufferCanvasContext, bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)
    const gameModel = store.getState().game.gameModel 
    const nodeSize = gameModel.world.nodeSize

    const terrainData = bufferCanvasContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
    const data = terrainData.data
    const grid = []
    const rowLength = (4 * (gameModel.world.boundaries.width))
    const halfNodeSize = nodeSize/2

    let x = 0;
    let y = 0;
    for(let i = halfNodeSize; i < data.length/rowLength; i += nodeSize) {
      grid.push([])
      y = 0
      for(let i2 = (i * rowLength) + (halfNodeSize * 4); i2 < (i * rowLength) + rowLength; i2 += (4 * nodeSize)) {
        y = i2/4
        grid[x].push({ alpha: data[i2], touched: false})
      }
      x++ 
    }

    const collisionGridNodes = []
    this.collisionBody?.destroy()

    grid.forEach((row, y) => {
      row.forEach((node, x) => {
        if(node.alpha && ! node.touched) {
          let rowNodes = []
          let searchX = x
          while(row[searchX].alpha) {
            row[searchX].touched = true
            searchX++
            rowNodes.push(row[searchX])
          }

          if(rowNodes.length) {
            collisionGridNodes.push({ x: x * nodeSize, y: y * nodeSize, width: rowNodes.length})
          } else {
            collisionGridNodes.push({ x: x * nodeSize, y: y * nodeSize, width: 1})
          }
        }
      })
    })

    this.collisionBody = new WorldCollisionBody(this.scene, 
      { 
        parts: collisionGridNodes,
        width: gameModel.world.boundaries.width, 
        height: gameModel.world.boundaries.height, 
        nodeWidth: nodeSize, 
        nodeHeight: nodeSize
      })
  }
}

