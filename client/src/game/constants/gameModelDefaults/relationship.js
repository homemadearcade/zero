import {
 SPAWN_ZONE_RANDOM_SELECT
} from "../core"

export const initialEffectRelation = {
  effectTagA: true,
  effectTagB: false,
  spawnZoneSelectorType: SPAWN_ZONE_RANDOM_SELECT,
  effectCooldown: null,
  effectDelay: null,
  remoteEffectedRelationTagIdsExtension: [],
}

export const defaultRelationship = {
  effects: {},
  effectIds: [],
  relationId: '',
  isRemoved: false,
  isReadOnly: false
}

// export const effectIgnoreEvent = {
//   // Movement
//   [EFFECT_TELEPORT]: {

//   },
//   [EFFECT_IGNORE_GRAVITY]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   },
//   [EFFECT_STICK_TO]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   },

//   // Lifecycle
//   [EFFECT_TRANSFORM]: {},
//   [EFFECT_SPAWN]: {},
//   [EFFECT_DESTROY]: {},

//   // Narrative
//   [EFFECT_CUTSCENE]: {},
//   [EFFECT_GAME_OVER]: {
//     // [ON_SPAWN]: true,
//   },
//   [EFFECT_WIN_GAME]: {
//     // [ON_SPAWN]: true,
//   },

//   // Graphical
//   [EFFECT_CAMERA_SHAKE]: {
//   },
//   [EFFECT_INVISIBLE]: {
//     [ON_SPAWN]: true,
//     [ON_DESTROY_ONE]: true,
//     [ON_INTERACT]: true
//   }
// }
