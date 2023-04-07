import { EXPERIENCE_ROLE_AUDIENCE, EXPERIENCE_ROLE_FACILITATOR, EXPERIENCE_ROLE_PARTICIPANT } from "./constants/roles"

export const roleToInterfaceData = {
  [EXPERIENCE_ROLE_FACILITATOR]: {
    displayName: 'Facilitator',
    icon: 'faCrown',
  },
  [EXPERIENCE_ROLE_PARTICIPANT]: {
    displayName: 'Participant',
    icon: 'faCircle',
  },
  [EXPERIENCE_ROLE_AUDIENCE]: {
    displayName: 'Audience',
    icon: 'faUsers',
  },
}

export const defaultRole = {
  name: 'Role',
  interfaceId: null,
  color: '#FFFFFF',
  isRemoved: false,
  roleCategory: EXPERIENCE_ROLE_PARTICIPANT,
}