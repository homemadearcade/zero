import { INSTRUCTION_GAME_ROOM } from "./instructions"
import { ACTIVITY_VIEW_CHATROOM, ACTIVITY_VIEW_DRAWING, ACTIVITY_VIEW_GALLERY, ACTIVITY_VIEW_BROWSE, ACTIVITY_VIEW_MONOLOGUE, ACTIVITY_VIEW_PLAY_GAME, ACTIVITY_VIEW_SPEAKER, ACTIVITY_VIEW_TEXT } from "./views"

export const ACTIVITY_ID_PREFIX = 'activity-'

export const GAME_ROOM_ACTIVITY = 'GAME_ROOM_ACTIVITY'
export const WAITING_ACTIVITY = 'WAITING_ACTIVITY'
export const MONOLOGUE_ACTIVITY = 'MONOLOGUE_ACTIVITY'
export const CONVERSATION_ACTIVITY = 'CONVERSATION_ACTIVITY'
export const CHATROOM_ACTIVITY = 'CHATROOM_ACTIVITY'
export const CREDITS_ACTIVITY = 'CREDITS_ACTIVITY'
export const SERVICE_ACTIVITY = 'SERVICE_ACTIVITY'
export const VIDEO_ACTIVITY = 'VIDEO_ACTIVITY'
export const DRAWING_ACTIVITY = 'DRAWING_ACTIVITY'

export const activityToInterfaceData = {
  [CHATROOM_ACTIVITY]: {
    displayName: 'Chat',
    icon: 'faComments',
    initialView: ACTIVITY_VIEW_CHATROOM,
    viewOptions: [ACTIVITY_VIEW_CHATROOM, ACTIVITY_VIEW_MONOLOGUE],
    instructionsCategory: null
  },
  [WAITING_ACTIVITY]: {
    displayName: 'Waiting Room',
    icon: 'faHourglassHalf',
    initialView: ACTIVITY_VIEW_TEXT,
    viewOptions:[],
    instructionsCategory: null
  },
  [GAME_ROOM_ACTIVITY]: {
    displayName: 'Game',
    isCreateable: true,
    icon: 'faGamepad',
    initialView: ACTIVITY_VIEW_PLAY_GAME,
    viewOptions: [ACTIVITY_VIEW_PLAY_GAME],
    instructionsCategory: INSTRUCTION_GAME_ROOM
  },
  [CREDITS_ACTIVITY]: {
    displayName: 'Credits',
    icon: 'faSignature',
    initialView: ACTIVITY_VIEW_BROWSE,
    viewOptions: [ACTIVITY_VIEW_BROWSE]
  },
  [VIDEO_ACTIVITY]: { 
    displayName: 'Video',
    isCreateable: true,
    icon: 'faComments',
    initialView: ACTIVITY_VIEW_MONOLOGUE,
    viewOptions: [ACTIVITY_VIEW_MONOLOGUE]
  },
  // [DRAWING_ACTIVITY]: {
  //   displayName: 'Drawing',
  //   isCreateable: true,
  //   icon: 'faPaintbrush',
  //   initialView: ACTIVITY_VIEW_DRAWING,
  //   viewOptions: [ACTIVITY_VIEW_DRAWING]
  // },
}
export const defaultActivity = {
  activityCategory: null,
  activityId: null,
  instructionsByRoleId: {},
  instructions: {},
  name: null,
  gameRoom: {},
  drawingRoom: {},
  iframes: {},
  initialView: {},
  isRemoved: false
}