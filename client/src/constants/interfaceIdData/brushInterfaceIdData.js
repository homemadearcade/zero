/* eslint-disable import/no-anonymous-default-export */
import { INTERFACE_FORM_SLIDER } from "../interface";
import { BRUSH_IGID } from "../interfaceIdGroups";
import { BRUSH_ADD_IID, BRUSH_SIZE_IID, ERASER_SELECT_IID  } from "../interfaceIds";

export default {
  [BRUSH_SIZE_IID]: {
    formType: INTERFACE_FORM_SLIDER,
    interfaceGroupId: BRUSH_IGID,
  },
  [ERASER_SELECT_IID]: {
    previewText: 'Eraser',
    interfaceGroupId: BRUSH_IGID,
  },
  [BRUSH_ADD_IID]: {
    previewText: 'Add a Brush',
    interfaceGroupId: BRUSH_IGID,
  },
}