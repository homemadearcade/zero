import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP } from "../constants";
import { gameSize } from "./general";

export const initialPlayerSpawnZone = {
  id: 'oi/playerspawnzone',
  classId: 'oc/z/playerspawnzone',
  spawnX: gameSize/2,
  spawnY: gameSize/2,
}

export const defaultStage = {
  name: '',
  "playerClassId": null,
  'spawnZoneClassId': null,
  "imageUrl": "",
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

export const initialStage = {
  ...defaultStage,
  name: 'Stage # 1',
  'playerClassId': 'oc-pl-vehicle',
  'spawnZoneClassId': 'oc/z/playerspawnzone',
  objects: {
    'oi/playerspawnzone': {
      ...initialPlayerSpawnZone
    }
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