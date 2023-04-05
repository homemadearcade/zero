import { INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from "./instructions";

export const defaultExperienceEffect = {
  experienceEffectId: null,
  experienceEffectBehavior: null, 
  interfaceId: null,
  activityId: null,
  roleId: null,
  actionId: null,
  effectId: null,
  name: '',
  customSelectorGroup: '',
  isRemoved: false,
}

export const EXPERIENCE_EFFECT_ID_PREFIX = 'ee-'

export const EXPERIENCE_EFFECT_GAME_EFFECT = 'EXPERIENCE_EFFECT_GAME_EFFECT';

export const EXPERIENCE_EFFECT_CHANGE_ACTIVITY = 'EXPERIENCE_EFFECT_CHANGE_ACTIVITY';
export const EXPERIENCE_EFFECT_CHANGE_INSTRUCTION = 'EXPERIENCE_EFFECT_CHANGE_INSTRUCTION';
export const EXPERIENCE_EFFECT_CHANGE_LOBBY = 'EXPERIENCE_EFFECT_CHANGE_LOBBY';

export const EXPERIENCE_EFFECT_UNLOCK_INTERFACE = 'EXPERIENCE_EFFECT_UNLOCK_INTERFACE';
export const EXPERIENCE_EFFECT_LOCK_INTERFACE = 'EXPERIENCE_EFFECT_LOCK_INTERFACE';
export const EXPERIENCE_EFFECT_ACTION = 'EXPERIENCE_EFFECT_ACTION';

export const experienceEffectInterfaceIdData = {
  [EXPERIENCE_EFFECT_GAME_EFFECT]: {
    displayName: 'Game Effect',
    icon: 'faGamepad',
  },
  [EXPERIENCE_EFFECT_CHANGE_ACTIVITY]: {
    displayName: 'Change Activity',
    icon: 'faDoorOpen',
  },
  [EXPERIENCE_EFFECT_CHANGE_INSTRUCTION]: {
    displayName: 'Change Instruction',
    icon: 'faDoorOpen',
  },
  [EXPERIENCE_EFFECT_CHANGE_LOBBY]: {
    displayName: 'Change Lobby',
    icon: 'faDoorOpen',
  },
  [EXPERIENCE_EFFECT_UNLOCK_INTERFACE]: {
    displayName: 'Unlock Interface',
    icon: 'faUnlock',
  },
  [EXPERIENCE_EFFECT_LOCK_INTERFACE]: {
    displayName: 'Lock Interface',
    icon: 'faLock',
  },
  [EXPERIENCE_EFFECT_ACTION]: {
    displayName: 'Action',
    icon: 'faHandPointUp',
  },
}

export const instructionCategoryToExperienceEffects = {
  [INSTRUCTION_GAME_ROOM]: [EXPERIENCE_EFFECT_ACTION, EXPERIENCE_EFFECT_GAME_EFFECT, EXPERIENCE_EFFECT_UNLOCK_INTERFACE],
  [INSTRUCTION_LOBBY]: [EXPERIENCE_EFFECT_CHANGE_ACTIVITY],
}
