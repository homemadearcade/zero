/////////////////////////////////////
/////////////////////////////////////
// PROJECTILE TYPES
export const PROJECTILE_RANDOM_DIRECTION = 'PROJECTILE_RANDOM_DIRECTION'
export const PROJECTILE_RANDOM_ANGLE = 'PROJECTILE_RANDOM_ANGLE'
export const PROJECTILE_TARGET_PLAYER = 'PROJECTILE_TARGET_PLAYER'
export const PROJECTILE_TARGET_ENTITY_MODEL = 'PROJECTILE_TARGET_ENTITY_MODEL'
export const PROJECTILE_LEFT = 'PROJECTILE_LEFT'
export const PROJECTILE_RIGHT = 'PROJECTILE_RIGHT'
export const PROJECTILE_DOWN = 'PROJECTILE_DOWN'
export const PROJECTILE_UP = 'PROJECTILE_UP'
export const PROJECTILE_NONE = 'PROJECTILE_NONE'

export const defaultProjectile = {
  projectileBehavior: PROJECTILE_NONE,
  entityModelId: null,
  cooldown: 200,
  lifetime: 3000,
  ammo: 0,
  speed: 300,
  targetRelationTagId: null,
  // relationTagOverride: false,
  // collisionTagOverride: false,
  relationTags: [],
  collisionTags: []
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const projectileToParemeters = {
  [PROJECTILE_TARGET_ENTITY_MODEL]: {
    class: true,
  },
  [PROJECTILE_TARGET_PLAYER]: {
    
  },
  [PROJECTILE_RANDOM_DIRECTION]: {

  },
  [PROJECTILE_RANDOM_ANGLE]: {

  },
  [PROJECTILE_UP]: {

  },
  [PROJECTILE_DOWN]: {

  },
  [PROJECTILE_LEFT]: {

  },
  [PROJECTILE_RIGHT]: {
    
  },
  [PROJECTILE_NONE]: {

  }
}