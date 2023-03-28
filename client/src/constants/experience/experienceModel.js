import { LOBBY_ID_PREFIX } from "./lobbys";
import { ROLE_ID_PREFIX, ROLE_PARTICIPANT, ROLE_TEAM } from "./roles";

export const defaultLobbyId = LOBBY_ID_PREFIX + 'default';
export const defaultParticipantRoleId = ROLE_ID_PREFIX+ 'participant';
export const defaultGuideRoleId = ROLE_ID_PREFIX+ 'guide';

export const defaultExperienceModel = {
  lobbys: {
    [defaultLobbyId]: {
      name: 'Welcome',
      lobbyId: defaultLobbyId,
      activitys: {},
      isNotRemoveable: true
    }
  },
  activitys: {},
  roles: {
    [defaultParticipantRoleId]: {
      name: 'Participant',
      roleId: defaultParticipantRoleId,
      color: '#00FF00',
      isNotRemoveable: true,
      roleCategory: ROLE_PARTICIPANT
    },
    [defaultGuideRoleId]: {
      name: 'Guide',
      roleId: defaultGuideRoleId,
      color: '#0000FF',
      isNotRemoveable: true,
      roleCategory: ROLE_TEAM
    }
  },
  instructions: {},
  isRemoved: false,
}