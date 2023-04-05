import { ACTION_OPEN, ACTION_UNLOCK } from "../action"
import { defaultParticipantRoleId } from "./experienceModel"

export const defaultStep = {
  skippable: false,
  stepBehavior: '',
  requirements: {
    cobrowsingRoleId: false,
    stageId: null,
    gameIsPoweredOn: false,
  },
  actionIds: [],
  actionRoleId: defaultParticipantRoleId,
  interfaceIds: [],
  effectIds: [],
  stepId: null,
  promptOrder: [],
}

export const STEP_EFFECT = 'STEP_EFFECT'
export const STEP_GAME_INSTANCE_EVENT = 'STEP_GAME_INSTANCE_EVENT'
export const STEP_LOBBY_EVENT = 'STEP_LOBBY_EVENT'
export const STEP_CHANGE_ACTIVITY = 'STEP_CHANGE_ACTIVITY'
export const STEP_OPEN_INTERFACE = 'STEP_OPEN_INTERFACE'
export const STEP_UNLOCK_INTERFACE = 'STEP_UNLOCK_INTERFACE'

export const stepBehaviorToAction = {
  [STEP_OPEN_INTERFACE]: ACTION_OPEN,
  [STEP_UNLOCK_INTERFACE]: ACTION_UNLOCK,
}

export const STEP_ID_PREFIX = 'step-'

// UMM like so all interfaceIds should get like 'how to click' 
// thing and whether or not to open cobrowsing

// yeah like when reaching the step it will turn cobrowsing on or off
// activeCobrowsing

// Open Interface
// Run Effect
// Run Animation Lobby Event

// WHAT ARE THE ROLES IN YOUR EXPERIENCE_MODEL

export const defaultConversationPrompt = {
  roleId: '',
  text: '',
  // gameEvent: '',
  // lobbyEvent: '',
}


