/* eslint-disable import/no-anonymous-default-export */
import { INTERFACE_FORM_SLIDER } from "../interface";
import { DRAW_IGID } from "../interfaceIdGroups";
import { BRUSH_ADD_IID, BRUSH_SIZE_IID, ERASER_SELECT_IID  } from "../interfaceIds";

export default {
  [BRUSH_SIZE_IID]: {
    formType: INTERFACE_FORM_SLIDER,
    interfaceGroupId: DRAW_IGID,
  },
  [ERASER_SELECT_IID]: {
    name: 'Select Eraser Button',
    previewText: 'Eraser',
    interfaceGroupId: DRAW_IGID,
  },
  [BRUSH_ADD_IID]: {
    name: 'Add Brush Button',
    previewText: 'Add a Brush',
    interfaceGroupId: DRAW_IGID,
  },
}