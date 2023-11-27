import { DIRECTIONAL_PLAYER_ENTITY_RID, EFFECT_DID, PLAYER_SPAWN_ZONE_ENTITY_RID, PLAYER_SPAWN_ZONE_INSTANCE_RID } from "../../";
import { EDIT_CURRENT_STAGE_BOUNDARIES_AID, PLAY_TEST_GAME_AID, SNAPSHOT_GAME_AREA_AID, TOGGLE_GRID_VIEW_AID, TOGGLE_PAUSE_PLAY_AID } from "../../../../constants/interfaceActionIds";
import { FIVE_KID, FOUR_KID, ONE_KID, THREE_KID, TWO_KID } from "../../../../constants/keyboard/keyIds";

export function createInitialStage(width, height) {

  const initialPlayerSpawnZoneEntityId = PLAYER_SPAWN_ZONE_ENTITY_RID

  const initialPlayerSpawnZoneInstanceId = PLAYER_SPAWN_ZONE_INSTANCE_RID

  const initialPlayerEntityId = DIRECTIONAL_PLAYER_ENTITY_RID

  const initialPlayerSpawnZoneInstance = {
    id: initialPlayerSpawnZoneInstanceId,
    entityModelId: initialPlayerSpawnZoneEntityId,
    spawnX: width/2,
    spawnY: height/2,
  }

  const initialStage = {
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
      "maxWidth": width,
      "maxHeight": height,
      "height": (height/3) * 1,
      "width": (width/3) * 1,
      "x": width/3,
      "y": height/3
    },
    "gravity": {
      "y": 12,
      "x": 0
    },
  }

  return  {
    ...initialStage,
    name: 'Stage # 1',
    'playerEntityModelId': initialPlayerEntityId,
    'playerSpawnZoneEntityId': initialPlayerSpawnZoneEntityId,
  }

}