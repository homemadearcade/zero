// RELATIONSHIP EVENTS
// whileTouching: {

// },
// collide: {

// },
// interact: {

// },
// destroy: {
  
// },
// spawn: {

// },
// timer: {

// }

// RELATIONSHIP EFFECTS
// While Touching
// Movement
// State
// Narrative
// VFX

export const defaultRelationship = {
  classId: '',
  event: '', 
  effect: {
    id: '',
    x: null,
    y: null,
    classId: null
  }, 
}

export const relationshipEvents = {
  whileTouching: {

  },
  collide: {

  },
  interact: {

  },
  destroy: {
    
  },
  spawn: {

  },
  timer: {

  }
}

export const relationshipEffects = {
  // While Touching Only
  invisible: {

  },
  allowClimb: {
    //ignore gravity temporarily
  },
  stickTo: {
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

  // State
  reclass: {

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