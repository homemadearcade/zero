// RELATIONSHIP EFFECTS
// Movement
// Lifecycle
// Narrative
// Graphics

export const defaultRelationship = {
  classId: '',
  sides: [],
  event: '', 
  effect: {
    id: '',
    x: null,
    y: null,
    classId: null,
    cutsceneId: null,
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


  // Movement
  ignoreGravity: {
    //ignore gravity temporarily
  },
  stickTo: {

  },
  teleport: {

  },
  // startFollow: {

  // },
  // stopFollow: {

  // },

  // LIFECYCLE
  reclass: {

  },
  spawn: {

  },
  destroy: {

  },

  // Narrative
  cutscene: {

  },

  //Graphics
  // animation: {

  // },
  cameraShake: {

  },
  hide: {

  },
  // particleEffect: {

  // }
}