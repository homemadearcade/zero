import { EFFECT_DID, gameGridWidth, initialCameraZoneEntityId, initialCameraZoneInstanceId, initialPlayerEntityId, initialPlayerSpawnZoneEntityId, initialPlayerSpawnZoneInstanceId, initialStageZoneEntityId, initialStageZoneInstanceId, nodeSize } from "../../";
import { EDIT_CURRENT_STAGE_BOUNDARIES_AID, PLAY_TEST_GAME_AID, SNAPSHOT_GAME_AREA_AID, TOGGLE_GRID_VIEW_AID, TOGGLE_PAUSE_PLAY_AID } from "../../../../constants/interfaceActionIds";
import { FIVE_KID, FOUR_KID, ONE_KID, THREE_KID, TWO_KID } from "../../../../constants/keyboard/keyIds";

const gameWidth = nodeSize * gameGridWidth
const gameHeight = nodeSize * gameGridWidth

export const initialPlayerSpawnZoneInstance = {
  id: initialPlayerSpawnZoneInstanceId,
  entityModelId: initialPlayerSpawnZoneEntityId,
  spawnX: gameWidth/2,
  spawnY: gameHeight/2,
}

// export const initialPlayerCameraZoneInstance = {
//   id: initialCameraZoneInstanceId,
//   entityModelId: initialCameraZoneEntityId,
//   spawnX: 0,
//   spawnY: 0,
// }

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
  'playerSpawnZoneEntityId': initialPlayerSpawnZoneEntityId,
  "imageUrl": "",
  stageId: null,
  entityInstances: {
    [initialPlayerSpawnZoneInstanceId]: {
      ...initialPlayerSpawnZoneInstance
    },
    // [initialCameraZoneInstanceId]: {
    //   ...initialPlayerCameraZoneInstance
    // },
    [initialStageZoneInstanceId]: {
      ...initialStageZoneInstance
    }
  },
  keyboardShortcuts: {
        // EFFECT_DID + interfaceActionId
    [ONE_KID]: {
      effectId: EFFECT_DID + TOGGLE_GRID_VIEW_AID
    },
    [TWO_KID]: {
      effectId: EFFECT_DID + PLAY_TEST_GAME_AID,
    },
    [THREE_KID]: {
      effectId: EFFECT_DID + SNAPSHOT_GAME_AREA_AID
    },
    [FOUR_KID]: {
      effectId: EFFECT_DID + EDIT_CURRENT_STAGE_BOUNDARIES_AID
    },
    [FIVE_KID]: {
      effectId: EFFECT_DID + TOGGLE_PAUSE_PLAY_AID
    },
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