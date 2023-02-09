import { PHYSICS_BOUNCE_IID, PHYSICS_COLLIDERS_IID, PHYSICS_FRICTION_IID, PHYSICS_IGNORE_BOUNDARIES_IID, PHYSICS_IGNORE_SIDES_IID, PHYSICS_IMMOVABLE_IID, PHYSICS_MASS_IID, PHYSICS_PUSHABLE_IID } from "../interfaceIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PHYSICS_COLLIDERS_IID]: {},
  [PHYSICS_IGNORE_SIDES_IID]: {},
  [PHYSICS_BOUNCE_IID]: {
    isDefaultUnlocked: true
  },
  [PHYSICS_FRICTION_IID]: {},
  [PHYSICS_MASS_IID]: {},
  [PHYSICS_PUSHABLE_IID]: {},
  [PHYSICS_IMMOVABLE_IID]: {},
  [PHYSICS_IGNORE_BOUNDARIES_IID]: {},
}