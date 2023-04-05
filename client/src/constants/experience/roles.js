export const ROLE_ID_PREFIX = 'role-'

export const EXPERIENCE_ROLE_FACILITATOR = 'EXPERIENCE_ROLE_FACILITATOR'
export const EXPERIENCE_ROLE_PARTICIPANT = 'EXPERIENCE_ROLE_PARTICIPANT'

export const allLobbyUsersRoleId = ROLE_ID_PREFIX + 'allLobbyUsers'
export const allActivityUsersRoleId = ROLE_ID_PREFIX + 'allActivityUsers'
export const allExperienceUsersRoleId = ROLE_ID_PREFIX + 'allExperienceUsers'

export const roleToInterfaceData = {
  [EXPERIENCE_ROLE_FACILITATOR]: {
    displayName: 'Facilitator',
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