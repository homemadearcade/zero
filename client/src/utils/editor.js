import { ERASER_BRUSH_ID } from "../constants";

export function getDepthFromEraserId(eraserId) {
  return Number(eraserId.slice(ERASER_BRUSH_ID.length))
}

export function isBrushIdEraser(brushId) {
  return brushId.indexOf(ERASER_BRUSH_ID) >= 0
}