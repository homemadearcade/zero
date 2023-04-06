export const ROLE_DID = 'role-'

export const EXPERIENCE_ROLE_FACILITATOR = 'EXPERIENCE_ROLE_FACILITATOR'
export const EXPERIENCE_ROLE_PARTICIPANT = 'EXPERIENCE_ROLE_PARTICIPANT'
export const EXPERIENCE_ROLE_AUDIENCE = 'EXPERIENCE_ROLE_AUDIENCE'

export const allLobbyUsersRoleId = ROLE_DID + 'allLobbyUsers'
export const allActivityUsersRoleId = ROLE_DID + 'allActivityUsers'
export const allExperienceUsersRoleId = ROLE_DID + 'allExperienceUsers'

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