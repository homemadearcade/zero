export const APP_ADMIN_ROLE = 'APP_ADMIN_ROLE';

export const GAME_EDITOR_EXPERT_ROLE = 'GAME_EDITOR_EXPERT_ROLE';

export const CREATOR_BETA_ROLE = 'CREATOR_BETA_ROLE';

export const userRoleInterfaceData = {
  [APP_ADMIN_ROLE]: {
    name: 'App Admin',
    description: 'Can edit any game, any experience, any user, add lobbies, and change the app settings',
  },
  [GAME_EDITOR_EXPERT_ROLE]: {
    name: 'Game Editor Expert',
    description: 'Has all interface ids unlocked for all experiences',
  },
  [CREATOR_BETA_ROLE]: {
    name: 'Creator Beta',
    description: 'Has access to the Experience-Beta program',
  },
}