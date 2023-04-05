/* eslint-disable import/no-anonymous-default-export */
import { openCreateBrushFlow } from "../../store/actions/game/gameFormEditorActions";
import { ACTION_OPEN, ACTION_SELECT } from "../action";
import { INTERFACE_FORM_SLIDER } from "../interface";
import { BRUSH_IGID } from "../interfaceIdGroups";
import { ADD_BRUSH_IID, BRUSH_SIZE_IID, ERASER_IID  } from "../interfaceIds";

export default {
  [BRUSH_SIZE_IID]: {
    formType: INTERFACE_FORM_SLIDER,
    interfaceGroupId: BRUSH_IGID,
  },
  [ERASER_IID]: {
    previewText: 'Eraser',
    clickType: ACTION_SELECT,
    interfaceGroupId: BRUSH_IGID,
  },
  [ADD_BRUSH_IID]: {
    previewText: 'Add a Brush',
    interfaceGroupId: BRUSH_IGID,
    clickType: ACTION_OPEN,
    onClickArguments: [
      'layerId', []
    ],
    onClick: (layerId) => (gameModel, dispatch) => {
      dispatch(openCreateBrushFlow(layerId))
    }
  },
}