// import { BACKGROUND_LAYER_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../../constants";
import { defaultZoneEntity } from "../entityModel";
import { gameGridWidth, gameGridHeight, SPAWN_ZONE_RELATION_TAG_ID, CAMERA_RELATION_TAG_ID, STAGE_RELATION_TAG_ID } from "../../core";
import { mirrorPlayerDefaults } from "../entityModelBehavior";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../../core";
import { nodeSize } from "../../core";
import { RELATION_SPAWN_ENTITY_MODEL_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, NOT_DERIVED_IID, ENTITY_SPAWN_ZONE_ENTITY_IID, PROJECTILE_ENTITY_SELECTOR_IID, COLLIDER_RELATION_TAG_IID, SELECT_SPEAKER_ENTITY_MODEL_IID, PROJECTILE_ENTITY_TARGET_SELECTOR_IID, IMAGE_AND_TEXT_SCENE_IID } from "../../../../constants/interfaceIds";
import { EDIT_ENTITY_AID, IMPORT_DATA_SOURCE_AID, PLACE_ENTITY_AID } from "../../../../constants/interfaceActionIds";
import { EDIT_GAME_SCOPE_ONLY_ME, PLAY_GAME_SCOPE_UNLISTED } from "../../core";
import { defaultCutscene } from "./cutscene";
import _, { cloneDeep } from "lodash";
import { CAMERA_ZONE_ENTITY_IVID, DIRECTIONAL_PLAYER_ENTITY_IVID, END_GAME_CUTSCENE_IVID, INITIAL_STAGE_IVID, JUMPER_PLAYER_ENTITY_IVID, PLAYER_SPAWN_ZONE_ENTITY_IVID, PLAYTHROUGH_START_CUTSCENE_IVID, STAGE_ZONE_ENTITY_IVID, SWIMMER_PLAYER_ENTITY_IVID, VEHICLE_PLAYER_ENTITY_IVID, importantValueData } from "../importantValueIds";
import { createInitialPlayerEntities } from "./players";
import { createInitialStage } from "./stage";
import { generateUniqueId } from "../../../../utils";
import { initialTags } from "./relationTags";

export function createInitialGameModel() {
  const importantValues = importantValueData.reduce((prev, importantValueData) => {
    const { importantValueId, name } = importantValueData

    prev[importantValueId] = {
      unique: true,
      type: 'id',
      name,
      importantValueId,
      value: importantValueId + '-' + generateUniqueId(),
      relatedId: null
    }
    return prev
  }, {})

  const initialStageId = importantValues[INITIAL_STAGE_IVID].value

  const initialStageZoneEntityId = importantValues[STAGE_ZONE_ENTITY_IVID].value

  const initialCameraZoneEntityId = importantValues[CAMERA_ZONE_ENTITY_IVID].value

  const initialPlayerSpawnZoneEntityId = importantValues[PLAYER_SPAWN_ZONE_ENTITY_IVID].value

  const vehiclePlayerEntityId = importantValues[VEHICLE_PLAYER_ENTITY_IVID].value

  const jumperPlayerEntityId = importantValues[JUMPER_PLAYER_ENTITY_IVID].value

  const directionalPlayerEntityId = importantValues[DIRECTIONAL_PLAYER_ENTITY_IVID].value

  const swimmerPlayerEntityId = importantValues[SWIMMER_PLAYER_ENTITY_IVID].value

  const playthroughStartCutsceneId = importantValues[PLAYTHROUGH_START_CUTSCENE_IVID].value

  const endGameCutsceneId = importantValues[END_GAME_CUTSCENE_IVID].value

  const { directionalEntity, jumperEntity, vehicleEntity, swimmerEntity } = createInitialPlayerEntities(importantValues)

  const initialStage = createInitialStage(importantValues)

  return  {
    "metadata": {
      "title": "",
      "description": "",
      "authorPseudonym": "",
      "imageUrl": "",
    },
    playScope: PLAY_GAME_SCOPE_UNLISTED,
    editScope: EDIT_GAME_SCOPE_ONLY_ME,
    theme: {
      primaryColor: DEFAULT_THEME_COLOR
    },
    size: {
      gridWidth: gameGridWidth,
      gridHeight: gameGridHeight,
      "nodeSize": nodeSize,
    },
    "stages": {
      [initialStageId]: {
        ...initialStage,
        stageId: initialStageId
      }
    },
    colors: {

    },
    cutscenes: {
      [playthroughStartCutsceneId]: {
        ...cloneDeep(defaultCutscene),
        'name': 'Game Start',
        cutsceneId: playthroughStartCutsceneId
      },
      [endGameCutsceneId]: {
        ...cloneDeep(defaultCutscene),
        scenes: [
          { 
            sceneInterfaceType: IMAGE_AND_TEXT_SCENE_IID,
            text: 'Congratulations! You have completed the game!'
          }
        ],
        name: 'Game Ending',
        cutsceneId: endGameCutsceneId
      }
    },
    relations: {

    },
    relationTags: {
      ..._.cloneDeep(initialTags),
    },
    effects: {},
    events: {},
    "textures": {
      // "url": "xxx",
      // "name": 'name'
      // "type": "layer"
    },
    "player": {
      "lives": 1,
      'startingStageId': initialStageId
    },
    "collisions": {

    },
    interfacePresets: {

    },
    layers: {},
    "entityModels": {
      [vehiclePlayerEntityId]: vehicleEntity,
      [jumperPlayerEntityId]: jumperEntity,
      [directionalPlayerEntityId]: directionalEntity,
      [swimmerPlayerEntityId]: swimmerEntity,
      [initialPlayerSpawnZoneEntityId]: {
        name: 'Player Spawn',
        ...defaultZoneEntity,
        entityModelId: initialPlayerSpawnZoneEntityId,
        editorInterface: {
          // hiddenFromIDs: {
          //   // [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          //   [EDIT_ENTITY_AID]: true,
          // },
        },
        autogeneration: {
          transformIntoEffect: false,
            playerTransformIntoRelationTag: false,
          teleportToEffect: true,
            playerTeleportToRelationTag: true,
          spawnOntoStageEffect: false,
          destroyAllEffect: false,
          automaticEntityTag: false,
        },
        relationTags: {
          [SPAWN_ZONE_RELATION_TAG_ID]: {
            isReadOnly: true,
          }
        },
        graphics: {
          ...defaultZoneEntity.graphics,
          textureTint: '#FFFFFF',
        },
        dataSourceIID: NOT_DERIVED_IID
      },
      [initialCameraZoneEntityId]: {
        name: 'Player Camera',
        ...defaultZoneEntity,
        movement: {
          ...mirrorPlayerDefaults.movement
        },
        editorInterface: {
          // hiddenFromIDs: {
          //   // [SELECT_SPEAKER_ENTITY_MODEL_IID]: true,
          //   [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          //   [RELATION_SPAWN_ENTITY_MODEL_IID]: true,
          //   // [ENTITY_SPAWN_ZONE_ENTITY_IID]: true,
          //   // [EDIT_ENTITY_AID]: true,
          //   [IMPORT_DATA_SOURCE_AID]: true,
          //   [PLACE_ENTITY_AID]: true,
          //   [PROJECTILE_ENTITY_SELECTOR_IID]: true,
          //   // [PROJECTILE_ENTITY_TARGET_SELECTOR_IID]: true,
          //   // [COLLIDER_RELATION_TAG_IID]: true
          // },
          fixedAspectRatio: true,
          notSelectableInForms: true,
          notSelectableInStage: true,
        },
        autogeneration: {
          transformIntoEffect: false,
            playerTransformIntoRelationTag: false,
          teleportToEffect: true,
            playerTeleportToRelationTag: false,
          spawnOntoStageEffect: false,
          destroyAllEffect: false,
          automaticEntityTag: false,
        },
        relationTags: {
          [CAMERA_RELATION_TAG_ID]: {
            isReadOnly: true,
          }
        },
        collisionResponse: {
          ...mirrorPlayerDefaults.collisionResponse,
          ignoreStageBoundaries: true
        },
        entityModelId: initialCameraZoneEntityId,
        graphics: {
          ...defaultZoneEntity.graphics,
          textureTint: '#00FF00',
          depthOverride: PLAYGROUND_LAYER_GROUP_DEPTH - 5,
          width: nodeSize * 30,
          height: nodeSize * 30
        },
        dataSourceIID: NOT_DERIVED_IID
      },
      [initialStageZoneEntityId]: {
        name: 'Stage',
        ...defaultZoneEntity,
        editorInterface: {
          hiddenFromIDs: {
            [SELECT_SPEAKER_ENTITY_MODEL_IID]: true,
            [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
            [RELATION_SPAWN_ENTITY_MODEL_IID]: true,
            [ENTITY_SPAWN_ZONE_ENTITY_IID]: true,
            [EDIT_ENTITY_AID]: true,
            [IMPORT_DATA_SOURCE_AID]: true,
            [PLACE_ENTITY_AID]: true,
            [PROJECTILE_ENTITY_SELECTOR_IID]: true,
            // [PROJECTILE_ENTITY_TARGET_SELECTOR_IID]: true,
            [COLLIDER_RELATION_TAG_IID]: true
          },
          notSelectableInForms: true,
          notSelectableInStage: true,
        },
        relationTags: {
          [STAGE_RELATION_TAG_ID]: {
            isReadOnly: true,
          }
        },
        autogeneration: {
          transformIntoEffect: false,
            playerTransformIntoRelationTag: false,
          teleportToEffect: false,
            playerTeleportToRelationTag: false,
          spawnOntoStageEffect: false,
          destroyAllEffect: false,
          automaticEntityTag: false,
        },
        collisionResponse: {
          ...mirrorPlayerDefaults.collisionResponse,
          ignoreStageBoundaries: true
        },
        entityModelId: initialStageZoneEntityId,
        graphics: {
          ...defaultZoneEntity.graphics,
          textureTint: '#000000',
          depthOverride: 1,
          width: nodeSize * gameGridWidth,
          height: nodeSize * gameGridHeight
        },
        dataSourceIID: NOT_DERIVED_IID,
      }
    },
    isRemoved: false,
    importantValues
  }
}

