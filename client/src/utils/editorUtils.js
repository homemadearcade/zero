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
  SPRITE_EDITOR_CANVAS_ID,
  SPRITE_EDITOR_CANVAS_DEPTH, 
} from "../constants";
import { COLOR_BRUSH_ID } from "../constants";
import Phaser from 'phaser'
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";


export function getCurrentGameScene(gameInstance) {
  const scene = gameInstance.scene?.scenes[0]
  return scene
}

export function snapEraserXY({x, y, boundaries = store.getState().game.gameModel.world.boundaries}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const brushSize = getCobrowsingState().gameEditor.brushSize
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


export function snapBrushXY({x, y, boundaries = store.getState().game.gameModel.world.boundaries}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const brushSize = getCobrowsingState().gameEditor.brushSize
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

export function snapObjectXY({x, y, objectClass, boundaries = store.getState().game.gameModel.world.boundaries}) {
  const gameModel = store.getState().game.gameModel
  const nodeSize = gameModel.world.nodeSize
  const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn

  const gridx = isGridViewOn ? 0 : boundaries.x
  const gridy = isGridViewOn ? 0 : boundaries.y
  const width = isGridViewOn ?  boundaries.maxWidth : gridx + boundaries.width
  const height = isGridViewOn ? boundaries.maxHeight : gridy + boundaries.height

  const snappedX = Phaser.Math.Snap.To(x, nodeSize)
  const clampedX =  Phaser.Math.Clamp(snappedX, gridx + (objectClass.graphics.width/2), width - (objectClass.graphics.width/2))
  const snappedY = Phaser.Math.Snap.To(y, nodeSize)
  const clampedY = Phaser.Math.Clamp(snappedY, gridy + (objectClass.graphics.height/2), height - (objectClass.graphics.height/2))
  
  return {
    clampedX,
    clampedY,
    snappedX,
    snappedY
  }
}

export function getDepthFromEraserId(eraserId) {
  return getDepthFromCanvasId(getCanvasIdFromEraserId(eraserId))
}

export function getDepthFromCanvasId(canvasId) {
  if(canvasId === BACKGROUND_CANVAS_ID) return BACKGROUND_CANVAS_DEPTH
  if(canvasId === SPRITE_EDITOR_CANVAS_ID) return SPRITE_EDITOR_CANVAS_DEPTH
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