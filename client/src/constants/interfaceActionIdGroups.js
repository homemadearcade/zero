export const INTERFACE_ACTION_EDIT = 'INTERFACE_ACTION_EDIT'
export const INTERFACE_ACTION_PLACE = 'INTERFACE_ACTION_PLACE'
export const INTERFACE_ACTION_CAMERA = 'INTERFACE_ACTION_CAMERA'
export const INTERFACE_ACTION_DRAW = 'INTERFACE_ACTION_DRAW'
export const INTERFACE_ACTION_IMPORT = 'INTERFACE_ACTION_IMPORT'
export const INTERFACE_ACTION_SCRIPT = 'INTERFACE_ACTION_SCRIPT'
export const INTERFACE_ACTION_PLAY = 'INTERFACE_ACTION_PLAY'
export const INTERFACE_ACTION_LOAD = 'INTERFACE_ACTION_LOAD'
export const INTERFACE_ACTION_RESIZE = 'INTERFACE_ACTION_RESIZE'
export const INTERFACE_ACTION_GRID = 'INTERFACE_ACTION_GRID'
export const INTERFACE_ACTION_COBROWSE = 'INTERFACE_ACTION_COBROWSE'
export const INTERFACE_ACTION_TOOL = 'INTERFACE_ACTION_TOOL'
export const INTERFACE_ACTION_SPRITE = 'INTERFACE_ACTION_SPRITE'
export const INTERFACE_ACTION_CURRENT_PLAYER = 'INTERFACE_ACTION_CURRENT_PLAYER'
export const INTERFACE_ACTION_STAGE = 'INTERFACE_ACTION_STAGE'
export const INTERFACE_ACTION_GAME = 'INTERFACE_ACTION_GAME'


export const interfaceActionGroupData = {
  [INTERFACE_ACTION_GAME]: {
    displayName: 'Game',
    icon: 'faGamepad',
    description: 'Actions that effect the game'
  },
  [INTERFACE_ACTION_STAGE]: {
    displayName: 'Edit Stage',
    icon: 'faMap',
    description: 'Actions that effect the stage'
  },
  [INTERFACE_ACTION_CURRENT_PLAYER]: {
    displayName: 'Edit Current Player',
    icon: 'faStreetView',
    description: 'Actions that effect the current player'
  },
  [INTERFACE_ACTION_TOOL]: {
    displayName: 'Tool',
    icon: 'faTools',
    description: 'Select a tool to use'
  },
  [INTERFACE_ACTION_SPRITE]: {
    displayName: 'Edit Sprite',
    icon: 'faImage',
    description: 'Edit a sprite for a class'
  },
  [INTERFACE_ACTION_COBROWSE]: {
    displayName: 'Cobrowse',
    icon: 'faWindowRestore',
    description: 'Control your cobrowsing users screen'
  },
  [INTERFACE_ACTION_GRID]: {
    displayName: 'Grid',
    icon: 'faTableCells',
    description: 'Do actions to the game grid'
  },
  [INTERFACE_ACTION_RESIZE]: {
    displayName: 'Resize',
    icon: 'faUpRightAndDownLeftFromCenter',
    description: 'Resize game objects'
  },
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
