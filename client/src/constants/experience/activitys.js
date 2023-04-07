import { CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY, WAITING_ACTIVITY } from "./constants/activitys"
import { ACTIVITY_VIEW_BROWSE, ACTIVITY_VIEW_CHATROOM, ACTIVITY_VIEW_MONOLOGUE, ACTIVITY_VIEW_PLAY_GAME, ACTIVITY_VIEW_TEXT } from "./constants/views"

export const activityToInterfaceData = {
  [CHATROOM_ACTIVITY]: {
    displayName: 'Chat',
    icon: 'faComments',
    initialView: ACTIVITY_VIEW_CHATROOM,
    viewOptions: [ACTIVITY_VIEW_CHATROOM, ACTIVITY_VIEW_MONOLOGUE],
  },
  [WAITING_ACTIVITY]: {
    displayName: 'Waiting Room',
    icon: 'faHourglassStart',
    initialView: ACTIVITY_VIEW_TEXT,
    viewOptions:[],
  },
  [GAME_ROOM_ACTIVITY]: {
    displayName: 'Game',
    isCreateable: true,
    icon: 'faGamepad',
    initialView: ACTIVITY_VIEW_PLAY_GAME,
    viewOptions: [ACTIVITY_VIEW_PLAY_GAME],
  },
  [CREDITS_ACTIVITY]: {
    displayName: 'Credits',
    icon: 'faHourglassEnd',
    initialView: ACTIVITY_VIEW_BROWSE,
    viewOptions: [ACTIVITY_VIEW_BROWSE]
  },
  [VIDEO_ACTIVITY]: { 
    displayName: 'Video',
    isCreateable: true,
    icon: 'faVideo',
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
  name: null,
  gameRoom: {
    arcadeGameMongoId: null,
    gameRoomId: null,
    gameMetadata: {}
  },
  drawingRoom: {},
  iframes: {},
  initialView: null,
  isRemoved: false
}