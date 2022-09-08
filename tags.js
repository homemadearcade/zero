
// BEHAVIORS
// Movement
// Collision
// VFX
// Controls

// RELATIONSHIP EFFECTS
// While Touching
// Movement
// Behavior
// Narrative
// VFX

// OTHER FEATURES
// Interact Area
// Timer

export const movementBehaviors = {
  sideToSide: {

  },
  upAndDown: {

  },
  wanderer: {

  },
  spaceInvader: {

  }
}

export const collisionBehaviors = {
  ignoreGravity: {

  },
  fixedRotation: {

  },
  useMass: {

  },
  static: {

  },
}

export const visualEffectsBehaviors = {
  glowing: {

  },
  invisible: {

  },
  // outline: {

  // },
  // shake: {

  // },
  // rotate: {

  // },
  // rotateBackAndForth: {

  // }
}

export const controlsBehaviors = {
  rotationFollowKeys: {
    requires: ['fixedRotation']
  },
  ignoreUpKey: {

  },
}

export const relationshipEvents = {
  whileTouching: {

  },
  onCollide: {

  },
  onInteract: {

  },
  onDestroy: {
    
  },
  onSpawn: {

  }
}

export const relationshipEffects = {
  // While Touching
  invisible: {

  },
  climbable: {
    //ignore gravity temporarily
  },
  sticky: {
    // move with
  },
  notAllowed: {
    //create custom collision group
  },


  // Movement
  teleport: {

  },
  startFollow: {

  },
  stopFollow: {

  },

  // Behavior
  reclass: {

  },
  toggleBehavior: {

  },
  spawn: {

  },
  destroy: {

  },

  // Narrative
  cutscene: {

  },
  dialogue: {

  },

  //VFX
  animation: {

  },
  cameraShake: {

  },
  particleEffect: {

  }
}