import { LOBBY_ID_PREFIX } from "./lobbys";
import { ROLE_ID_PREFIX } from "./roles";

export const defaultLobbyId = LOBBY_ID_PREFIX + 'default';
export const defaultParticipantRoleId = ROLE_ID_PREFIX+ 'participant';
export const defaultGuideRoleId = ROLE_ID_PREFIX+ 'guide';

export const defaultExperienceModel = {
  lobbys: {
    [defaultLobbyId]: {
      name: 'Default Lobby',
      lobbyId: defaultLobbyId,
      activitys: {}
    }
  },
  roles: {
    [defaultParticipantRoleId]: {
      name: 'Participant',
      roleId: defaultParticipantRoleId,
    },
    [defaultGuideRoleId]: {
      name: 'Guide',
      roleId: defaultGuideRoleId,
    }
  }
}