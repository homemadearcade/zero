import { ACTIVITY_ID_PREFIX, INSTRUCTION_ID_PREFIX, LOBBY_ID_PREFIX, ROLE_ID_PREFIX } from "../constants";

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

  return {
    isNotValid: true,
  }
}