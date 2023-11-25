
/////////////////////////////////////
/////////////////////////////////////

import { C_KID, DOWN_KID, LEFT_KID, RIGHT_KID, UP_KID } from "../../../../constants/keyboard/keyIds"
import { JUMP_GROUND } from "../../core"
import { JUMP_NONE } from "../../core"
import { ADVANCED_DIRECTIONAL_CONTROLS, DIRECTIONAL_CONTROLS, VEHICLE_CONTROLS } from "../../core"
import { CONTROLS_NO_BEHAVIOR_NONE } from "./movement"

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const movementControlsBehaviorToInterface = {
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
  [CONTROLS_NO_BEHAVIOR_NONE]: {

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
    movementControlsBehavior: VEHICLE_CONTROLS,
    dragX: 0.25,
    dragY: 0.25,
    disableDownKey: true,
    dragAngular: 100,
    speedAngular: 100,
  },
  jump: {
    jumpControlsBehavior: JUMP_NONE
  }
}

export const swimmerDefaults = {
  movement: {
    movementControlsBehavior: VEHICLE_CONTROLS,
    dragX: 0.75,
    dragY: 0.75,
    disableDownKey: false,
    dragAngular: 40,
    speedAngular: 40,
    speed: 150,
    ignoreGravity: false
  },
  jump: {
    jumpControlsBehavior: JUMP_NONE
  }
}

export const directionalDefaults = {
  movement: {
    movementControlsBehavior: DIRECTIONAL_CONTROLS,
    disableDownKey: false,
    dragX: 0.75,
    dragY: 0.75,
    ignoreGravity: true
  },
  jump: {
    jumpControlsBehavior: JUMP_NONE
  }
}

export const advancedDirectionalDefaults = {
  movement: {
    movementControlsBehavior: ADVANCED_DIRECTIONAL_CONTROLS,
    disableDownKey: false,
    dragX: 0.25,
    dragY: 0.25,
  },
  jump: {
    jumpControlsBehavior: JUMP_GROUND
  },
}

export const movementControlsToKeys = {
  [VEHICLE_CONTROLS]: {
    [C_KID]: 'Thrust Forward',
    [UP_KID]: 'Thrust Forward',
    [LEFT_KID]: 'Rotate Left',
    [RIGHT_KID]: 'Rotate Right',
    [DOWN_KID]: function(entityModel) {
      if(!entityModel.movement.disableDownKey) {
        return 'Thrust Backwards'
      } else {
        return null
      }
    },
  },
  [DIRECTIONAL_CONTROLS]: {
    [UP_KID]: 'Move Up',
    [LEFT_KID]: 'Move Left',
    [RIGHT_KID]: 'Move Right',
    [DOWN_KID]: 'Move Down'
  },
  [ADVANCED_DIRECTIONAL_CONTROLS]: {
    [UP_KID]: 'Accelerate Up',
    [LEFT_KID]: 'Accelerate Left',
    [RIGHT_KID]: 'Accelerate Right',
    [DOWN_KID]: 'Accelerate Down'
  },
  [CONTROLS_NO_BEHAVIOR_NONE]: {
  
  }
  // [CAR_CONTROLS]: {
  //   up: 'Accelerate',
  //   left: 'Turn Left',
  //   right: 'Turn Right',
  //   down: 'Reverse'
  // },
}

