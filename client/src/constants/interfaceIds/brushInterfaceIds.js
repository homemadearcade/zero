export const BRUSH_SIZE_IID = 'brushSize';
export const ADD_BRUSH_IID = 'addBrush';

export const BRUSH_SELECT_IID = 'brushSelect'
export const COLOR_SELECT_IID = 'colorSelect'

export function getLayerContainerId(layerCanvasId) {
  return layerCanvasId + '/*'
}

export function getBrushSelectFromLayerCanvasId(layerCanvasId) {
  return layerCanvasId + "/" + BRUSH_SELECT_IID
}

export function getColorSelectFromLayerCanvasId(layerCanvasId) {
  return layerCanvasId + "/" + COLOR_SELECT_IID
}