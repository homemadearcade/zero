import { GAME_EDITOR_VIDEO_IID, LOBBY_MEMBER_VIDEO_IID, MONOLOGUE_ACTIVITY_VIDEO_IID, PARTICIPANT_VIDEO_IID, PEEK_VIDEO_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_EDITOR_VIDEO_IID]: {
    contentPriority: 0,
  },
  [PEEK_VIDEO_IID] : {
    contentPriority: 100,
  },
  [MONOLOGUE_ACTIVITY_VIDEO_IID] : {
    contentPriority: 10
  },
  [PARTICIPANT_VIDEO_IID]: {
    contentPriority: 1
  },
  [LOBBY_MEMBER_VIDEO_IID] : {
    contentPriority: 101
  }
}
