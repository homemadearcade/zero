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
import { CAMERA_ZONE_ENTITY_RID, END_GAME_CUTSCENE_RID, INITIAL_STAGE_RID, PLAYER_SPAWN_ZONE_ENTITY_RID, PLAYTHROUGH_START_CUTSCENE_RID, STAGE_ZONE_ENTITY_RID } from "../reservedIds";
import { createInitialStage } from "./stage";
import { initialTags } from "./relationTags";
import { loadStarterPack } from "../../starterPack";
import { getGameModelSize } from "../../../../utils";

export function createInitialGameModel(starterPackIID) {
  const starterPackData = loadStarterPack(starterPackIID)

  const initialStageId = INITIAL_STAGE_RID

  const initialStageZoneEntityId = STAGE_ZONE_ENTITY_RID

  const initialCameraZoneEntityId = CAMERA_ZONE_ENTITY_RID

  const initialPlayerSpawnZoneEntityId = PLAYER_SPAWN_ZONE_ENTITY_RID

  const playthroughStartCutsceneId = PLAYTHROUGH_START_CUTSCENE_RID

  const endGameCutsceneId = END_GAME_CUTSCENE_RID

  const size = {
    gridWidth: gameGridWidth,
    gridHeight: gameGridHeight,
    "nodeSize": nodeSize,
  }
  const { width, height, aspectRatio } = getGameModelSize({ size })
  
  const initialStage = createInitialStage(width, height)

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
    size,
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
          aspectRatio,
          width: width/3,
          height: height/3
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
          width: width,
          height: height
        },
        dataSourceIID: NOT_DERIVED_IID,
      }
    },
    isRemoved: false,
    starterPackIID: starterPackIID,
  }
}

