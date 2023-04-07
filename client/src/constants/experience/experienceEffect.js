import { INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from "./instructions";

export const defaultExperienceEffect = {
  experienceEffectId: null,
  experienceEffectBehavior: null, 
  interfaceId: null,
  activityId: null,
  roleId: null,
  interfaceActionId: null,
  effectId: null,
  title: '',
  customSelectorGroup: '',
  isRemoved: false,
}

export const EXPERIENCE_EFFECT_DID = 'ee-'

export const EXPERIENCE_EFFECT_GAME_EFFECT = 'EXPERIENCE_EFFECT_GAME_EFFECT';

export const EXPERIENCE_EFFECT_CHANGE_ACTIVITY = 'EXPERIENCE_EFFECT_CHANGE_ACTIVITY';
export const EXPERIENCE_EFFECT_CHANGE_INSTRUCTION = 'EXPERIENCE_EFFECT_CHANGE_INSTRUCTION';
export const EXPERIENCE_EFFECT_CHANGE_LOBBY = 'EXPERIENCE_EFFECT_CHANGE_LOBBY';

export const EXPERIENCE_EFFECT_OPEN_TRANSITION = 'EXPERIENCE_EFFECT_OPEN_TRANSITION'
export const EXPERIENCE_EFFECT_CLOSE_TRANSITION = 'EXPERIENCE_EFFECT_CLOSE_TRANSITION'
export const EXPERIENCE_EFFECT_LEAVE_CONTROL_BOOTH = 'EXPERIENCE_EFFECT_LEAVE_CONTROL_BOOTH'
export const EXPERIENCE_EFFECT_GO_TO_CONTROL_BOOTH = 'EXPERIENCE_EFFECT_GO_TO_CONTROL_BOOTH'
export const EXPERIENCE_EFFECT_GO_TO_INSTRUCTION_STEP = 'EXPERIENCE_EFFECT_GO_TO_INSTRUCTION_STEP'

export const experienceEffectInterfaceIdData = {
  [EXPERIENCE_EFFECT_GAME_EFFECT]: {
    displayName: 'Game Effect',
    icon: 'faGamepad',
  },
  [EXPERIENCE_EFFECT_CHANGE_ACTIVITY]: {
    displayName: 'Change Activity',
    icon: 'faShuffle',
  },
  [EXPERIENCE_EFFECT_CHANGE_INSTRUCTION]: {
    displayName: 'Change Instruction',
    icon: 'faListOl',
  },
  [EXPERIENCE_EFFECT_CHANGE_LOBBY]: {
    displayName: 'Change Lobby',
    icon: 'faDoorOpen',
  },
  [EXPERIENCE_EFFECT_OPEN_TRANSITION]: {
    displayName: 'Open Transition',
    icon: 'faStar',
  },
  [EXPERIENCE_EFFECT_CLOSE_TRANSITION]: {
    displayName: 'Close Transition',
    icon: 'faStar',
    icon2: 'faArrowsDownToLine'
  },
  [EXPERIENCE_EFFECT_LEAVE_CONTROL_BOOTH]: {
    displayName: 'Leave Control Booth and go to current Activity',
    icon: 'faPersonBooth',
  },
  [EXPERIENCE_EFFECT_GO_TO_CONTROL_BOOTH]: {
    displayName: 'Go to Control Booth',
    icon: 'faPersonBooth',
  },
}

export const instructionCategoryToExperienceEffects = {
  [INSTRUCTION_GAME_ROOM]: [
    EXPERIENCE_EFFECT_GAME_EFFECT,
    EXPERIENCE_EFFECT_CLOSE_TRANSITION,
    EXPERIENCE_EFFECT_OPEN_TRANSITION,
    EXPERIENCE_EFFECT_GO_TO_CONTROL_BOOTH,
    EXPERIENCE_EFFECT_GO_TO_INSTRUCTION_STEP,
  ],
  [INSTRUCTION_LOBBY]: [
    EXPERIENCE_EFFECT_CHANGE_ACTIVITY,
    EXPERIENCE_EFFECT_LEAVE_CONTROL_BOOTH,
    EXPERIENCE_EFFECT_CLOSE_TRANSITION,
    EXPERIENCE_EFFECT_OPEN_TRANSITION,
    EXPERIENCE_EFFECT_GO_TO_INSTRUCTION_STEP
  ],
}
