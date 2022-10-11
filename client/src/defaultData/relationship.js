import { EFFECT_CAMERA_SHAKE, EFFECT_COLLIDE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_TELEPORT, EFFECT_WIN_GAME, ON_COLLIDE, ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START, ON_CUTSCENE_END, ON_DESTROY, ON_INTERACT, ON_SPAWN } from "../constants"

export const defaultRelationship = {
  classId: '',
  event: '', 
  effect: {
    type: '',
    classId: null,
    cutsceneId: null,
  }, 
  sides: [],
}

export const effectDisplayNames = {
// Movement
[EFFECT_TELEPORT]: 'Teleport',
[EFFECT_COLLIDE]: 'Collide',
[EFFECT_IGNORE_GRAVITY]: 'Zero Gravity',
[EFFECT_STICK_TO]: 'Stick To',

// Lifecycle
[EFFECT_RECLASS]: 'Transform',
[EFFECT_SPAWN]: 'Spawn',
[EFFECT_DESTROY]: 'Destroy',

// Narrative
[EFFECT_CUTSCENE]: 'Cutscene',
[EFFECT_GAME_OVER]: 'Game Over',
[EFFECT_WIN_GAME]: 'Win Game',

// Graphical
[EFFECT_CAMERA_SHAKE]: 'Shake Camera',
[EFFECT_INVISIBLE]: 'Hide',
}

export const eventDisplayNames = {
 [ON_COLLIDE]: 'Overlapped',
 [ON_COLLIDE_START]: 'ON_COLLIDE_START',
 [ON_COLLIDE_END]: 'ON_COLLIDE_END',
 [ON_COLLIDE_ACTIVE]: 'ON_COLLIDE_ACTIVE',
 [ON_SPAWN]: 'Spawned',
 [ON_DESTROY]: 'Destroyed',
 [ON_INTERACT]: 'Interacted',
 [ON_CUTSCENE_END]: 'Cutscene Ended'
}