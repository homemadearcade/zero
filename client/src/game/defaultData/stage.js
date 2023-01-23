import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP } from "../constants";
import { gameSize } from "./general";

export const defaultStage = {
  'spawnZoneClassId': 'oc/z/playerspawnzone',
  "imageUrl": "",
  objects: {
    'oi/playerspawnzone': {
      id: 'oi/playerspawnzone',
      classId: 'oc/z/playerspawnzone',
      spawnX: gameSize/2,
      spawnY: gameSize/2,
    }
  },
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
  [BOUNDARY_COLLIDE]: ' stops ',
  [BOUNDARY_DESTROY]: ' is destroyed ',
  [BOUNDARY_WRAP]:  ' flips to the other side '
}

export function getBoundaryRelationLabel(type, objectClass) {
  return objectClass.name + boundaryRelationsDisplayNames[type] + ' when it hits the boundary'
}