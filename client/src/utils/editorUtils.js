import { 
  BACKGROUND_LAYER_CANVAS_DEPTH, 
  BACKGROUND_LAYER_CANVAS_ID, 
  ERASER_BRUSH_ID , 
  FOREGROUND_LAYER_CANVAS_DEPTH, 
  FOREGROUND_LAYER_CANVAS_ID, 
  PLAYGROUND_LAYER_CANVAS_DEPTH, 
  PLAYGROUND_LAYER_CANVAS_ID,
  UI_CANVAS_DEPTH, 
  UI_CANVAS_ID,
  IMAGE_CANVAS_MODAL_CANVAS_ID,
  IMAGE_CANVAS_MODAL_CANVAS_DEPTH,
  NON_LAYER_BRUSH_ID,
  NON_LAYER_BRUSH_DEPTH,
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
  const nodeSize = gameModel.nodeSize
  const brushSize = getCobrowsingState().gameSelector.brushSize
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

  const blockSize = nodeSize * brushSize

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  const snappedX = Phaser.Math.Snap.To(x - (blockSize/2), nodeSize)
  const clampedX = Phaser.Math.Clamp(snappedX, gridx, width)
  const snappedY = Phaser.Math.Snap.To(y - (blockSize/2), nodeSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy, height)

  return {
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}


export function snapSectionalXY({x, y, boundaries = store.getState().gameModel.gameModel.stages[store.getState().gameModel.currentStageId].boundaries}) {
  const gameModel = store.getState().gameModel.gameModel
  const nodeSize = gameModel.nodeSize
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

export function snapObjectXY({x, y, entityClass, boundaries = store.getState().gameModel.gameModel.stages[store.getState().gameModel.currentStageId].boundaries}) {
  const gameModel = store.getState().gameModel.gameModel
  const nodeSize = gameModel.nodeSize
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  const snappedX = Phaser.Math.Snap.To(x, nodeSize)
  const clampedX =  Phaser.Math.Clamp(snappedX, gridx + (entityClass.graphics.width/2), width - (entityClass.graphics.width/2))
  const snappedY = Phaser.Math.Snap.To(y, nodeSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy + (entityClass.graphics.height/2), height - (entityClass.graphics.height/2))
  
  return {
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}

export function getDepthFromEraserId(eraserId) {
  return getDepthFromLayerCanvasId(getCanvasIdFromEraserId(eraserId))
}

export function getDepthFromLayerCanvasId(layerCanvasId) {
  if(layerCanvasId === BACKGROUND_LAYER_CANVAS_ID) return BACKGROUND_LAYER_CANVAS_DEPTH
  if(layerCanvasId === IMAGE_CANVAS_MODAL_CANVAS_ID) return IMAGE_CANVAS_MODAL_CANVAS_DEPTH
  if(layerCanvasId === PLAYGROUND_LAYER_CANVAS_ID) return PLAYGROUND_LAYER_CANVAS_DEPTH
  if(layerCanvasId === FOREGROUND_LAYER_CANVAS_ID) return FOREGROUND_LAYER_CANVAS_DEPTH
  if(layerCanvasId === UI_CANVAS_ID) return UI_CANVAS_DEPTH
  if(layerCanvasId === NON_LAYER_BRUSH_ID) return NON_LAYER_BRUSH_DEPTH
}

export const sortColorByLastSelectedDate = (colors, layerCanvasId) => (a, b) => {
  const colorA = colors[a]
  const colorB = colors[b]
  if(!colorA) return -1 
  if(!colorB) return 1
  if(!colorA[layerCanvasId]) return 1
  if(!colorB[layerCanvasId]) return -1
  if(colorA[layerCanvasId] < colorB[layerCanvasId]) {
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
export function getCanvasIdFromColorId(colorId) {
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

export function getCanvasIdFromEraserId(eraserId) {
  return eraserId.slice(ERASER_BRUSH_ID.length + 1)
}

export function isBrushIdEraser(brushId) {
  return brushId.indexOf(ERASER_BRUSH_ID) >= 0
}