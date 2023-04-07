import { gameHeight, gameWidth, initialCameraZoneEntityId, initialCameraZoneInstanceId, initialPlayerEntityId, initialPlayerSpawnZoneEntityId, initialPlayerSpawnZoneInstanceId, initialStageZoneEntityId, initialStageZoneInstanceId } from "..";

export const initialPlayerSpawnZoneInstance = {
  id: initialPlayerSpawnZoneInstanceId,
  entityModelId: initialPlayerSpawnZoneEntityId,
  spawnX: gameWidth/2,
  spawnY: gameHeight/2,
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
  spawnX: gameWidth/2,
  spawnY: gameHeight/2,
}

export const defaultStage = {
  name: '',
  color: '#000000',
  "playerEntityModelId": null,
  'playerSpawnZoneEntityId': null,
  "imageUrl": "",
  stageId: null,
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
    "maxWidth": gameWidth,
    "maxHeight": gameHeight,
    "height": (gameHeight/3) * 1,
    "width": (gameWidth/3) * 1,
    "x": gameWidth/3,
    "y": gameHeight/3
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