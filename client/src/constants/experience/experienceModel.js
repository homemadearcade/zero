import { defaultPerformerRoleId, EXPERIENCE_ROLE_AUDIENCE, EXPERIENCE_ROLE_FACILITATOR, EXPERIENCE_ROLE_PARTICIPANT, EXPERIENCE_ROLE_PERFORMER } from "./constants";
import { defaultAudienceRoleId, defaultGuideRoleId, defaultLobbyId, defaultParticipantRoleId } from "./constants";

export const defaultExperienceModel = {
  lobbys: {
    [defaultLobbyId]: {
      name: 'Welcome',
      lobbyId: defaultLobbyId,
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
      roleCategory: EXPERIENCE_ROLE_FACILITATOR
    },
    [defaultPerformerRoleId]: {
      name: 'Performer',
      roleId: defaultPerformerRoleId,
      color: '#FFFF00',
      isRemoved: true,
      roleCategory: EXPERIENCE_ROLE_PERFORMER
    },
    [defaultAudienceRoleId]: {
      name: 'Audience',
      roleId: defaultAudienceRoleId,
      color: '#FFFFFF',
      isNotRemoveable: true,
      roleCategory: EXPERIENCE_ROLE_AUDIENCE
    },
  },
  gameRooms: {},
  canvasRooms: {},
  instructions: {},
  isRemoved: false,
}