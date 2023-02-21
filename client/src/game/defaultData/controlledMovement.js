import { DIRECTIONAL_CONTROLS, CAR_CONTROLS, JUMP_GROUND, VEHICLE_CONTROLS, ADVANCED_DIRECTIONAL_CONTROLS, JUMP_NONE } from "../constants"

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const controlledMovementToParemeters = {
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
    dragX: 0.25,
    dragY: 0.25,
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

