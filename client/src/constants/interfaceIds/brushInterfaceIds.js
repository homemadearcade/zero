export const BRUSH_SIZE_IID = 'brushSize';
export const BRUSH_ADD_IID = 'addBrush';
export const ERASER_SELECT_IID = 'eraser'


// NO DATA YET
export const BRUSH_SELECT_IID = 'brushSelect'
export const COLOR_SELECT_IID = 'colorSelect'

export function getLayerContainerId(layerId) {
  return layerId + '/*'
}

export function getBrushSelectFromLayerId(layerId) {
  return layerId + "/" + BRUSH_SELECT_IID
}

export function getColorSelectFromLayerId(layerId) {
  return layerId + "/" + COLOR_SELECT_IID
}