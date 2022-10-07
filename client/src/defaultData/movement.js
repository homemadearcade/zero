import { ADVENTURER_CONTROLS, CAR_CONTROLS, FLOATER_CONTROLS, JETPACK_CONTROLS, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_AND_DOWN, PLATFORMER_CONTROLS, SPACESHIP_CONTROLS } from "../constants"
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
    speed: 'Move Speed',
    dragX: true,
    dragY: true
  },
  [PLATFORMER_CONTROLS]: {
    jumpSpeed: true,
    speed: 'Move Speed',
    dragX: true,
  },
  [FLOATER_CONTROLS]: {
    jumpSpeed: true,
    floatSpeed: true,
    speed: 'Move Speed',
    dragX: true,
    cooldown: 'Float Cooldown'
  },
  [CAR_CONTROLS]: {
    speed: 'Accelerate/Reverse Speed',
    dragX: true,
    dragY: true
  },
  [JETPACK_CONTROLS]: {
    jumpSpeed: 'Thrust Speed',
    speed: 'Move Speed',
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
    cooldown: 200,
    dragX: 0.1,
    dragY: 1,
  },
}

export const jetpackDefaults = {
  movement: {
    controls: JETPACK_CONTROLS,
    // jumpSpeed: 100,
    dragX: 0,
    dragY: 1,
    disableDownKey: true,
  },
}

export const controlsToKeys = {
  [SPACESHIP_CONTROLS]: {
    up: 'Thrust',
    left: 'Rotate Left',
    right: 'Rotate Right',
    down: null
  },
  [ADVENTURER_CONTROLS]: {
    up: 'Move Up',
    left: 'Move Left',
    right: 'Move Right',
    down: 'Move Down'
  },
  [PLATFORMER_CONTROLS]: {
    up: 'Jump (On Ground)',
    left: 'Move Left',
    right: 'Move Right',
    down: 'Move Down'
  },
  [FLOATER_CONTROLS]: {
    up: 'Jump (On Ground)',
    up2: 'Float (In Air)',
    left: 'Move Left',
    right: 'Move Right',
    down: 'Move Down'
  },
  [CAR_CONTROLS]: {
    up: 'Accelerate',
    left: 'Turn Left',
    right: 'Turn Right',
    down: 'Reverse'
  },
  [JETPACK_CONTROLS]: {
    up: 'Thrust',
    left: 'Move Left',
    right: 'Move Right',
    down: null
  }
}

