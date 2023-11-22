import { EDIT_GAME_SCOPE_ANYONE, EDIT_GAME_SCOPE_EXPERIENCE_INSTANCE, EDIT_GAME_SCOPE_ONLY_ME, EDIT_GAME_SCOPE_USER_LIST, PLAY_GAME_SCOPE_ARCADE, PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE, PLAY_GAME_SCOPE_FEATURED, PLAY_GAME_SCOPE_UNLISTED, PLAY_GAME_SCOPE_USER_PROFILE } from "../gameModel"

export const playScopeInterfaceData = {
  [PLAY_GAME_SCOPE_EXPERIENCE_INSTANCE]: {
    name: 'Temporary',
    appAdminOnly: true,
    description: 'This game was created for a lobby and will be deleted automatically',
    icon: 'faHourglassEnd',
  },
  [PLAY_GAME_SCOPE_UNLISTED]: {
    name: 'Unlisted',
    description: 'Only users with the link can play this game.',
    icon: 'faLock',
  },
  // [PLAY_GAME_SCOPE_USER_PROFILE]: {
  //   name: 'User Profile',
  //   description: 'Users who visit your profile can play this game.',
  //   icon: 'faUser',
  // },
  // [PLAY_GAME_SCOPE_FRIENDS]: {
  //   name: 'Friends',
  //   description: 'Only your friends can play this game.',
  //   icon: 'faUserFriends',
  // },
  // [PLAY_GAME_SCOPE_FRIENDS_OF_FRIENDS]: {
  //   name: 'Friends of Friends',
  //   description: 'Only your friends and their friends can play this game.',
  //   icon: 'faUsers',
  // },
  [PLAY_GAME_SCOPE_ARCADE]: {
    name: 'Arcade',
    description: 'Users of Homemade Arcade can play this game.',
    icon: 'faGamepad',
  },
  [PLAY_GAME_SCOPE_FEATURED]: {
    name: 'Featured',
    appAdminOnly: true,
    description: 'This game will be featured on the Homemade Arcade homepage for anyone to play.',
    icon: 'faStar',
  },
}

export const editScopeInterfaceData = {
  [EDIT_GAME_SCOPE_EXPERIENCE_INSTANCE]: {
    name: 'Temporary',
    appAdminOnly: true,
    description: 'This game was created for a lobby and will be deleted automatically',
    icon: 'faHourglassEnd',
  },
  [EDIT_GAME_SCOPE_ONLY_ME]: {
    name: 'Only Me',
    description: 'Only you can edit this game.',
    icon: 'faLock',
  },
  // [EDIT_GAME_SCOPE_USER_LIST]: {
  //   name: 'User List',
  //   description: 'Only users on the list can edit this game.',
  //   icon: 'faUserFriends',
  // },
  [EDIT_GAME_SCOPE_ANYONE]: {
    name: 'Anyone',
    description: 'Users of Homemade Arcade can edit this game.',
    icon: 'faGlobe',
  },
}