import { EDIT_GAME_SCOPE_ANYONE, EDIT_GAME_SCOPE_ONLY_ME, EDIT_GAME_SCOPE_USER_LIST, PLAY_GAME_SCOPE_ARCADE, PLAY_GAME_SCOPE_FEATURED, PLAY_GAME_SCOPE_ONLY_ME } from "../gameModelDefaults"

export const playScopeInterfaceData = {
  [PLAY_GAME_SCOPE_ONLY_ME]: {
    name: 'Only Me',
    description: 'Only you can play this game.',
    icon: 'faLock',
  },
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
    adminOnly: true,
    description: 'This game will be featured on the Homemade Arcade homepage for anyone to play.',
    icon: 'faStar',
  },
}

export const editScopeInterfaceData = {
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