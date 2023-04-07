import { LOBBY_DID } from "./lobbys";
import { ROLE_DID, EXPERIENCE_ROLE_PARTICIPANT, EXPERIENCE_ROLE_FACILITATOR, EXPERIENCE_ROLE_AUDIENCE } from "./roles";

export const defaultLobbyId = LOBBY_DID + 'default';
export const defaultParticipantRoleId = ROLE_DID+ 'participant';
export const defaultGuideRoleId = ROLE_DID+ 'guide';
export const defaultAudienceRoleId = ROLE_DID+ 'audience';

export const EXPERIENCE_PRESET_CONVEYER_BELT = 'EXPERIENCE_PRESET_CONVEYER_BELT';
export const EXPERIENCE_PRESET_CREATE_GAME = 'EXPERIENCE_PRESET_CREATE_GAME';
export const EXPERIENCE_PRESET_CONVERGING_TRACKS = 'EXPERIENCE_PRESET_CONVERGING_TRACKS';
export const EXPERIENCE_PRESET_BATTLE_ROYALE = 'EXPERIENCE_PRESET_BATTLE_ROYALE';
export const EXPERIENCE_PRESET_ADVENTURE_GAME = 'EXPERIENCE_PRESET_ADVENTURE_GAME';

export const SINGLE_LOBBY_EXPERIENCE = 'SINGLE_LOBBY_EXPERIENCE';
export const MULTI_LOBBY_EXPERIENCE = 'MULTI_LOBBY_EXPERIENCE';
export const DYNAMIC_LOBBY_EXPERIENCE = 'DYNAMIC_LOBBY_EXPERIENCE';

export const defaultExperienceModel = {
  lobbys: {
    [defaultLobbyId]: {
      name: 'Welcome',
      lobbyId: defaultLobbyId,
      activitys: {},
      isNotRemoveable: true
    }
  },
  experienceEffects: {},
  activitys: {},
  roles: {
    [defaultAudienceRoleId]: {
      name: 'Audience',
      roleId: defaultAudienceRoleId,
      color: '#FF0000',
      isNotRemoveable: true,
      roleCategory: EXPERIENCE_ROLE_AUDIENCE
    },
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
      roleCategory: EXPERIENCE_ROLE_FACILITATOR
    }
  },
  gameRooms: {},
  canvasRooms: {},
  instructions: {},
  isRemoved: false,
}