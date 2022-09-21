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
  sides: [],
  event: '', 
  effect: {
    id: '',
    x: null,
    y: null,
    classId: null
  }, 
}

export const relationshipEvents = {
  collide: {

  },
  interact: {

  },
  destroy: {
    
  },
  spawn: {

  },
  // timer: {

  // }
}

export const relationshipEffects = {
  // While Touching Only
  invisible: {

  },
  ignoreGravity: {
    //ignore gravity temporarily
  },

  // Movement
  teleport: {

  },
  // startFollow: {

  // },
  // stopFollow: {

  // },

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
  // animation: {

  // },
  cameraShake: {

  },
  // particleEffect: {

  // }
}