export const ROLE_ID_PREFIX = 'role-'

export const EXPERIENCE_ROLE_TEAM = 'EXPERIENCE_ROLE_TEAM'
export const EXPERIENCE_ROLE_PARTICIPANT = 'EXPERIENCE_ROLE_PARTICIPANT'

export const roleToInterfaceData = {
  [EXPERIENCE_ROLE_TEAM]: {
    displayName: 'Team',
    icon: 'faCrown',
  },
  [EXPERIENCE_ROLE_PARTICIPANT]: {
    displayName: 'Participant',
    icon: 'faCircle',
  },
}

export const defaultRole = {
  name: 'Role',
  interfaceId: null,
  color: '#FFFFFF',
  isRemoved: false,
  roleCategory: EXPERIENCE_ROLE_PARTICIPANT,
}