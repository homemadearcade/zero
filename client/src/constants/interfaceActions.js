export const INTERFACE_ACTION_EDIT = 'INTERFACE_ACTION_EDIT'
export const INTERFACE_ACTION_CLOSE = 'INTERFACE_ACTION_CLOSE'
export const INTERFACE_ACTION_PLACE = 'INTERFACE_ACTION_PLACE'
export const INTERFACE_ACTION_ADD = 'INTERFACE_ACTION_ADD'
export const INTERFACE_ACTION_CAMERA = 'INTERFACE_ACTION_CAMERA'
export const INTERFACE_ACTION_DRAW = 'INTERFACE_ACTION_DRAW'
export const INTERFACE_ACTION_IMPORT = 'INTERFACE_ACTION_IMPORT'
export const INTERFACE_ACTION_SCRIPT = 'INTERFACE_ACTION_SCRIPT'
export const INTERFACE_ACTION_PLAY = 'INTERFACE_ACTION_PLAY'
export const INTERFACE_ACTION_LOAD = 'INTERFACE_ACTION_LOAD'

export const interfaceActionsUIData = {

  [INTERFACE_ACTION_DRAW]: {
    displayName: 'Draw',
    icon: 'faPaintbrush',
    description: 'Draw brushes, colors, and sprites'
  },
  [INTERFACE_ACTION_EDIT]: {
    displayName: 'Edit',
    icon: 'faPen',
    description: 'Edit game objects'
  },
  // [INTERFACE_ACTION_CLOSE]: {
  //   displayName: 'Close',
  //   icon: 'faClose',
  //   description: 'Close the current window'
  // },
  [INTERFACE_ACTION_PLACE]: {
    displayName: 'Place',
    icon: 'faChessPawn',
    description: 'Place game objects',
  },
  [INTERFACE_ACTION_CAMERA]: {
    displayName: 'Snapshot',
    icon: 'faCameraRetro',
    description: 'Take a snapshot of the game'
  },
  [INTERFACE_ACTION_IMPORT]: {
    displayName: 'Import',
    icon: 'faBoxArchive',
    description: 'Import game assets'
  },
  [INTERFACE_ACTION_SCRIPT]: {
    displayName: 'Script',
    icon: 'faScroll',
    description: 'Write dialogues and cutscenes'
  },
  [INTERFACE_ACTION_LOAD]: {
    displayName: 'Load',
    icon: 'faDownload',
    //descrion of what load actions will do
    description: 'Load a different game, or a stage'
  },
  [INTERFACE_ACTION_PLAY]: {
    displayName: 'Play',
    icon: 'faPlay',
    description: 'Play cutscenes, dialogues, audio, and other game content'
  },
}
