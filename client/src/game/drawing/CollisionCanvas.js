import store from "../../store";
import { CompoundStaticBody } from "./CompoundStaticBody";
import { splitIntoSubarrays } from "../../utils/arrayUtils";
import { CodrawingCanvas } from "./CodrawingCanvas";
import { PLAYGROUND_LAYER_GROUP_IID } from "../../constants/interfaceIds";

export class CollisionCanvas extends CodrawingCanvas {
  constructor(scene, props){
    super(scene, props)

    this.isCollisionCanvas = true
    this.collisionBody = null
    this.scene = scene
    
    return this
  }

  initialDraw = () => {
    super.initialDraw()
    this.createCollisionBody()
  }

  createCollisionBody = async () => {
    const { bufferCanvasContext, bufferCanvas } = await this.getBufferCanvasFromRenderTexture(this)
    const state = store.getState()
    const gameModel = state.gameModel.gameModel 
    const nodeSize = gameModel.size.nodeSize

    const terrainData = bufferCanvasContext.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);
    const data = terrainData.data
    const halfNodeSize = nodeSize/2

    const collisionGridNodes = []
    this.collisionBody?.destroy()
    const alphaNodes = []
    for(var i = 3; i<data.length; i+=4){
      alphaNodes.push({ alpha: data[i], touched: false });
    }

    const stage = gameModel.stages[this.scene.stage.stageId]

    const alphaGrid = splitIntoSubarrays(alphaNodes, stage.boundaries.maxWidth)
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
    
    this.unregisterColliders()
    this.collisionBody = new CompoundStaticBody(this.scene, { 
      parts: collisionGridNodes,
      width: stage.boundaries.maxWidth, 
      height: stage.boundaries.maxHeight, 
      nodeWidth: nodeSize, 
      nodeHeight: nodeSize
    })
    this.registerColliders()
  }

  registerColliders(entityInstances) {
    if(this.collisionBody) {
      if(!entityInstances) {
        entityInstances = this.scene.entityInstances
        entityInstances.push(this.scene.playerInstance)
      }
      // console.log('body arrived')

      const entityModels = this.scene.getGameModel().entityModels
      if(this.playerInstance) this.unregisterPlayerCollisions = this.scene.physics.add.collider(this.collisionBody.group, this.scene.playerInstance.physicsSprite)
      this.unregisterObjectCollisions = this.scene.physics.add.collider(this.collisionBody.group, entityInstances.filter(({entityModelId}) => {
        const layerGroupIID = entityModels[entityModelId].graphics.layerGroupIID
        return layerGroupIID === PLAYGROUND_LAYER_GROUP_IID
      }).map(({physicsSprite}) => {
        return physicsSprite
      }))
    } else {
      // console.log('no body yet')
    }

  }

  unregisterColliders() {
    this.scene.physics.world.removeCollider(this.unregisterPlayerCollisions)
    this.scene.physics.world.removeCollider(this.unregisterObjectCollisions)
    // this.scene.physics.world.removeCollider(this.unregisterProjectileCollisions)
  }
}

