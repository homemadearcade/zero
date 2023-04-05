// import { BACKGROUND_LAYER_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../constants";
import { defaultZoneEntity, directionalEntity, jumperEntity, swimmerEntity, vehicleEntity } from "../entityModelDefaults";
import { initialStage } from "./stage";
import { directionalPlayerEntityId, initialCameraZoneEntityId, initialPlayerSpawnZoneEntityId, initialStageId, initialStageZoneEntityId, jumperPlayerEntityId, 
  vehiclePlayerEntityId, gameWidth, gameHeight, swimmerPlayerEntityId } from "../core";
import { mirrorPlayerDefaults } from "../entityModelPropertyDefaults";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../core";
import { nodeSize } from "../core";
import { RELATION_SPAWN_ENTITY_MODEL_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID, DATA_SOURCE_SYSTEM_IID } from "../../../constants/interfaceIds";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
    isArchived: false,
    isFeatured: false,
    isPublished: false,
  },
  importedArcadeGames: [],
  theme: {
    primaryColor: DEFAULT_THEME_COLOR
  },
  "stages": {
     [initialStageId]: {
      ...initialStage,
      stageId: initialStageId
    }
  },
  "nodeSize": nodeSize,
  colors: {

  },
  cutscenes: {

  },
  relations: {

  },
  relationTags: {},
  effects: {},
  events: {},
  "canvasImages": {
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
        hiddenFromInterfaceIds: {
          [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true
        },
      },
      autogeneration: {
        transformIntoEffect: false,
          playerTransformIntoRelationTag: false,
        teleportToEffect: true,
          playerTeleportToRelationTag: true,
        spawnOntoStageEffect: true,
        destroyAllEffect: false,
        automaticEntityTag: true,
      },
      graphics: {
        ...defaultZoneEntity.graphics,
        textureTint: '#FFFFFF',
      },
      dataSourceId: DATA_SOURCE_SYSTEM_IID
    },
    [initialCameraZoneEntityId]: {
      name: 'Player Camera',
      ...defaultZoneEntity,
      movement: {
        ...mirrorPlayerDefaults.movement
      },
      editorInterface: {
        hiddenFromInterfaceIds: {
          [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          [RELATION_SPAWN_ENTITY_MODEL_IID]: true
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
      dataSourceId: DATA_SOURCE_SYSTEM_IID
    },
    [initialStageZoneEntityId]: {
      name: 'Stage',
      ...defaultZoneEntity,
      editorInterface: {
        hiddenFromInterfaceIds: {
          [SELECTOR_ENTITY_BY_INTERFACE_ID_IID]: true,
          [RELATION_SPAWN_ENTITY_MODEL_IID]: true
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
        width: gameWidth,
        height: gameHeight
      },
      dataSourceId: DATA_SOURCE_SYSTEM_IID,
    }
  },
  isRemoved: false
}