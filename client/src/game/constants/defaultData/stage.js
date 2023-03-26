import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP, OBJECT_CLASS_ID_PREFIX, OBJECT_INSTANCE_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX, STAGE_ID_PREFIX, ZONE_CLASS_TYPE_PREFIX } from "../";
import { gameSize } from "./general";
import { directionalPlayerClassId, jumperPlayerClassId, vehiclePlayerClassId } from "./players";

export const initialStageId =  STAGE_ID_PREFIX+'default'
export const initialPlayerSpawnZoneClassId = OBJECT_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX+'playerspawnzone'
export const initialPlayerSpawnZoneInstanceId = OBJECT_CLASS_ID_PREFIX+OBJECT_INSTANCE_ID_PREFIX+'playerspawnzone'
export const initialCameraZoneClassId = OBJECT_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX+'playercamerazone'
export const initialCameraZoneInstanceId = OBJECT_CLASS_ID_PREFIX+OBJECT_INSTANCE_ID_PREFIX+'playercamerazone'
export const initialStageZoneClassId = OBJECT_CLASS_ID_PREFIX+ZONE_CLASS_TYPE_PREFIX+'stagezone'
export const initialStageZoneInstanceId = OBJECT_CLASS_ID_PREFIX+OBJECT_INSTANCE_ID_PREFIX+'stagezone'

export const initialPlayerClassId = directionalPlayerClassId

export const initialPlayerSpawnZoneInstance = {
  id: initialPlayerSpawnZoneInstanceId,
  entityClassId: initialPlayerSpawnZoneClassId,
  spawnX: gameSize/2,
  spawnY: gameSize/2,
}

export const initialPlayerCameraZoneInstance = {
  id: initialCameraZoneInstanceId,
  entityClassId: initialCameraZoneClassId,
  spawnX: 0,
  spawnY: 0,
}

export const initialStageZoneInstance = {
  id: initialStageZoneInstanceId,
  entityClassId: initialStageZoneClassId,
  spawnX: gameSize/2,
  spawnY: gameSize/2,
}

export const STAGE_DEFAULT_UNDERWATER = 'STAGE_DEFAULT_UNDERWATER'
export const STAGE_DEFAULT_SPACE = 'STAGE_DEFAULT_SPACE'
export const STAGE_DEFAULT_OVERHEAD = 'STAGE_DEFAULT_OVERHEAD'
export const STAGE_DEFAULT_PLATFORMER = 'STAGE_DEFAULT_PLATFORMER'

export const stageDefaultTypeLabels= {
  [STAGE_DEFAULT_UNDERWATER]: 'Underwater',
  [STAGE_DEFAULT_SPACE]: 'Space',
  [STAGE_DEFAULT_OVERHEAD]: 'Overhead',
  [STAGE_DEFAULT_PLATFORMER]: 'Platformer'
}

export const stageDefaultTypeProperties = {
  [STAGE_DEFAULT_UNDERWATER]: {
    defaultType: STAGE_DEFAULT_UNDERWATER,
    playerClassId: vehiclePlayerClassId,
    gravityY: true
  },
  [STAGE_DEFAULT_SPACE]: {
    defaultType: STAGE_DEFAULT_SPACE,
    playerClassId: vehiclePlayerClassId,
    gravityY: false
  },
  [STAGE_DEFAULT_OVERHEAD]: {
    defaultType: STAGE_DEFAULT_OVERHEAD,
    playerClassId: directionalPlayerClassId,
    gravityY: false
  },
  [STAGE_DEFAULT_PLATFORMER]: {
    defaultType: STAGE_DEFAULT_PLATFORMER,
    playerClassId: jumperPlayerClassId,
    gravityY: true
  }
}

export const defaultStage = {
  name: '',
  color: '#000000',
  "playerClassId": null,
  'playerSpawnZoneClassId': null,
  "imageUrl": "",
  stageId: null,
  layers: {},
  entityInstances: {
    [initialPlayerSpawnZoneInstanceId]: {
      ...initialPlayerSpawnZoneInstance
    },
    [initialCameraZoneInstanceId]: {
      ...initialPlayerCameraZoneInstance
    },
    [initialStageZoneInstanceId]: {
      ...initialStageZoneInstance
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

export const initialStage = {
  ...defaultStage,
  name: 'Stage # 1',
  'playerClassId': initialPlayerClassId,
  'playerSpawnZoneClassId': initialPlayerSpawnZoneClassId,
}

export const boundaryRelationsDisplayNames = {
  [BOUNDARY_COLLIDE]: 'Stops at boundary',
  // [BOUNDARY_DESTROY]: 'Is destroyed',
  [BOUNDARY_WRAP]:  'Flips to the other side'
}