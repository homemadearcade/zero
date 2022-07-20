import { 
  BACKGROUND_LAYER_DEPTH, 
  BACKGROUND_LAYER_ID, 
  ERASER_BRUSH_ID , 
  OBJECT_INSTANCE_LAYER_DEPTH, 
  OBJECT_INSTANCE_LAYER_ID, 
  HERO_INSTANCE_LAYER_DEPTH, 
  HERO_INSTANCE_LAYER_ID, 
  OVERHEAD_LAYER_DEPTH, 
  OVERHEAD_LAYER_ID, 
  PLAYGROUND_LAYER_DEPTH, 
  PLAYGROUND_LAYER_ID,
  UI_LAYER_DEPTH, 
  UI_LAYER_ID, 
} from "../constants";
import Phaser from 'phaser'
import store from "../store";

export function snapBrushXY({x, y}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const brushSize = store.getState().editor.editorState.brushSize
  const blockSize = nodeSize * brushSize

  const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x - (blockSize/2), blockSize), 0, gameModel.world.boundaries.width)
  const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y - (blockSize/2), blockSize), 0, gameModel.world.boundaries.height)

  return {
    snappedX,
    snappedY
  }
}

export function snapObjectXY({x, y}, objectClass) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize

  const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x, nodeSize), objectClass.width/2, gameModel.world.boundaries.width - (objectClass.width/2))
  const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y, nodeSize), objectClass.height/2, gameModel.world.boundaries.height - (objectClass.height/2))

  return {
    snappedX,
    snappedY
  }
}

export function getDepthFromEraserId(eraserId) {
  return getDepthFromLayerId(getLayerIdFromEraserId(eraserId))
}

export function getDepthFromLayerId(layerId) {
  if(layerId === BACKGROUND_LAYER_ID) return BACKGROUND_LAYER_DEPTH
  if(layerId === PLAYGROUND_LAYER_ID) return PLAYGROUND_LAYER_DEPTH
  if(layerId === OBJECT_INSTANCE_LAYER_ID) return OBJECT_INSTANCE_LAYER_DEPTH
  if(layerId === HERO_INSTANCE_LAYER_ID) return HERO_INSTANCE_LAYER_DEPTH
  if(layerId === OVERHEAD_LAYER_ID) return OVERHEAD_LAYER_DEPTH
  if(layerId === UI_LAYER_ID) return UI_LAYER_DEPTH

}
 
export function getLayerIdFromEraserId(eraserId) {
  return eraserId.slice(ERASER_BRUSH_ID.length)
}

export function isBrushIdEraser(brushId) {
  return brushId.indexOf(ERASER_BRUSH_ID) >= 0
}