import { initialCameraZoneEntityId, initialCameraZoneInstanceId, initialPlayerEntityId, initialPlayerSpawnZoneEntityId, initialPlayerSpawnZoneInstanceId, initialStageZoneEntityId, initialStageZoneInstanceId } from "..";
import { gameSize } from "../core/general";

export const initialPlayerSpawnZoneInstance = {
  id: initialPlayerSpawnZoneInstanceId,
  entityModelId: initialPlayerSpawnZoneEntityId,
  spawnX: gameSize/2,
  spawnY: gameSize/2,
}

export const initialPlayerCameraZoneInstance = {
  id: initialCameraZoneInstanceId,
  entityModelId: initialCameraZoneEntityId,
  spawnX: 0,
  spawnY: 0,
}

export const initialStageZoneInstance = {
  id: initialStageZoneInstanceId,
  entityModelId: initialStageZoneEntityId,
  spawnX: gameSize/2,
  spawnY: gameSize/2,
}

export const defaultStage = {
  name: '',
  color: '#000000',
  "playerEntityModelId": null,
  'playerSpawnZoneEntityId': null,
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
  'playerEntityModelId': initialPlayerEntityId,
  'playerSpawnZoneEntityId': initialPlayerSpawnZoneEntityId,
}