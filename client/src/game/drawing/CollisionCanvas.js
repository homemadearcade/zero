import store from "../../store";
import { CompoundStaticBody } from "./CompoundStaticBody";
import { splitIntoSubarrays } from "../../utils/arrayUtils";
import { CodrawingCanvas } from "./CodrawingCanvas";

export class CollisionCanvas extends CodrawingCanvas {
  constructor(scene, props){
    super(scene, props)

    //for some reasion the initial draw in the super is the LayerCanvas version
    if(this.scene.textures.exists(this.textureId)) {
      this.createCollisionBody()
    }

    this.collisionBody = null
    this.scene = scene

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
    const halfNodeSize = nodeSize/2

    const collisionGridNodes = []
    this.collisionBody?.destroy()
    const alphaNodes = []
    for(var i = 3; i<data.length; i+=4){
      alphaNodes.push({ alpha: data[i], touched: false });
    }

    const alphaGrid = splitIntoSubarrays(alphaNodes, gameModel.world.boundaries.maxWidth)
    for(let y = halfNodeSize; y < alphaGrid.length; y+= nodeSize) {
      const row = alphaGrid[y]
      for(let x = halfNodeSize; x < row.length; x+= nodeSize) {
        const node = row[x]
        if(node.alpha && ! node.touched) {
          let rowNodes = []
          let searchX = x
          while(row[searchX]?.alpha) {
            row[searchX].touched = true
            searchX += nodeSize
            rowNodes.push(row[searchX])
          }

          if(rowNodes.length) {
            collisionGridNodes.push({ x: x - halfNodeSize, y: y - halfNodeSize, width: rowNodes.length})
          } else {
            collisionGridNodes.push({ x: x - halfNodeSize, y: y - halfNodeSize, width: 1})
          }
        }
      }
    }
    
    this.collisionBody = new CompoundStaticBody(this.scene, { 
      parts: collisionGridNodes,
      width: gameModel.world.boundaries.maxWidth, 
      height: gameModel.world.boundaries.maxHeight, 
      nodeWidth: nodeSize, 
      nodeHeight: nodeSize
    })
    this.registerRelations()
  }

  registerRelations() {
    if(this.collisionBody) {
      this.unregisterPlayerCollisions = this.scene.physics.add.collider(this.collisionBody.group, this.scene.player.sprite)
      this.unregisterObjectCollisions = this.scene.physics.add.collider(this.collisionBody.group, this.scene.objectInstances.map(({sprite}) => {
        return sprite
      }))
    } else {
      console.log('no body yet')
    }

  }

  unregisterRelations() {
    this.scene.physics.world.removeCollider(this.unregisterPlayerCollisions)
    this.scene.physics.world.removeCollider(this.unregisterObjectCollisions)
  }
}

