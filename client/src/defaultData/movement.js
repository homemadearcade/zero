import { ADVENTURER_CONTROLS, CAR_CONTROLS, FLOATER_CONTROLS, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_AND_DOWN, PLATFORMER_CONTROLS, SPACESHIP_CONTROLS } from "../constants"
import { defaultMovement } from "./class"

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const movementToParemeters = {
  [MOVEMENT_SIDE_TO_SIDE]: {
    velocityX: 'Speed',
  },
  [MOVEMENT_UP_AND_DOWN]: {
    velocityY: 'Speed',
  },
  [MOVEMENT_TURN_ON_COLLIDE]: {
    speed: true,
  },
  [MOVEMENT_JUMP]: {
    gravityY: 'Jump Distance',
    velocityY: true,
    velocityX: true,
  },
  [MOVEMENT_FOLLOW_PLAYER]: {
    speed: true
  },
  [MOVEMENT_NONE]: {
    gravityY: true,
    gravityX: true,
    velocityY: true,
    velocityX: true,
  },
  [SPACESHIP_CONTROLS]: {
    speed: 'Thrust Speed',
    dragX: true,
    dragY: true
  },
  [ADVENTURER_CONTROLS]: {
    speed: true,
    dragX: true,
    dragY: true
  },
  [PLATFORMER_CONTROLS]: {
    jumpSpeed: true,
    speed: true,
    dragX: true,
  },
  [FLOATER_CONTROLS]: {
    jumpSpeed: true,
    floatSpeed: true,
    speed: true,
    dragX: true,
  },
  [CAR_CONTROLS]: {
    speed: true,
    dragX: true,
    dragY: true
  }
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PATTERNS
export const sideToSideDefaults = {
  movement: {
    pattern: MOVEMENT_SIDE_TO_SIDE,
    velocityX: 50,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const upAndDownDefaults = {
  movement: {
    pattern: MOVEMENT_UP_AND_DOWN,
    velocityX: 0,
    velocityY: 50,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const turnOnCollideDefaults = {
  movement: {
    pattern: MOVEMENT_TURN_ON_COLLIDE,
    gravityY: 0,
    gravityX: 0,
    velocityX: 50,
    velocityY: 0,
    speed: 100,
  },
}

export const followPlayerDefaults = {
  movement: {
    pattern: MOVEMENT_FOLLOW_PLAYER,
    velocityX: 0,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    speed: 100,
  },
}

export const jumpDefaults = {
  movement: {
    pattern: MOVEMENT_JUMP,
    gravityY: 50,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const noneDefaults = {
  ...defaultMovement
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// CONTROLS
export const spaceshipDefaults = {
  movement: {
    controls: SPACESHIP_CONTROLS,
    dragX: 0.25,
    dragY: 0.25,
    disableDownKey: true,
    allowDoubleJump: false,
  },
}

export const platformerDefaults = {
  movement: {
    controls: PLATFORMER_CONTROLS,
    dragX: 0.1,
    dragY: 1,
    allowDoubleJump: false,
    disableDownKey: false,
  },
}

export const adventurerDefaults = {
  movement: {
    controls: ADVENTURER_CONTROLS,
    allowDoubleJump: false,
    disableDownKey: false,
    dragX: 0,
    dragY: 0,
  },
}

export const carDefaults = {
  movement: {
    controls: CAR_CONTROLS,
    allowDoubleJump: false,
    disableDownKey: false,
    dragX: 0.25,
    dragY: 0.25,
  },
}

export const floaterDefaults = {
  movement: {
    controls: FLOATER_CONTROLS,
    allowDoubleJump: true,
    disableDownKey: false,
    dragX: 0.1,
    dragY: 1,
  },
}

export const controlsToKeys = {
  [SPACESHIP_CONTROLS]: {
    speed: true,
    dragX: true,
    dragY: true
  },
  [ADVENTURER_CONTROLS]: {
    speed: true,
    dragX: true,
    dragY: true
  },
  [PLATFORMER_CONTROLS]: {
    jumpSpeed: true,
    speed: true,
    dragX: true,
  },
  [FLOATER_CONTROLS]: {
    jumpSpeed: true,
    floatSpeed: true,
    speed: true,
    dragX: true,
  },
  [CAR_CONTROLS]: {
    speed: true,
    dragX: true,
    dragY: true
  }
}

