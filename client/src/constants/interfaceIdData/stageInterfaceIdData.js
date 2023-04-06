import { STAGE_IGID } from "../interfaceIdGroups";
import { STAGES_OPEN_IID, STAGE_ADD_IID, STAGE_OPEN_BACKGROUND_COLOR_IID, STAGE_CONTAINER_IID, STAGE_GRAVITY_X_IID, STAGE_GRAVITY_Y_IID, STAGE_OPEN_EDIT_IID, STAGE_OPEN_GRAVITY_IID, STAGE_OPEN_SECTIONS_IID, STAGE_SELECT_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [STAGE_GRAVITY_X_IID]: {},
  [STAGE_GRAVITY_Y_IID]: {
     isDefaultUnlocked: true
  },
  [STAGE_OPEN_BACKGROUND_COLOR_IID]: {
    
  },
  [STAGE_ADD_IID]: {},
  [STAGE_SELECT_IID]: {},
  [STAGE_CONTAINER_IID]: {},

  [STAGE_OPEN_GRAVITY_IID]: {},
  [STAGE_OPEN_SECTIONS_IID]: {},
  [STAGES_OPEN_IID]: {},
  [STAGE_OPEN_EDIT_IID]: {
    interfaceGroupId: STAGE_IGID,
    previewText: 'Edit Stage',
    name: 'Edit Stage Button'
  },
  // [STAGE_MORE_IID]: {},
}