import { GAME_ROOM_VIDEO_IID, LOBBY_MEMBER_VIDEO_IID, VIDEO_ACTIVITY_VIDEO_IID, CURRENT_COBROWSING_VIDEO_IID, PEEK_VIDEO_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_ROOM_VIDEO_IID]: {
    contentPriority: 1,
    isDefaultUnlocked: true
  },
  [PEEK_VIDEO_IID] : {
    contentPriority: 100,
    isDefaultUnlocked: true
  },
  [VIDEO_ACTIVITY_VIDEO_IID] : {
    contentPriority: 10,
    isDefaultUnlocked: true
  },
  [CURRENT_COBROWSING_VIDEO_IID]: {
    contentPriority: 2,
    isDefaultUnlocked: true
  },
  [LOBBY_MEMBER_VIDEO_IID] : {
    contentPriority: 101,
    isDefaultUnlocked: true
  }
}
