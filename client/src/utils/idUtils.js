import { ACTIVITY_DID, INSTRUCTION_DID, LOBBY_DID, ROLE_DID } from "../constants";
import { GAME_ROOM_DID } from "../constants/experience/gameRoom";

export function getIdInformation(id) {
  if(id.includes(ROLE_DID)) return {
    isRoleId: true,
  }

  if(id.includes(INSTRUCTION_DID)) return {
    isInstructionId: true,
  }

  if(id.includes(ACTIVITY_DID)) return {
    isActivityId: true,
  }

  if(id.includes(LOBBY_DID)) return {
    isLobbyId: true,
  }

  if(id.includes(GAME_ROOM_DID)) return {
    isGameRoomId: true,
  }

  return {
    isNotValid: true,
  }
}