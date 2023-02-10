import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP, OBJECT_CLASS_ID_PREFIX, OBJECT_INSTANCE_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX, STAGE_ID_PREFIX, ZONE_CLASS_TYPE_PREFIX } from "../constants";
import { gameSize } from "./general";
import { vehiclePlayerClassId } from "./players";

export const initialStageId =  STAGE_ID_PREFIX+'default'
export const initialSpawnZoneClassId = OBJECT_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX+'playerspawnzone'
export const initialSpawnZoneInstanceId = OBJECT_CLASS_ID_PREFIX+OBJECT_INSTANCE_ID_PREFIX+'playerspawnzone'
export const initialPlayerClassId = vehiclePlayerClassId

export const initialPlayerSpawnZone = {
  id: initialSpawnZoneInstanceId,
  classId: initialSpawnZoneClassId,
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
  'playerClassId': initialPlayerClassId,
  'spawnZoneClassId': initialSpawnZoneClassId,
  objects: {
    [initialSpawnZoneInstanceId]: {
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