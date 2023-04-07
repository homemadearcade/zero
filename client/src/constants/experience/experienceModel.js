import { EXPERIENCE_ROLE_AUDIENCE, EXPERIENCE_ROLE_FACILITATOR, EXPERIENCE_ROLE_PARTICIPANT } from "./constants";
import { defaultAudienceRoleId, defaultGuideRoleId, defaultLobbyId, defaultParticipantRoleId } from "./constants";

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