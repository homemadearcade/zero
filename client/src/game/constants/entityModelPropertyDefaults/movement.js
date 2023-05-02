
/////////////////////////////////////
/////////////////////////////////////
// MOVEMENT PATTERNS
export const MOVEMENT_SIDE_TO_SIDE = 'MOVEMENT_SIDE_TO_SIDE'
export const MOVEMENT_UP_AND_DOWN = 'MOVEMENT_UP_AND_DOWN'
export const MOVEMENT_JUMP = 'MOVEMENT_JUMP'
export const MOVEMENT_TURN_ON_COLLIDE = 'MOVEMENT_TURN_ON_COLLIDE'
export const MOVEMENT_TURN_RANDOMLY = 'MOVEMENT_TURN_RANDOMLY'
export const MOVEMENT_FOLLOW_PLAYER = 'MOVEMENT_FOLLOW_PLAYER'
export const MOVEMENT_FOLLOW_RELATION_TAG = 'MOVEMENT_FOLLOW_RELATION_TAG'
export const MOVEMENT_NONE = 'MOVEMENT_NONE'
export const MOVEMENT_MIRROR_PLAYER = 'MOVEMENT_MIRROR_PLAYER'
export const CONTROLS_NO_BEHAVIOR_NONE = 'CONTROLS_NO_BEHAVIOR_NONE'

export const defaultMovement = {
  movementControlsBehavior: CONTROLS_NO_BEHAVIOR_NONE,
  movementBehavior: MOVEMENT_NONE,
  velocityX: 0,
  velocityY: 0,
  speed: 100,
  speedAngular: 100,
  ignoreGravity: true,
  dragY: 1,
  dragX: 1,
  dragAngular: 100,
  gravityY: 0,
  gravityX: 0,
  disableDownKey: false,
  // entityModelId: null,
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const movementBehaviorToInterface = {
  [MOVEMENT_FOLLOW_PLAYER] : {

  },
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
  [MOVEMENT_FOLLOW_RELATION_TAG]: {
    speed: true,
    relationTag: true
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

export const mirrorPlayerDefaults = {
  movement: {
    movementBehavior: MOVEMENT_MIRROR_PLAYER,
    velocityX: 0,
    velocityY: 0,
    gravityY: 0,
    gravityX: 0,
    dragX: 1,
    dragY: 1,
    speed: 100,
    ignoreGravity: true
  },
  collisionResponse: {
    notPushable: true,
    bounciness: 0
  }
}


export const followEntityDefaults = {
  movement: {
    movementBehavior: MOVEMENT_FOLLOW_RELATION_TAG,
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