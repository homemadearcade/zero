import { 
  BACKGROUND_CANVAS_DEPTH, 
  BACKGROUND_CANVAS_ID, 
  ERASER_BRUSH_ID , 
  OBJECT_INSTANCE_CANVAS_DEPTH, 
  OBJECT_INSTANCE_CANVAS_ID, 
  HERO_INSTANCE_CANVAS_DEPTH, 
  HERO_INSTANCE_CANVAS_ID, 
  FOREGROUND_CANVAS_DEPTH, 
  FOREGROUND_CANVAS_ID, 
  PLAYGROUND_CANVAS_DEPTH, 
  PLAYGROUND_CANVAS_ID,
  UI_CANVAS_DEPTH, 
  UI_CANVAS_ID, 
} from "../constants";
import { COLOR_BRUSH_ID } from "../constants";
import Phaser from 'phaser'
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";


export function getCurrentGameScene(gameInstance) {
  const scene = gameInstance.scene?.scenes[0]
  return scene
}

export function snapEraserXY({x, y}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const brushSize = getCobrowsingState().editor.brushSize
  const isGridViewOn = getCobrowsingState().editor.isGridViewOn

  const blockSize = nodeSize * brushSize

  const gridx = isGridViewOn ? 0 : gameModel.world.boundaries.x
  const gridy = isGridViewOn ? 0 : gameModel.world.boundaries.y
  const width = isGridViewOn ?  gameModel.world.boundaries.maxWidth : gridx + gameModel.world.boundaries.width
  const height = isGridViewOn ? gameModel.world.boundaries.maxHeight : gridy + gameModel.world.boundaries.height

  const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x - (blockSize/2), nodeSize), gridx, width)
  const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y - (blockSize/2), nodeSize), gridy, height)

  return {
    snappedX,
    snappedY
  }
}


export function snapBrushXY({x, y}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const brushSize = getCobrowsingState().editor.brushSize
  const isGridViewOn = getCobrowsingState().editor.isGridViewOn
  const blockSize = nodeSize * brushSize

  const gridx = isGridViewOn ? 0 : gameModel.world.boundaries.x
  const gridy = isGridViewOn ? 0 : gameModel.world.boundaries.y
  const width = isGridViewOn ?  gameModel.world.boundaries.maxWidth : gridx + gameModel.world.boundaries.width
  const height = isGridViewOn ? gameModel.world.boundaries.maxHeight : gridy + gameModel.world.boundaries.height

  const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x - (blockSize/2), blockSize), gridx, width)
  const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y - (blockSize/2), blockSize), gridy, height)

  return {
    snappedX,
    snappedY
  }
}

export function snapObjectXY({x, y}, objectClass) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const isGridViewOn = getCobrowsingState().editor.isGridViewOn

  const gridx = isGridViewOn ? 0 : gameModel.world.boundaries.x
  const gridy = isGridViewOn ? 0 : gameModel.world.boundaries.y
  const width = isGridViewOn ?  gameModel.world.boundaries.maxWidth : gridx + gameModel.world.boundaries.width
  const height = isGridViewOn ? gameModel.world.boundaries.maxHeight : gridy + gameModel.world.boundaries.height

  const snappedX = Phaser.Math.Clamp(Phaser.Math.Snap.To(x, nodeSize), gridx + (objectClass.width/2), width - (objectClass.width/2))
  const snappedY = Phaser.Math.Clamp(Phaser.Math.Snap.To(y, nodeSize), gridy + (objectClass.height/2), height - (objectClass.height/2))
  
  return {
    snappedX,
    snappedY
  }
}

export function getDepthFromEraserId(eraserId) {
  return getDepthFromCanvasId(getCanvasIdFromEraserId(eraserId))
}

export function getDepthFromCanvasId(canvasId) {
  if(canvasId === BACKGROUND_CANVAS_ID) return BACKGROUND_CANVAS_DEPTH
  if(canvasId === PLAYGROUND_CANVAS_ID) return PLAYGROUND_CANVAS_DEPTH
  if(canvasId === OBJECT_INSTANCE_CANVAS_ID) return OBJECT_INSTANCE_CANVAS_DEPTH
  if(canvasId === HERO_INSTANCE_CANVAS_ID) return HERO_INSTANCE_CANVAS_DEPTH
  if(canvasId === FOREGROUND_CANVAS_ID) return FOREGROUND_CANVAS_DEPTH
  if(canvasId === UI_CANVAS_ID) return UI_CANVAS_DEPTH
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