import { GAME_INSTANCE_IGID } from "../interfaceIdGroups";
import { INSTANCE_TOOLBAR_CONTAINER_IID, INSTANCE_TOOLBAR_PAUSE_IID, INSTANCE_TOOLBAR_PLAYTHROUGH_IID, INSTANCE_TOOLBAR_PLAY_IID, INSTANCE_TOOLBAR_RESET_IID, INSTANCE_TOOLBAR_UNDO_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [INSTANCE_TOOLBAR_CONTAINER_IID]: {
    ignoreTools: true
  },
  [INSTANCE_TOOLBAR_PAUSE_IID]: {
    previewText:  'Pause',
    name: 'Pause Game Button',
    leftClickAction: 'Pause Game',
    leftClickIcon: 'faPause',
    interfaceGroupId: GAME_INSTANCE_IGID
  },
  [INSTANCE_TOOLBAR_UNDO_IID]: {},
  [INSTANCE_TOOLBAR_RESET_IID]: {
    previewText:  'Reset',
    name: 'Reset Game Button',
    leftClickAction: 'Reset Game',
    leftClickIcon: 'faRepeat',
    interfaceGroupId: GAME_INSTANCE_IGID
  },
  [INSTANCE_TOOLBAR_PLAY_IID]: {
    previewText:  'Play',
    name: 'Unpause Game Button',
    leftClickAction: 'Play Game',
    leftClickIcon: 'faPlay',
    interfaceGroupId: GAME_INSTANCE_IGID
  },
  [INSTANCE_TOOLBAR_PLAYTHROUGH_IID]: {
    previewText:  'Start Game',
    name: 'Start Game Button',
    leftClickAction: 'Start Game',
    leftClickIcon: 'faCirclePlay',
    interfaceGroupId: GAME_INSTANCE_IGID
  },
}