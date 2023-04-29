/* eslint-disable import/no-anonymous-default-export */
import { INTERFACE_FORM_SLIDER } from "../interface";
import { DRAW_IGID } from "../interfaceIdGroups";
import { BACKGROUND_LAYER_GROUP_IID, BRUSH_ADD_IID, BRUSH_SELECT_IID, BRUSH_SIZE_IID, COLOR_SELECT_IID, ERASER_SELECT_IID, FOREGROUND_LAYER_GROUP_IID, PLAYGROUND_LAYER_GROUP_IID  } from "../interfaceIds";

// export const BRUSH_SELECT_IID = 'brushSelect'
// export const COLOR_SELECT_IID = 'colorSelect'

// export const BACKGROUND_LAYER_GROUP_IID = 'LAYER_GROUP_ID_BACKGROUND'
// export const PLAYGROUND_LAYER_GROUP_IID = 'LAYER_GROUP_ID_PLAYGROUND'
// export const FOREGROUND_LAYER_GROUP_IID = 'LAYER_GROUP_ID_FOREGROUND'

// export const BRUSH_SIZE_IID = 'brushSize';
// export const BRUSH_ADD_IID = 'addBrush';
// export const ERASER_SELECT_IID = 'eraser'

export default {
  [BRUSH_SELECT_IID]: {
    name: 'Select Brush Area',
    isDefaultUnlocked: true
  },
  [COLOR_SELECT_IID]: {
    name: 'Select Color Area',
    isDefaultUnlocked: true
  },
  [BRUSH_SIZE_IID]: {
    formType: INTERFACE_FORM_SLIDER,
    interfaceGroupId: DRAW_IGID,
  },
  [ERASER_SELECT_IID]: {
    name: 'Select Eraser Button',
    previewText: 'Eraser',
    leftClickAction: 'Select Eraser',
    interfaceGroupId: DRAW_IGID,
  },
  [BRUSH_ADD_IID]: {
    name: 'Add Brush Button',
    previewText: 'Add Sprite Brush',
    leftClickAction: 'Add Brush',
    interfaceGroupId: DRAW_IGID,
  },
  [BACKGROUND_LAYER_GROUP_IID]: {
    name: 'Background Layer Brush Container',
    interfaceGroupId: DRAW_IGID,
  },
  [PLAYGROUND_LAYER_GROUP_IID]: {
    name: 'Playground Layer Brush Container',
    interfaceGroupId: DRAW_IGID,
  },
  [FOREGROUND_LAYER_GROUP_IID]: {
    name: 'Foreground Layer Brush Container',
    interfaceGroupId: DRAW_IGID,
  },

}