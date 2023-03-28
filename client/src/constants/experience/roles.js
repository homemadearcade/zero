export const ROLE_ID_PREFIX = 'role-'

export const ROLE_TEAM = 'ROLE_TEAM'
export const ROLE_PARTICIPANT = 'ROLE_PARTICIPANT'

export const roleToInterfaceData = {
  [ROLE_TEAM]: {
    displayName: 'Team',
    icon: 'faCrown',
  },
  [ROLE_PARTICIPANT]: {
    displayName: 'Participant',
    icon: 'faCircle',
  },
}

export const defaultRole = {
  name: 'Role',
  interfaceId: null,
  color: '#FFFFFF',
  isRemoved: false,
  roleCategory: ROLE_PARTICIPANT,
}