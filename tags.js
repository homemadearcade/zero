
// BEHAVIORS
// Position
// Collision
// Visiblity
// VFX
// Controls

// RELATIONSHIP EFFECTS
// While Touching
// Position
// Behavior
// Narrative
// VFX

// OTHER FEATURES
// Interact Area
// Timer

export const positionBehaviors = {
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
  ignoreWorldBoundaries: {

  },
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
  // outline: {

  // },
  // shake: {

  // },
  // rotate: {

  // },
  // rotateBackAndForth: {

  // }
}

export const visibilityBehaviors = {
  unspawned: {

  },
  invisible: {

  },
  seeThroughOnHeroCollide: {

  },

  // cameraLock: {

  // },
  // cameraZoomToFit: {

  // },

  // light: {
    
  // },
  // darkArea: {
    
  // }
}

export const controlsBehaviors = {
  rotationFollowKeys: {
    requires: ['fixedRotation']
  },
  disableUpKeyMovement: {

  },
}

export const memoryOptimizationBehavior = {
  // this deletes it after 60 seconds
  destroyEventually: {

  },

  // this deletes it after 10 seconds
  destroySoon: {

  },

  // this deletes it after 3 seconds
  destroyQuickly: {

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
  climbable: {
    //ignore gravity temporarily
  },
  sticky: {
    // move with
  },
  notAllowed: {
    //create custom collision group
  },


  // Position
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