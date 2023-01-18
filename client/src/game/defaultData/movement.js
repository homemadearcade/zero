import { DIRECTIONAL_CONTROLS, CAR_CONTROLS, JUMP_COMBO, JUMP_CONSTANT, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_JUMP, MOVEMENT_NONE, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_UP_AND_DOWN, JUMP_GROUND, VEHICLE_CONTROLS, ADVANCED_DIRECTIONAL_CONTROLS, JUMP_NONE, MOVEMENT_TURN_RANDOMLY } from "../constants"
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
  [MOVEMENT_TURN_RANDOMLY]: {
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
    gravityY: false,
    gravityX: false,
    velocityY: false,
    velocityX: false,
    ignoreGravity: true
  },
  [VEHICLE_CONTROLS]: {
    speed: 'Thrust Speed',
    dragX: true,
    dragY: true,
    bounce: true,
    ignoreGravity: true,
    disableDownKey: true,
    dragAngular: true,
    speedAngular: true,
  },
  [DIRECTIONAL_CONTROLS]: {
    speed: 'Move Speed',
    dragX: false,
    dragY: false
  },
  [ADVANCED_DIRECTIONAL_CONTROLS]: {
    speed: 'Move Speed',
    dragX: true,
    dragY: true,
    bounce: true,
    ignoreGravity: true
  },
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
    ignoreGravity: true
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
    ignoreGravity: true
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
    ignoreGravity: true
  },
}

export const turnRandomlyDefaults = {
  movement: {
    pattern: MOVEMENT_TURN_RANDOMLY,
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
    pattern: MOVEMENT_FOLLOW_PLAYER,
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
    pattern: MOVEMENT_JUMP,
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

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// CONTROLS
export const vehicleDefaults = {
  movement: {
    controls: VEHICLE_CONTROLS,
    dragX: 0.25,
    dragY: 0.25,
    disableDownKey: true,
    dragAngular: 100,
    speedAngular: 100,
  },
  jump: {
    style: JUMP_NONE
  }
}

export const directionalDefaults = {
  movement: {
    controls: DIRECTIONAL_CONTROLS,
    disableDownKey: false,
    dragX: 0,
    dragY: 0,
    ignoreGravity: true
  },
  jump: {
    style: JUMP_NONE
  }
}

export const advancedDirectionalDefaults = {
  movement: {
    controls: ADVANCED_DIRECTIONAL_CONTROLS,
    disableDownKey: false,
    dragX: 0,
    dragY: 0,
  },
  jump: {
    style: JUMP_GROUND
  },
}

export const carDefaults = {
  movement: {
    controls: CAR_CONTROLS,
    disableDownKey: false,
    dragX: 0.25,
    dragY: 0.25,
  },
  jump: {
    style: JUMP_NONE
  }
}

export const movementControlsToKeys = {
  [VEHICLE_CONTROLS]: {
    up: 'Thrust Forward',
    left: 'Rotate Left',
    right: 'Rotate Right',
    down: function(objectClass) {
      if(!objectClass.movement.disableDownKey) {
        return 'Thrust Backwards'
      } else {
        return null
      }
    },
  },
  [DIRECTIONAL_CONTROLS]: {
    up: 'Move Up',
    left: 'Move Left',
    right: 'Move Right',
    down: 'Move Down'
  },
  [ADVANCED_DIRECTIONAL_CONTROLS]: {
    up: 'Accelerate Up',
    left: 'Accelerate Left',
    right: 'Accelerate Right',
    down: 'Accelerate Down'
  },
  // [CAR_CONTROLS]: {
  //   up: 'Accelerate',
  //   left: 'Turn Left',
  //   right: 'Turn Right',
  //   down: 'Reverse'
  // },
}

