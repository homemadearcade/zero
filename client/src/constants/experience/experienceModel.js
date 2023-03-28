import { LOBBY_ID_PREFIX } from "./lobbys";
import { ROLE_ID_PREFIX, EXPERIENCE_ROLE_PARTICIPANT, EXPERIENCE_ROLE_TEAM } from "./roles";

export const defaultLobbyId = LOBBY_ID_PREFIX + 'default';
export const defaultParticipantRoleId = ROLE_ID_PREFIX+ 'participant';
export const defaultGuideRoleId = ROLE_ID_PREFIX+ 'guide';

export const EXPERIENCE_CONVEYER_BELT = 'EXPERIENCE_CONVEYER_BELT';
export const EXPERIENCE_CREATE_GAME = 'EXPERIENCE_CREATE_GAME';
export const EXPERIENCE_CONVERGING_TRACKS = 'EXPERIENCE_CONVERGING_TRACKS';
export const EXPERIENCE_BATTLE_ROYALE = 'EXPERIENCE_BATTLE_ROYALE';
export const EXPERIENCE_ADVENTURE_GAME = 'EXPERIENCE_ADVENTURE_GAME';

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
      roleCategory: EXPERIENCE_ROLE_PARTICIPANT
    },
    [defaultGuideRoleId]: {
      name: 'Guide',
      roleId: defaultGuideRoleId,
      color: '#0000FF',
      isNotRemoveable: true,
      roleCategory: EXPERIENCE_ROLE_TEAM
    }
  },
  games: {},
  instructions: {},
  isRemoved: false,
}