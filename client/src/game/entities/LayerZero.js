import store from "../../store";
import { CompoundStaticBody } from "./CompoundStaticBody";
import { LayerCanvas } from "./LayerCanvas";

export class LayerZero extends LayerCanvas {
  constructor(scene){
    super(scene, { layerId: 'layer0'})

    //for some reasion the initial draw in the super is the LayerCanvas version
    this.createCollisionBody()

    this.collisionBody = null

    return this
  }

  initialDraw = () => {
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
    
    this.collisionBody = new CompoundStaticBody(this.scene, 
      { 
        parts: collisionGridNodes,
        width: gameModel.world.boundaries.width, 
        height: gameModel.world.boundaries.height, 
        nodeWidth: nodeSize, 
        nodeHeight: nodeSize
      })
  }
}

