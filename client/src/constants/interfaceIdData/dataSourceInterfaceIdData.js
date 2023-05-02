import { ENTITY_MODEL_IGID } from "../interfaceIdGroups";
import { GAME_MODEL_IMPORT_IID, ENTITY_BOX_OPEN_IID, LIBRARY_REMOVE_IID, REMOVED_DATA_SHOW_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LIBRARY_REMOVE_IID]: {
    appAdminOnly: true,
    // previewText: 'Remove from Library'
  },
  [GAME_MODEL_IMPORT_IID]: {
    appAdminOnly: true,
    previewText: 'Import Game Model',
    name: 'Import Game Model Button',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
  [REMOVED_DATA_SHOW_IID]: {},
  [ENTITY_BOX_OPEN_IID]: {
    previewText: 'More',
    leftClickAction: 'Open Box',
    leftClickIcon: 'faBoxArchive',
    name: 'See More Classes Button',
    interfaceGroupId: ENTITY_MODEL_IGID
  },
}