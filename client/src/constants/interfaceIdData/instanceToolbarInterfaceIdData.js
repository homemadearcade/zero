import { INSTANCE_TOOLBAR_CONTAINER_IID, INSTANCE_TOOLBAR_PAUSE_IID, INSTANCE_TOOLBAR_PLAYTHROUGH_IID, INSTANCE_TOOLBAR_PLAY_IID, INSTANCE_TOOLBAR_RESET_IID, INSTANCE_TOOLBAR_UNDO_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [INSTANCE_TOOLBAR_CONTAINER_IID]: {
    ignoreTools: true
  },
  [INSTANCE_TOOLBAR_PAUSE_IID]: {
    previewText:  'Pause'
  },
  [INSTANCE_TOOLBAR_UNDO_IID]: {},
  [INSTANCE_TOOLBAR_RESET_IID]: {
    previewText:  'Reset'
  },
  [INSTANCE_TOOLBAR_PLAY_IID]: {
    previewText:  'Play'
  },
  [INSTANCE_TOOLBAR_PLAYTHROUGH_IID]: {
    previewText:  'Start Game'
  },
}