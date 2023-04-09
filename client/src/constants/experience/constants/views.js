export const ACTIVITY_VIEW_MONOLOGUE = 'ACTIVITY_VIEW_MONOLOGUE'
export const ACTIVITY_VIEW_GALLERY = 'ACTIVITY_VIEW_GALLERY'
export const ACTIVITY_VIEW_SPEAKER = 'ACTIVITY_VIEW_SPEAKER'
export const ACTIVITY_VIEW_BROWSE = 'ACTIVITY_VIEW_BROWSE'
export const ACTIVITY_VIEW_CHATROOM = 'ACTIVITY_VIEW_CHATROOM'
export const ACTIVITY_VIEW_PLAY_GAME = 'ACTIVITY_VIEW_PLAY_GAME'
export const ACTIVITY_VIEW_WATCH_GAME = 'ACTIVITY_VIEW_WATCH_GAME'
export const ACTIVITY_VIEW_DRAWING = 'ACTIVITY_VIEW_DRAWING'
export const ACTIVITY_VIEW_TEXT = 'ACTIVITY_VIEW_TEXT'
export const ACTIVITY_VIEW_MY_VIDEO = 'ACTIVITY_VIEW_MY_VIDEO'

// mapping from activity view to interface data 
export const activityViewToInterfaceData = {
  [ACTIVITY_VIEW_MONOLOGUE]: {
    displayName: 'Monologue',
    icon: 'fa1',
  },
  [ACTIVITY_VIEW_GALLERY]: {
    displayName: 'Gallery',
    icon: 'faTableCellsLarge',
  },
  [ACTIVITY_VIEW_SPEAKER]: {
    displayName: 'Speaker',
    icon: 'faBullhorn',
  },
  [ACTIVITY_VIEW_BROWSE]: {
    displayName: 'Browse',
    icon: 'faWindowMaximize',
  },
  [ACTIVITY_VIEW_CHATROOM]: {
    displayName: 'Chat',
    icon: 'faComments',
  },
  [ACTIVITY_VIEW_PLAY_GAME]: {
    displayName: 'Play',
    icon: 'faGamepad',
  },
  [ACTIVITY_VIEW_WATCH_GAME]: {
    displayName: 'Watch',
    icon: 'faGamepad',
  },
  [ACTIVITY_VIEW_DRAWING]: {
    displayName: 'Drawing',
    icon: 'faPaintbrush',
  },
  [ACTIVITY_VIEW_TEXT]: {
    displayName: 'Text',
    icon: 'faFont',
  },
  [ACTIVITY_VIEW_MY_VIDEO]: {
    displayName: 'My Video',
    icon: 'faUser',
  },
}
