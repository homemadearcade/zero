/* eslint-disable import/no-anonymous-default-export */
import { ADD_BRUSH_IID, BRUSH_SIZE_IID, ERASER_IID  } from "../interfaceIds";

export default {
  [BRUSH_SIZE_IID]: {},
  [ERASER_IID]: {
    previewText: 'Eraser',
  },
  [ADD_BRUSH_IID]: {
    previewText: 'Add a Brush',
    name: 'Add Brush',
    onClick: () => (dispatch) => {

    }
  },
}