// import { BACKGROUND_LAYER_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../constants";
import { defaultZoneEntity, directionalEntity, jumperEntity, swimmerEntity, vehicleEntity } from "../entityModelDefaults";
import { initialStage } from "./stage";
import { directionalPlayerEntityId, initialCameraZoneEntityId, initialPlayerSpawnZoneEntityId, initialStageId, initialStageZoneEntityId, jumperPlayerEntityId, 
  vehiclePlayerEntityId,  gameHeight, swimmerPlayerEntityId, gameGridWidth, gameGridHeight } from "../core";
import { mirrorPlayerDefaults } from "../entityModelPropertyDefaults";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { nodeSize } from "../core";
import { RELATION_SPAWN_ENTITY_MODEL_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, DATA_SOURCE_SYSTEM_IID, ENTITY_SPAWN_ZONE_ENTITY_IID } from "../../../constants/interfaceIds";
import { EDIT_ENTITY_AID, IMPORT_DATA_SOURCE_AID, PLACE_ENTITY_AID } from "../../../constants/interfaceActionIds";
import { EDIT_GAME_SCOPE_ONLY_ME, PLAY_GAME_SCOPE_ONLY_ME } from "./scope";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
    // isArchived: false,
    // isFeatured: false,
    // isPublished: false,
  },
  playScope: PLAY_GAME_SCOPE_ONLY_ME,
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