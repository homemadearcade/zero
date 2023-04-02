import { ACTIVITY_ID_PREFIX, CORE_LIBRARY_USER_MONGO_ID, INSTRUCTION_ID_PREFIX, LOBBY_ID_PREFIX, ROLE_ID_PREFIX } from "../constants";
import { GAME_ROOM_ID_PREFIX } from "../constants/experience/gameRoom";
import { DATA_SOURCE_CORE_LIBRARY, DATA_SOURCE_USER_LIBRARY } from "../game/constants";

export function getIdInformation(id) {
  if(id.includes(ROLE_ID_PREFIX)) return {
    isRoleId: true,
  }

  if(id.includes(INSTRUCTION_ID_PREFIX)) return {
    isInstructionId: true,
  }

  if(id.includes(ACTIVITY_ID_PREFIX)) return {
    isActivityId: true,
  }

  if(id.includes(LOBBY_ID_PREFIX)) return {
    isLobbyId: true,
  }

  if(id.includes(GAME_ROOM_ID_PREFIX)) return {
    isGameRoomId: true,
  }

  return {
    isNotValid: true,
  }
}

export function getDataSourceFromUserMongoId(userMongoId) {
  return userMongoId === CORE_LIBRARY_USER_MONGO_ID ? DATA_SOURCE_CORE_LIBRARY : DATA_SOURCE_USER_LIBRARY
}