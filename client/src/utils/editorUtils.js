import { 
  ERASER_BRUSH_ID , 
} from "../game/constants";
import { COLOR_BRUSH_ID } from "../game/constants";
import Phaser from 'phaser'
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";


export function getCurrentGameScene(gameInstance) {
  const scenes = gameInstance?.scene?.scenes
  const currentStageId = store.getState().gameModel.currentStageId

  let currentScene
  if(scenes) scenes.forEach((scene) => {
    if(currentStageId === scene.stage?.stageId) currentScene = scene
  })

  if(!currentScene && scenes) currentScene = scenes[0]
  return currentScene
}

export function snapFreeXY({x, y, boundaries = store.getState().gameModel.gameModel.stages[store.getState().gameModel.currentStageId].boundaries}) {
  const gameModel = store.getState().gameModel.gameModel
  const nodeSize = gameModel.size.nodeSize
  const halfNodeSize = nodeSize /// 2
  const brushSize = getCobrowsingState().gameSelector.brushSize
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

  const blockSize = nodeSize * brushSize

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  const freeX = x - (blockSize/2)
  const freeY = y - (blockSize/2)
  const snappedX = Phaser.Math.Snap.To(x - (blockSize/2), halfNodeSize)
  const clampedX = Phaser.Math.Clamp(snappedX, gridx, width)
  const snappedY = Phaser.Math.Snap.To(y - (blockSize/2), halfNodeSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy, height)

  return {
    freeX,
    freeY,
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}


export function snapSectionalXY({x, y, boundaries = store.getState().gameModel.gameModel.stages[store.getState().gameModel.currentStageId].boundaries}) {
  const gameModel = store.getState().gameModel.gameModel
  const nodeSize = gameModel.size.nodeSize
  const brushSize = getCobrowsingState().gameSelector.brushSize
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
  const blockSize = nodeSize * brushSize

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  const snappedX = Phaser.Math.Snap.To(x - (blockSize/2), blockSize)
  const clampedX = Phaser.Math.Clamp(snappedX, gridx, width)
  const snappedY = Phaser.Math.Snap.To(y - (blockSize/2), blockSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy, height)

  return {
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}

export function snapObjectXY({x, y, entityModel, entityInstance, boundaries = store.getState().gameModel.gameModel.stages[store.getState().gameModel.currentStageId].boundaries}) {
  const gameModel = store.getState().gameModel.gameModel
  const halfNodeSize = gameModel.size.nodeSize ///2
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  let entityWidth = entityModel.graphics.width
  let entityHeight = entityModel.graphics.height
  if(entityInstance) {
    entityWidth = entityInstance.width
    entityHeight = entityInstance.height
  }

  const snappedX = Phaser.Math.Snap.To(x, halfNodeSize)
  const clampedX =  Phaser.Math.Clamp(snappedX, gridx + (entityWidth/2), width - (entityWidth/2))
  const snappedY = Phaser.Math.Snap.To(y, halfNodeSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy + (entityHeight/2), height - (entityHeight/2))
  const boundaryX = Phaser.Math.Clamp(x, boundaries.x, boundaries.x + boundaries.width)
  const boundaryY = Phaser.Math.Clamp(y, boundaries.y, boundaries.x + boundaries.width)
  const freeX = x
  const freeY = y

  return {
    freeX,
    freeY,
    boundaryX,
    boundaryY,
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}
export const sortColorByLastSelectedDate = (colors, layerId) => (a, b) => {
  const colorA = colors[a]
  const colorB = colors[b]
  if(!colorA) return -1 
  if(!colorB) return 1
  if(!colorA[layerId]) return 1
  if(!colorB[layerId]) return -1
  if(colorA[layerId] < colorB[layerId]) {
    return -1
  } else return 1
}

export const sortByLastSelectedDate = (entityInstance) => (a, b) => {
  const objectA = entityInstance[a]
  const objectB = entityInstance[b]
  if(objectA.lastSelectedDate < objectB.lastSelectedDate) return 1
  else return -1
}

export const sortByLastEditedDate = (entityInstance) => (a, b) => {
  const objectA = entityInstance[a]
  const objectB = entityInstance[b]
  if(objectA.lastEditedDate < objectB.lastEditedDate) return 1
  else return -1
}

const HEX_CODE_LENGTH = 7
export function getLayerIdFromColorId(colorId) {
  return colorId.slice(COLOR_BRUSH_ID.length + 1, - (HEX_CODE_LENGTH + 1)) 
}

export function getHexFromColorId(colorId) {
  return colorId.slice(-HEX_CODE_LENGTH)
}

export function getHexIntFromHexString(hexString) {
  return parseInt(hexString.slice(1), 16)
}

export function isBrushIdColor(colorId) {
  return colorId.indexOf(COLOR_BRUSH_ID) >= 0
}

export function getLayerIdFromEraserId(eraserId) {
  return eraserId.slice(ERASER_BRUSH_ID.length + 1)
}

export function isBrushIdEraser(brushId) {
  return brushId.indexOf(ERASER_BRUSH_ID) >= 0
}