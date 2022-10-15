import { WORLD_COLLIDE, WORLD_DESTROY, WORLD_WRAP } from "../constants";

export const worldBoundaryRelationsDisplayNames = {
  [WORLD_COLLIDE]: ' collides with the boundary ',
  [WORLD_DESTROY]: ' is destroyed ',
  [WORLD_WRAP]:  ' teleports to the opposite side '
}

export function getWorldBoundaryRelationLabel(type, objectClass) {
  return objectClass.name + worldBoundaryRelationsDisplayNames[type] + ' when touching the boundary'
}