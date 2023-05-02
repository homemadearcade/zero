// import { BACKGROUND_LAYER_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../constants";
import { defaultZoneEntity, directionalEntity, jumperEntity, swimmerEntity, vehicleEntity } from "../entityModelDefaults";
import { initialStage } from "./stage";
import { directionalPlayerEntityId, initialCameraZoneEntityId, initialPlayerSpawnZoneEntityId, initialStageId, initialStageZoneEntityId, jumperPlayerEntityId, 
  vehiclePlayerEntityId,  gameHeight, swimmerPlayerEntityId, gameGridWidth, gameGridHeight, EFFECT_DID } from "../core";
import { mirrorPlayerDefaults } from "../entityModelPropertyDefaults";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { nodeSize } from "../core";
import { RELATION_SPAWN_ENTITY_MODEL_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, DATA_SOURCE_SYSTEM_IID, ENTITY_SPAWN_ZONE_ENTITY_IID, PROJECTILE_ENTITY_SELECTOR_IID, COLLIDER_RELATION_TAG_IID, GRID_VIEW_TOGGLE_IID } from "../../../constants/interfaceIds";
import { EDIT_CURRENT_STAGE_BOUNDARIES_AID, EDIT_ENTITY_AID, IMPORT_DATA_SOURCE_AID, PLACE_ENTITY_AID, PLAY_TEST_GAME_AID, SNAPSHOT_GAME_AREA_AID, TOGGLE_GRID_VIEW_AID } from "../../../constants/interfaceActionIds";
import { EDIT_GAME_SCOPE_ONLY_ME, PLAY_GAME_SCOPE_UNLISTED } from "./scope";
import { FOUR_KID, ONE_KID, THREE_KID, TWO_KID } from "../../../constants/keyboard/keyIds";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
  },
  playScope: PLAY_GAME_SCOPE_UNLISTED,
  editScope: EDIT_GAME_SCOPE_ONLY_ME,
  importedArcadeGames: [],
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

  },
  relations: {

  },
  relationTags: {},
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
  keyToolbar: {
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
    }
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
        hiddenFromIDs: {
          // [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          [EDIT_ENTITY_AID]: true,
        },
      },
      autogeneration: {
        transformIntoEffect: false,
          playerTransformIntoRelationTag: false,
        teleportToEffect: true,
          playerTeleportToRelationTag: true,
        spawnOntoStageEffect: false,
        destroyAllEffect: false,
        automaticEntityTag: true,
      },
      graphics: {
        ...defaultZoneEntity.graphics,
        textureTint: '#FFFFFF',
      },
      dataSourceIID: DATA_SOURCE_SYSTEM_IID
    },
    [initialCameraZoneEntityId]: {
      name: 'Player Camera',
      ...defaultZoneEntity,
      movement: {
        ...mirrorPlayerDefaults.movement
      },
      editorInterface: {
        hiddenFromIDs: {
          [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          [RELATION_SPAWN_ENTITY_MODEL_IID]: true,
          [IMPORT_DATA_SOURCE_AID]: true,
          [PLACE_ENTITY_AID]: true,
          [PROJECTILE_ENTITY_SELECTOR_IID]: true,
        },
        fixedAspectRatio: true,
      },
      autogeneration: {
        transformIntoEffect: false,
          playerTransformIntoRelationTag: false,
        teleportToEffect: true,
          playerTeleportToRelationTag: false,
        spawnOntoStageEffect: false,
        destroyAllEffect: false,
        automaticEntityTag: true,
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
      dataSourceIID: DATA_SOURCE_SYSTEM_IID
    },
    [initialStageZoneEntityId]: {
      name: 'Stage',
      ...defaultZoneEntity,
      editorInterface: {
        hiddenFromIDs: {
          [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          [RELATION_SPAWN_ENTITY_MODEL_IID]: true,
          [ENTITY_SPAWN_ZONE_ENTITY_IID]: true,
          [EDIT_ENTITY_AID]: true,
          [IMPORT_DATA_SOURCE_AID]: true,
          [PLACE_ENTITY_AID]: true,
          [PROJECTILE_ENTITY_SELECTOR_IID]: true,
          [COLLIDER_RELATION_TAG_IID]: true
        },
        notSelectableInStage: true,
      },
      autogeneration: {
        transformIntoEffect: false,
          playerTransformIntoRelationTag: false,
        teleportToEffect: false,
          playerTeleportToRelationTag: false,
        spawnOntoStageEffect: false,
        destroyAllEffect: false,
        automaticEntityTag: true,
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
      dataSourceIID: DATA_SOURCE_SYSTEM_IID,
    }
  },
  isRemoved: false
}