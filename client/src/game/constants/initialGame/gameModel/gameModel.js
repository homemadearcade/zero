// import { BACKGROUND_LAYER_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../../constants";
import { defaultZoneEntity } from "../entityModel";
import { gameGridWidth, gameGridHeight, SPAWN_ZONE_RELATION_TAG_ID, CAMERA_RELATION_TAG_ID, STAGE_RELATION_TAG_ID } from "../../core";
import { mirrorPlayerDefaults } from "../entityModelBehavior";
import { PLAYGROUND_LAYER_GROUP_DEPTH } from "../../core";
import { nodeSize } from "../../core";
import { IMAGE_AND_TEXT_SCENE_IID, NOT_DERIVED_IID } from "../../../../constants/interfaceIds";
import { EDIT_GAME_SCOPE_ONLY_ME, PLAY_GAME_SCOPE_UNLISTED } from "../../core";
import { defaultCutscene } from "./cutscene";
import _, { cloneDeep } from "lodash";
import { CAMERA_ZONE_ENTITY_IVID, END_GAME_CUTSCENE_IVID, INITIAL_STAGE_IVID, PLAYER_SPAWN_ZONE_ENTITY_IVID, PLAYTHROUGH_START_CUTSCENE_IVID, STAGE_ZONE_ENTITY_IVID } from "../importantValueIds";
import { createInitialStage } from "./stage";
import { initialTags } from "./relationTags";
import { loadStarterPack } from "../../starterPack";

export function createInitialGameModel(starterPackIID) {
  const starterPackData = loadStarterPack(starterPackIID)

  const initialStageId = INITIAL_STAGE_IVID

  const initialStageZoneEntityId = STAGE_ZONE_ENTITY_IVID

  const initialCameraZoneEntityId = CAMERA_ZONE_ENTITY_IVID

  const initialPlayerSpawnZoneEntityId = PLAYER_SPAWN_ZONE_ENTITY_IVID

  const playthroughStartCutsceneId = PLAYTHROUGH_START_CUTSCENE_IVID

  const endGameCutsceneId = END_GAME_CUTSCENE_IVID
  
  const initialStage = createInitialStage()

  return  {
    "metadata": {
      "title": "",
      "description": "",
      "authorPseudonym": "",
      "imageUrl": "",
    },
    stageClasses: {
      ...starterPackData.stageClasses
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
      ...starterPackData.entityModels,
      [initialPlayerSpawnZoneEntityId]: {
        name: 'Player Spawn',
        ...defaultZoneEntity,
        entityModelId: initialPlayerSpawnZoneEntityId,
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
          fixedAspectRatio: true,
          notSelectableInInterface: true,
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
          notSelectableInInterface: true,
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
          depthOverride: 0,
          width: nodeSize * gameGridWidth,
          height: nodeSize * gameGridHeight
        },
        dataSourceIID: NOT_DERIVED_IID,
      }
    },
    isRemoved: false,
    starterPackIID: starterPackIID,
  }
}

