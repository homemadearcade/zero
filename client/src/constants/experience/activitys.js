import { CHATROOM_ACTIVITY, CREDITS_ACTIVITY, GAME_ROOM_ACTIVITY, VIDEO_ACTIVITY, WAITING_ROOM } from "./constants/activitys"
import { ACTIVITY_VIEW_BROWSE, ACTIVITY_VIEW_CHATROOM, ACTIVITY_VIEW_FACILITATORS, ACTIVITY_VIEW_GAME_HIDDEN, ACTIVITY_VIEW_MY_INFORMATION, ACTIVITY_VIEW_PARTICIPANTS, ACTIVITY_VIEW_PLAY_GAME, ACTIVITY_VIEW_TEXT } from "./constants/views"

export const activityToInterfaceData = {
  [CHATROOM_ACTIVITY]: {
    displayName: 'Chat',
    icon: 'faComments',
    initialViewCategory: ACTIVITY_VIEW_CHATROOM,
    viewOptions: [ACTIVITY_VIEW_CHATROOM],
  },
  [WAITING_ROOM]: {
    displayName: 'Waiting Room',
    icon: 'faHourglassStart',
    initialViewCategory: ACTIVITY_VIEW_TEXT,
    viewOptions:[ACTIVITY_VIEW_TEXT, ACTIVITY_VIEW_MY_INFORMATION],
  },
  [GAME_ROOM_ACTIVITY]: {
    displayName: 'Game',
    isCreateable: true,
    icon: 'faGamepad',
    initialViewCategory: ACTIVITY_VIEW_PLAY_GAME,
    viewOptions: [ACTIVITY_VIEW_PLAY_GAME, ACTIVITY_VIEW_FACILITATORS, ACTIVITY_VIEW_GAME_HIDDEN],
  },
  [CREDITS_ACTIVITY]: {
    displayName: 'Credits',
    icon: 'faHourglassEnd',
    initialViewCategory: ACTIVITY_VIEW_BROWSE,
    viewOptions: [ACTIVITY_VIEW_BROWSE]
  },
  [VIDEO_ACTIVITY]: { 
    displayName: 'Video',
    isCreateable: true,
    icon: 'faVideo',
    initialViewCategory: ACTIVITY_VIEW_FACILITATORS,
    viewOptions: [ACTIVITY_VIEW_FACILITATORS, ACTIVITY_VIEW_PARTICIPANTS]
  },
  // [DRAWING_ACTIVITY]: {
  //   displayName: 'Drawing',
  //   isCreateable: true,
  //   icon: 'faPaintbrush',
  //   initialViewCategory: ACTIVITY_VIEW_DRAWING,
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
  },
  drawingRoom: {},
  iframes: {},
  initialViewCategory: null,
  isRemoved: false
}