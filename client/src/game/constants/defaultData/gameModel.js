// import { BACKGROUND_LAYER_CANVAS_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../constants";
import { PLAYGROUND_LAYER_CANVAS_DEPTH } from "../constants";
import { defaultZoneClass } from "./entityClass";
import { gameSize, nodeSize } from "./general";
import { mirrorPlayerDefaults } from "./movement";
import { directionalClass, directionalPlayerClassId, jumperClass, jumperPlayerClassId, vehicleClass, vehiclePlayerClassId } from "./players";
import { initialCameraZoneClassId, initialPlayerSpawnZoneClassId, initialStage, initialStageId, initialStageZoneClassId } from "./stage";

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
  theme: {
    primaryColor: DEFAULT_THEME_COLOR
  },
  "stages": {
     [initialStageId]: {
      ...initialStage
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
  "entityClasses": {
    [vehiclePlayerClassId]: vehicleClass,
    [jumperPlayerClassId]: jumperClass,
    [directionalPlayerClassId]: directionalClass,
    [initialPlayerSpawnZoneClassId]: {
      name: 'Player Spawn',
      ...defaultZoneClass,
      entityClassId: initialPlayerSpawnZoneClassId,
      editorInterface: {
        ...defaultZoneClass.editor,
        notVisibleInSelector: true,
        noDestroyAllEffect: true,
        noTransformEffect: true,
        noSpawnAnywhereEffect: true
      },
      graphics: {
        ...defaultZoneClass.graphics,
        textureTint: '#FFFFFF',
      }
    },
    [initialCameraZoneClassId]: {
      name: 'Player Camera',
      ...defaultZoneClass,
      movement: {
        ...mirrorPlayerDefaults.movement
      },
      editorInterface: {
        ...defaultZoneClass.editor,
        notVisibleInSelector: true,
        fixedAspectRatio: true,
        noDestroyAllEffect: true,
        noTransformEffect: true,
        noSpawnAnywhereTag: true
      },
      collisionResponse: {
        ...mirrorPlayerDefaults.collisionResponse,
        ignoreStageBoundaries: true
      },
      entityClassId: initialCameraZoneClassId,
      graphics: {
        ...defaultZoneClass.graphics,
        textureTint: '#00FF00',
        customDepth: PLAYGROUND_LAYER_CANVAS_DEPTH - 5,
        width: nodeSize * 28,
        height: nodeSize * 28
      },
    },
    [initialStageZoneClassId]: {
      name: 'Stage',
      ...defaultZoneClass,
      editorInterface: {
        ...defaultZoneClass.editor,
        notVisibleInSelector: true,
        notSelectableInStage: true,
        noDestroyAllEffect: true,
        noTransformEffect: true,
        noTeleportEffect: true,
        noSpawnAnywhereEffect: true
      },
      collisionResponse: {
        ...mirrorPlayerDefaults.collisionResponse,
        ignoreStageBoundaries: true
      },
      entityClassId: initialStageZoneClassId,
      graphics: {
        ...defaultZoneClass.graphics,
        textureTint: '#000000',
        customDepth: 1,
        width: gameSize,
        height: gameSize
      },
      isRemoved: true
    }
  },
  isRemoved: false
}

  // spawnX: gameSize/2,
  // spawnY: gameSize/2,