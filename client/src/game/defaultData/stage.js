import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP } from "../constants";
import { gameSize } from "./general";

export const defaultStage = {
  objects: {},
  "boundaries": {
    loop: false,
    "maxWidth": gameSize,
    "maxHeight": gameSize,
    "height": (gameSize/3) * 1,
    "width": (gameSize/3) * 1,
    "x": gameSize/3,
    "y": gameSize/3
  },
  "gravity": {
    "y": 12,
    "x": 0
  },
}

export const boundaryRelationsDisplayNames = {
  [BOUNDARY_COLLIDE]: ' collides with the boundary ',
  [BOUNDARY_DESTROY]: ' is destroyed ',
  [BOUNDARY_WRAP]:  ' teleports to the opposite side '
}

export function getboundaryRelationLabel(type, objectClass) {
  return objectClass.name + boundaryRelationsDisplayNames[type] + ' when touching the boundary'
}