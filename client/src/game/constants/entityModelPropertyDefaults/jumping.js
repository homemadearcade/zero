
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

import { ADVANCED_DIRECTIONAL_CONTROLS } from "../core"
import { JUMP_AIR, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, JUMP_NONE } from "../core"

export const defaultJump = {
  jumpControlsBehavior: JUMP_NONE,
  ground: 0,
  air: 0,
  cooldown: 100,
}


// PARAMETERS
export const jumpControlsBehaviorToParemeters = {
  [JUMP_NONE]: {
    ground: false,
    speed: false,
    dragX: false,
    dragy: false,
    cooldown: false,
    gravityY: false
  },
  [JUMP_GROUND]: {
    ground: true,
    speed: 'Move Speed',
    dragY: true,
    gravityY: true
  },
  [JUMP_COMBO]: {
    ground: 'Ground Jump Speed',
    air: 'Air Jump Speed',
    cooldown: 'Air Jump Cooldown',
    dragY: true,
    gravityY: true
  },
  [JUMP_AIR]: {
    air: 'Air Jump Speed',
    cooldown: 'Air Jump Cooldown',
    gravityY: true,
    dragY: true,
  },
  [JUMP_CONSTANT]: {
    ground: 'Thrust Speed',
    dragY: true,
    gravityY: true
  }
}


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// CONTROLS
export const noJumpDefaults = {
  jump: {
    jumpControlsBehavior: JUMP_NONE,
    ground: 0,
    air: 0,
  }
}

export const airJumpDefaults = {
  jump: {
    jumpControlsBehavior: JUMP_AIR,
    ground: 0,
    air: 50,
    cooldown: 200,
  },
}

export const comboJumpDefaults = {
  jump: {
    jumpControlsBehavior: JUMP_COMBO,
    ground: 100,
    air: 50,
    cooldown: 200,
  },
}

export const groundJumpDefaults = {
  jump: {
    jumpControlsBehavior: JUMP_GROUND,
    ground: 200,
    air: 0,
  },
}

export const jetpackDefaults = {
  jump: {
    jumpControlsBehavior: JUMP_CONSTANT,
    ground: 100,
    air: 0,
  },
}

export const jumpMovementDefaults = {
  movement: {
    movementControlsBehavior: ADVANCED_DIRECTIONAL_CONTROLS,
    disableDownKey: false,
    dragX: 0,
    dragY: 1,
    ignoreGravity: false
  }
}

export const jumpControlsToKeys = {
  [JUMP_GROUND]: {
    up: 'Jump (On Ground)',
  },
  [JUMP_AIR]: {
    up: 'Jump (In Air)',
  },
  [JUMP_COMBO]: {
    up: 'Jump (On Ground)',
    up2: 'Float (In Air)',
  },
  [JUMP_CONSTANT]: {
    up: 'Thrust',
  },
  [JUMP_NONE]: {
    up: false,
    up2: false,
  }
}

