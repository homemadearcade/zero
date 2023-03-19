import { MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_AND_DOWN, MOVEMENT_TURN_RANDOMLY, MOVEMENT_FOLLOW_CLASS } from "../"
import { defaultMovement } from "./class"

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const movementBehaviorToInterface = {
  [MOVEMENT_SIDE_TO_SIDE]: {
    velocityX: 'Speed',
  },
  [MOVEMENT_UP_AND_DOWN]: {
    velocityY: 'Speed',
  },
  [MOVEMENT_TURN_ON_COLLIDE]: {
    speed: true,
  },
  [MOVEMENT_TURN_RANDOMLY]: {
    speed: true,
  },
  [MOVEMENT_JUMP]: {
    gravityY: 'Jump Distance',
    velocityY: true,
    velocityX: true,
  },
  [MOVEMENT_FOLLOW_PLAYER]: {
    speed: true,
  },
  [MOVEMENT_FOLLOW_CLASS]: {
    speed: true,
    class: true
  },
  [MOVEMENT_NONE]: {
    gravityY: false,
    gravityX: false,
    velocityY: false,
    velocityX: false,
    ignoreGravity: true
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
    movementBehavior: MOVEMENT_SIDE_TO_SIDE,
    velocityX: 50,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    ignoreGravity: true
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const upAndDownDefaults = {
  movement: {
    movementBehavior: MOVEMENT_UP_AND_DOWN,
    velocityX: 0,
    velocityY: 50,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    ignoreGravity: true
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const turnOnCollideDefaults = {
  movement: {
    movementBehavior: MOVEMENT_TURN_ON_COLLIDE,
    gravityY: 0,
    gravityX: 0,
    velocityX: 50,
    velocityY: 0,
    speed: 100,
    ignoreGravity: true
  },
}

export const turnRandomlyDefaults = {
  movement: {
    movementBehavior: MOVEMENT_TURN_RANDOMLY,
    gravityY: 0,
    gravityX: 0,
    velocityX: 50,
    velocityY: 0,
    speed: 100,
    ignoreGravity: true
  },
}


export const followPlayerDefaults = {
  movement: {
    movementBehavior: MOVEMENT_FOLLOW_PLAYER,
    velocityX: 0,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    speed: 100,
    ignoreGravity: true
  },
}

export const followClassDefaults = {
  movement: {
    movementBehavior: MOVEMENT_FOLLOW_CLASS,
    velocityX: 0,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    speed: 100,
    ignoreGravity: true
  },
}

export const jumpDefaults = {
  movement: {
    movementBehavior: MOVEMENT_JUMP,
    gravityY: 50,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    ignoreGravity: false
  },
  collisionResponse: {
    bounciness: 1,
    notPushable: true,
  }
}

export const noneDefaults = {
  movement: {
    ...defaultMovement
  }
}