import { PROJECTILE_TARGET_CLASS, PROJECTILE_TARGET_PLAYER, PROJECTILE_UP, PROJECTILE_RANDOM_DIRECTION, PROJECTILE_DOWN, PROJECTILE_LEFT, PROJECTILE_RIGHT, PROJECTILE_NONE, PROJECTILE_RANDOM_ANGLE } from "../"

export const defaultProjectile = {
  projectileBehavior: PROJECTILE_NONE,
  entityClassId: null,
  cooldown: 200,
  lifetime: 3000,
  ammo: 0,
  speed: 300,
  targetClassId: null
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// PARAMETERS
export const projectileToParemeters = {
  [PROJECTILE_TARGET_CLASS]: {
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