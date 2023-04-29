import _ from "lodash"
import { DATA_SOURCE_AUTOGENERATED_IID, DATA_SOURCE_ENTITY_MODEL_IID, POWERUP_ENTITY_IID, RELATION_TAG_ENTITY_IID,
   RELATION_TAG_CUTSCENE_IID, RELATION_TAG_DIALOGUE_IID, RELATION_TAG_GENERAL_IID, RELATION_TAG_TELEPORT_IID, 
   RELATION_TAG_TRANSFORM_IID, PLAYER_ENTITY_IID, DATA_SOURCE_IMPORTED_GAME_MODE_IID, DATA_SOURCE_SYSTEM_IID, 
   DATA_SOURCE_ACTION_IID, 
   BASIC_ENTITY_ADD_IID,
   BASIC_ENTITY_IID,
   SINGLE_RELATION_TAG_EVENT_IID,
   PLAYER_AND_RELATION_TAG_EVENT_IID,
   TWO_RELATION_TAG_EVENT_IID} from "../constants/interfaceIds"
import { defaultEntity, defaultEntityInstance, defaultStage, defaultRelationTag,
  effectEditInterfaces, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_SPAWN, EFFECT_TELEPORT, EFFECT_TRANSFORM, 
  initialTags, ON_INTERACT, playerRelationTagId, getEffectShorthand, effectInterfaceDatas, defaultRelationship, defaultBasicEntity, eventTypeInterfaces, eventShortNames, 
 } from "../game/constants"
 import { classLibrary } from "../game/classLibrary"
import { BRUSH_DID, CANVAS_IMAGE_LAYER_ID, EFFECT_DID, EFFECT_INTERFACE_ACTION, EFFECT_INTERFACE_UNLOCK, EFFECT_SWITCH_STAGE, NON_LAYER_COLOR_ID, ON_TOUCH_START } from "../game/constants/core"
import { NON_LAYER_BRUSH_ID } from "../game/constants/core"
import { initialStageZoneEntityId } from "../game/constants/core"
import { mergeDeep } from "../utils/utils"
import { getPlayerPowerupEntityId } from "./utils"
import { interfaceActionIdData } from "../constants/interfaceActionIdData"
import { interfaceActionsUIData, interfaceGroupData } from "../constants"
import { interfaceIdData } from "../constants/interfaceIdData"

export function generateActionEffects(gameModel) {
  if(!gameModel.effects) gameModel.effects = {}

  Object.keys(interfaceIdData).forEach((interfaceId) => {
    const interfaceData = interfaceIdData[interfaceId]
    const name = interfaceData.name || interfaceData.previewText

    const interfaceGroup = interfaceGroupData[interfaceData.interfaceGroupId]
    if(!name) return
    if(interfaceData.isDefaultUnlocked) return

    const effectId = EFFECT_DID + interfaceId
    gameModel.effects[effectId] = {
      effectId,
      effectBehavior: EFFECT_INTERFACE_UNLOCK,
      interfaceId: interfaceId,
      dataSourceIID: DATA_SOURCE_ACTION_IID,
      customSelectorCategory: 'Unlock ' + interfaceGroup.name + ' UI',
      title: 'Unlock ' + name,
      isReadOnly: true,
    }
  })

   Object.keys(interfaceActionIdData).forEach((interfaceActionId) => {
    const interfaceActionData = interfaceActionIdData[interfaceActionId]

    if(!interfaceActionData.arguments) {
      const effectId = EFFECT_DID + interfaceActionId
      const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
      if(!interfaceActionUIData) return console.error('no interface action ui data for ' + interfaceActionId)
      gameModel.effects[effectId] = {
        effectId,
        effectBehavior: EFFECT_INTERFACE_ACTION,
        interfaceActionId,
        dataSourceIID: DATA_SOURCE_ACTION_IID,
        customSelectorCategory: interfaceActionUIData.displayName,
        title: interfaceActionData.title,
        subTitle: interfaceActionData.subTitle,
        onClick: interfaceActionData.onClick(),
        icon: interfaceActionUIData.icon,
        isReadOnly: true
      }
    } else {
      interfaceActionData.arguments.forEach((arg1, arg2) => {
        if(arg1 && arg2) return console.error('we cannot do this yet')
        if(arg1 === 'entityModelId') {
          // create an action for each entity model and pass in the entity model into the getSubtitle method to get the name
          if(gameModel.entityModels) Object.keys(gameModel.entityModels).forEach((entityModelId) => {
            const effectId = EFFECT_DID + interfaceActionId + entityModelId
            const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
            const entityModel = gameModel.entityModels[entityModelId]
            
            let isActionRemoved = false
            if(interfaceActionData.isRemoved) {
              isActionRemoved = interfaceActionData.isRemoved([entityModelId], gameModel)
            }

            gameModel.effects[effectId] = {
              effectId,
              effectBehavior: EFFECT_INTERFACE_ACTION,
              interfaceActionId,
              textureId: entityModel.textureId,
              textureTint: entityModel.textureTint,
              dataSourceIID: DATA_SOURCE_ACTION_IID,
              customSelectorCategory: interfaceActionUIData.displayName,
              subTitle: interfaceActionData.getSubtitle([entityModelId], gameModel),
              title: interfaceActionData.title || interfaceActionData.getTitle([entityModelId], gameModel),
              onClick: interfaceActionData.onClick([entityModelId]),
              icon: interfaceActionUIData.icon,
              isReadOnly: true,
              isRemoved: entityModel.isReadOnly || entityModel.isRemoved || isActionRemoved
            }
          })
        } else if(arg1 === 'layerId') {
          if(gameModel.layers) Object.keys(gameModel.layers).forEach((layerId) => {
            const effectId = EFFECT_DID + interfaceActionId + layerId
            const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
            gameModel.effects[effectId] = {
              effectId,
              effectBehavior: EFFECT_INTERFACE_ACTION,
              interfaceActionId,
              dataSourceIID: DATA_SOURCE_ACTION_IID,
              customSelectorCategory: interfaceActionUIData.displayName,
              subTitle: interfaceActionData.getSubtitle([layerId], gameModel),
              title: interfaceActionData.title || interfaceActionData.getTitle([layerId], gameModel),
              onClick: interfaceActionData.onClick([layerId]),
              icon: interfaceActionUIData.icon,
              isReadOnly: true
            }
          })
        } else if(arg1 === 'brushId') {
          if(gameModel.brushes) Object.keys(gameModel.brushes).forEach((brushId) => {
            const effectId = EFFECT_DID + interfaceActionId + brushId
            const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
            const brush = gameModel.brushes[brushId]

            if(brush.layerId === NON_LAYER_BRUSH_ID || brush.layerId === CANVAS_IMAGE_LAYER_ID) return

            gameModel.effects[effectId] = {
              effectId,
              effectBehavior: EFFECT_INTERFACE_ACTION,
              interfaceActionId,
              textureId: brush.textureId,
              textureTint: brush.textureTint,
              dataSourceIID: DATA_SOURCE_ACTION_IID,
              customSelectorCategory: interfaceActionUIData.displayName,
              subTitle: interfaceActionData.getSubtitle([brushId], gameModel),
              title:  interfaceActionData.title || interfaceActionData.getTitle([brushId], gameModel),
              onClick: interfaceActionData.onClick([brushId]),
              icon: interfaceActionUIData.icon,
              isReadOnly: true
            }
          })
        } else if(arg1 === 'colorId') {
          if(gameModel.colors) Object.keys(gameModel.colors).forEach((colorId) => {
            const color = gameModel.colors[colorId]

            Object.keys(color).forEach((layerId) => {
              const effectId = EFFECT_DID + interfaceActionId + colorId + layerId
              if(layerId === NON_LAYER_COLOR_ID || layerId === CANVAS_IMAGE_LAYER_ID) return
              const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
              gameModel.effects[effectId] = {
                effectId,
                effectBehavior: EFFECT_INTERFACE_ACTION,
                interfaceActionId,
                textureTint: colorId,
                dataSourceIID: DATA_SOURCE_ACTION_IID,
                customSelectorCategory: interfaceActionUIData.displayName,
                subTitle: interfaceActionData.getSubtitle([colorId, layerId], gameModel) ,
                title: interfaceActionData.title || interfaceActionData.getTitle([colorId, layerId], gameModel),
                onClick: interfaceActionData.onClick([colorId, layerId]),
                icon: interfaceActionUIData.icon,
                isReadOnly: true
              }
            })

          })
        } else if(arg1 === 'stageId') {
          if(gameModel.stages) {
            Object.keys(gameModel.stages).forEach((stageId) => {
              const effectId = EFFECT_DID + interfaceActionId + stageId
              const interfaceActionUIData = interfaceActionsUIData[interfaceActionData.actionType]
              gameModel.effects[effectId] = {
                effectId,
                effectBehavior: EFFECT_INTERFACE_ACTION,
                interfaceActionId,
                dataSourceIID: DATA_SOURCE_ACTION_IID,
                customSelectorCategory: interfaceActionUIData.displayName,
                subTitle:  interfaceActionData.getSubtitle([stageId], gameModel),
                title: interfaceActionData.title || interfaceActionData.getTitle([stageId], gameModel),
                onClick: interfaceActionData.onClick([stageId]),
                icon: interfaceActionUIData.icon,
                isReadOnly: true
              }
            })
          }
        }
      })

    }
  })
}

export function addAutogeneratedEntityModels(gameData) {
  if(gameData.entityModels) {
    Object.keys(gameData.entityModels).forEach((entityModelId) => {
      const entityModel = gameData.entityModels[entityModelId]
      if(entityModel.graphics && entityModel.entityIID === PLAYER_ENTITY_IID) {
        const playerPowerUpEntityId = getPlayerPowerupEntityId(entityModelId)
        const powerUpEntity  = {
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          name: 'Player Powerup - ' + entityModel.name,
          relationTags: {
            [playerPowerUpEntityId]: {
              isReadOnly: true
            }
          },
          autogeneration: {
            teleportToEffect: false,
              playerTeleportToRelationTag: false,
            transformIntoEffect: false,
              playerTransformIntoRelationTag: false,
            automaticEntityTag: false,
            spawnOntoStageEffect: false,
            destroyAllEffect: true,
          },
          entityIID: BASIC_ENTITY_IID,
          entityModelId: playerPowerUpEntityId,
          graphics: {
            glowing: true,
            textureId: entityModel.graphics.textureId,
            textureTint: entityModel.graphics.textureTint
          },
        }

        if(gameData.entityModels[playerPowerUpEntityId]) {
          gameData.entityModels[playerPowerUpEntityId] = mergeDeep(_.cloneDeep(defaultEntity), _.cloneDeep(defaultBasicEntity), powerUpEntity, gameData.entityModels[playerPowerUpEntityId])
        } else {
          gameData.entityModels[playerPowerUpEntityId] = mergeDeep(_.cloneDeep(defaultEntity), _.cloneDeep(defaultBasicEntity), powerUpEntity)
        }
      }
    })
  }
}

export function addDefaultsToGameModel(gameData, oldGameData) {
  if(oldGameData) {
    if(gameData.stages) {
      Object.keys(gameData.stages).forEach((stageId) => {
        const stage = gameData.stages[stageId]
        if(stage && oldGameData.stages[stageId]) {
          const entityInstances = stage.entityInstances 
          const oldObjects = oldGameData.stages[stageId].entityInstances
          if(entityInstances) Object.keys(entityInstances).forEach((id) => {
            if(!oldObjects[id]) entityInstances[id] = mergeDeep(_.cloneDeep(defaultEntityInstance), entityInstances[id])
          })
        }
      })
    }

    if(gameData.entityModels) Object.keys(gameData.entityModels).forEach((id) => {
      if(!oldGameData.entityModels[id]) gameData.entityModels[id] = mergeDeep(_.cloneDeep(defaultEntity), gameData.entityModels[id])
    })

    return
  }

  const colors = {
    '#FFFFFF': {

    }, '#000000': {

    }, '#EE4035': {

    }, '#F37736': {

    }, '#FDF498': {

    }, '#7BC043': {

    }, '#0392CF':{

    }}
    if(gameData.layers) Object.keys(gameData.layers).forEach((layerId) => {
      Object.keys(colors).forEach((colorId) => {
        colors[colorId][layerId] = 1
      })
    })
    if(!gameData.colors) {
      gameData.colors = {}
    }
    gameData.colors = mergeDeep(colors, gameData.colors)
  

  if(gameData.entityModels) {
    Object.keys(gameData.entityModels).forEach((id) => {
      if(gameData.entityModels[id].dataSourceIID === DATA_SOURCE_AUTOGENERATED_IID) {
        console.log('skipping')
        return 
      }
      gameData.entityModels[id] = mergeDeep(_.cloneDeep(defaultEntity),  gameData.entityModels[id])
    })
  }

  if(gameData.stages) {
    Object.keys(gameData.stages).forEach((stageId) => {
      const stage = gameData.stages[stageId]
      gameData.stages[stageId] = mergeDeep(_.cloneDeep(defaultStage), gameData.stages[stageId])
      const entityInstances = stage.entityInstances 
      if(entityInstances) Object.keys(entityInstances).forEach((id) => {
        entityInstances[id] = mergeDeep(_.cloneDeep(defaultEntityInstance), entityInstances[id])
      })
    })
  }

  if(gameData.relations) {
    Object.keys(gameData.relations).forEach((relationId) => {
      gameData.relations[relationId] = mergeDeep(_.cloneDeep(defaultRelationship), gameData.relations[relationId])
    })
  }
}

export function addImportedGamesToGameModel(gameData) {
  // classLibrary.forEach((entityModel) => {
  //   if(gameData.entityModels[entityModel.entityModelId]) {
  //     gameData.entityModels[entityModel.entityModelId] = mergeDeep(_.cloneDeep(entityModel), gameData.entityModels[entityModel.entityModelId])
  //   } else {
  //     gameData.entityModels[entityModel.entityModelId] = _.cloneDeep(entityModel)
  //   }
  // })
  gameData.relationTags = {
    ..._.cloneDeep(initialTags),
    ...gameData.relationTags
  }

  gameData.importedArcadeGames.forEach((importedGame) => {
    if(importedGame.importedArcadeGames?.length) {
      return 
    }

    if(importedGame.entityModels) {
      Object.keys(importedGame.entityModels).forEach((entityModelId) => {
        const importedEntityModel = importedGame.entityModels[entityModelId]
        importedEntityModel.isImported = false
        if(importedEntityModel.dataSourceIID === DATA_SOURCE_SYSTEM_IID || importedEntityModel.dataSourceIID === DATA_SOURCE_AUTOGENERATED_IID) return 
        if(gameData.entityModels[entityModelId]) {
          gameData.entityModels[entityModelId] = mergeDeep(_.cloneDeep(importedEntityModel), gameData.entityModels[entityModelId])
        } else {
          gameData.entityModels[entityModelId] = _.cloneDeep(importedEntityModel)
        }
        gameData.entityModels[entityModelId].dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
      })
    }

    if(importedGame.relations) {
      Object.keys(importedGame.relations).forEach((relationId) => {
        const importedRelation = importedGame.relations[relationId]
        gameData.relations[relationId] = _.cloneDeep(importedRelation)
        gameData.relations[relationId].dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
        gameData.relations[relationId].isReadOnly = true
      })
    }

    if(importedGame.textures) {
      Object.keys(importedGame.textures).forEach((textureId) => {
        const importedTexture = importedGame.textures[textureId]
        gameData.textures[textureId] = _.cloneDeep(importedTexture)
      })
    }


    if(importedGame.effects) {
      Object.keys(importedGame.effects).forEach((effectId) => {
        const importedEffect = importedGame.effects[effectId]
        if(importedEffect.dataSourceIID === DATA_SOURCE_SYSTEM_IID) return
        gameData.effects[effectId] = _.cloneDeep(importedEffect)
        gameData.effects[effectId].dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
        gameData.effects[effectId].isReadOnly = true
      })
    }

    if(importedGame.events) {
      Object.keys(importedGame.events).forEach((effectId) => {
        const importedEffect = importedGame.events[effectId]
        gameData.events[effectId] = _.cloneDeep(importedEffect)
        gameData.events[effectId].dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
        gameData.events[effectId].isReadOnly = true
      })
    }

    if(importedGame.cutscenes) {
      Object.keys(importedGame.cutscenes).forEach((cutsceneId) => {
        const importedCutscene = importedGame.cutscenes[cutsceneId]
        gameData.cutscenes[cutsceneId] = _.cloneDeep(importedCutscene)
        gameData.cutscenes[cutsceneId].isReadOnly = true
      })
    }

    if(importedGame.relationTags) {
      Object.keys(importedGame.relationTags).forEach((relationTagId) => {
        const importedTag = importedGame.relationTags[relationTagId]
        if(importedTag.dataSourceIID === DATA_SOURCE_SYSTEM_IID) return 
        gameData.relationTags[relationTagId] = _.cloneDeep(importedTag)
        gameData.relationTags[relationTagId].dataSourceIID = DATA_SOURCE_IMPORTED_GAME_MODE_IID
        gameData.relationTags[relationTagId].isReadOnly = true
      })
    }
  })
}

export function enrichGameModel(gameData) {
  if(!gameData.brushes) gameData.brushes = {}
  if(!gameData.relationTags) gameData.relationTags = {}

  Object.keys(effectEditInterfaces).forEach((effectBehavior) => {
    const effectEditInterface = {...effectEditInterfaces[effectBehavior], ...effectInterfaceDatas[effectBehavior]}
    const effectName = effectEditInterface.displayName

    if(effectEditInterface.autogenerateEffect) {
      gameData.effects[effectBehavior] = {
        effectId: effectBehavior,
        effectBehavior: effectBehavior,
        dataSourceIID: DATA_SOURCE_SYSTEM_IID,
        customSelectorCategory: '_General',
        isReadOnly: true
      }

      if(effectEditInterface.autogenerateRelationForEvents) {
        effectEditInterface.autogenerateRelationForEvents.forEach((eventType) => {
          const eventId = effectBehavior + eventType
          const relationId = effectBehavior + eventType

          const eventTypeInterface = eventTypeInterfaces[eventType]
          const eventName = eventShortNames[eventType]

          if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT_IID) {
             gameData.relationTags[eventId] = {
              dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
              relationTagId: eventId,
              name: effectName + ' -  ' + eventName,
              relationTagIID: RELATION_TAG_GENERAL_IID,
              isReadOnly: true
              // editorInterface: {
              //   requiresUnlocking: true
              // }
            }

            gameData.events[eventId] = {
              eventId: eventId,
              eventType: eventType,
              relationTagIdA: eventId,
              dataSourceIID: DATA_SOURCE_SYSTEM_IID,
              isReadOnly: true
            }
          } else if(eventTypeInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT_IID || eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT_IID) {
            gameData.relationTags[eventId] = {
              dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
              relationTagId: eventId,
              name: effectName + ' -  Player ' + eventName,
              relationTagIID: RELATION_TAG_GENERAL_IID,
              isReadOnly: true
              // editorInterface: {
              //   requiresUnlocking: true
              // }
            }

            gameData.events[eventId] = {
              eventId: eventId,
              eventType: eventType,
              relationTagIdA: playerRelationTagId,
              relationTagIdB: eventId,
              dataSourceIID: DATA_SOURCE_SYSTEM_IID,
              isReadOnly: true
            }
          }
 
          gameData.relations[relationId] = {
            relationId: relationId,
            eventId,
            isReadOnly: true,
            effects: {
              [effectBehavior]: {
                effectId: effectBehavior,
                effectTagB: true
              }
            },
            effectIds: [effectBehavior],
            dataSourceIID: DATA_SOURCE_SYSTEM_IID
          }
          
        })
      }
    }
  })

  Object.keys(gameData.cutscenes).forEach((cutsceneId) => {
    const cutscene = gameData.cutscenes[cutsceneId]
    
    gameData.effects[cutsceneId] = {
      effectId: cutsceneId,
      effectBehavior: EFFECT_CUTSCENE,
      cutsceneId,
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
      isReadOnly: true
    }

    gameData.relationTags[cutsceneId] = {
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
      relationTagId: cutsceneId,
      name: 'Interact to play "' + cutscene.name + '"',
      isReadOnly: true,
      relationTagIID: cutscene.isDialogue ? RELATION_TAG_DIALOGUE_IID : RELATION_TAG_CUTSCENE_IID
    }

    gameData.events[cutsceneId] = {
      eventId: cutsceneId,
      eventType: ON_INTERACT,
      relationTagIdA: playerRelationTagId,
      relationTagIdB: cutsceneId,
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
      isReadOnly: true,
    }

    gameData.relations[cutsceneId] = {
      relationId: cutsceneId,
      eventId: cutsceneId,
      isReadOnly: true,
      effects: {
        [cutsceneId]: {
          effectId: cutsceneId
        }
      },
      effectIds: [cutsceneId],
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID
    }
  })

  Object.keys(gameData.entityModels).forEach((entityModelId) => {
    const entityModel = gameData.entityModels[entityModelId]

    entityModel.relationTags[entityModelId] = {
      isReadOnly: true
    }
    if(entityModel.entityIID === PLAYER_ENTITY_IID) {
      entityModel.relationTags[playerRelationTagId] = {
        isReadOnly: true,
      }
    }
   
    const transformIntoEffect = entityModel.autogeneration.transformIntoEffect
    if(transformIntoEffect) {
      const playerPowerUpEntityId = getPlayerPowerupEntityId(entityModelId)
      
      gameData.effects[playerPowerUpEntityId] = {
        effectId: playerPowerUpEntityId,
        effectBehavior: EFFECT_TRANSFORM,
        entityModelId,
        dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
        isReadOnly: true
      }

      const playerTransformIntoRelationTag = entityModel.autogeneration.playerTransformIntoRelationTag
      if(playerTransformIntoRelationTag) {
        gameData.events[playerPowerUpEntityId] = {
          eventId: playerPowerUpEntityId,
          eventType: ON_TOUCH_START,
          relationTagIdA: playerRelationTagId,
          relationTagIdB: playerPowerUpEntityId,
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true
        }

        gameData.relations[playerPowerUpEntityId] = {
          relationId: playerPowerUpEntityId,
          eventId: playerPowerUpEntityId,
          effects: {
            [playerPowerUpEntityId]: {
              effectTagA: true,
              effectId: playerPowerUpEntityId
            }
          },
          effectIds: [playerPowerUpEntityId],
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true
        }

        gameData.relationTags[playerPowerUpEntityId] = {
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          relationTagId: playerPowerUpEntityId,
          name: 'Touch to transform Player into ' + entityModel.name + '',
          relationTagIID: RELATION_TAG_TRANSFORM_IID,
          isReadOnly: true
          // editorInterface: {
          //   requiresUnlocking: true
          // }
        }
      }
    }

    const teleportToEffect = entityModel.autogeneration.teleportToEffect
    if(teleportToEffect) {
     
      const teleportEntityId = 'teleport-'+entityModelId
      gameData.effects[teleportEntityId] = {
        effectId: teleportEntityId,
        effectBehavior: EFFECT_TELEPORT,
        zoneEntityModelId: entityModelId,
        dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
        isReadOnly: true

      }

      const playerTeleportToRelationTag = entityModel.autogeneration.playerTeleportToRelationTag
      if(playerTeleportToRelationTag) {
        gameData.events[teleportEntityId] = {
          eventId: teleportEntityId,
          eventType: ON_INTERACT,
          relationTagIdA: playerRelationTagId,
          relationTagIdB: teleportEntityId,
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true
        }

        gameData.relations[teleportEntityId] = {
          relationId: teleportEntityId,
          eventId: teleportEntityId,
          effects: {
            [teleportEntityId]: {
              effectTagA: true,
              effectId: teleportEntityId
            }
          },
          effectIds: [teleportEntityId],
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true

        }

        gameData.relationTags[teleportEntityId] = {
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          relationTagId: teleportEntityId,
          name: 'Interact to teleport Player to ' + entityModel.name + '',
          relationTagIID: RELATION_TAG_TELEPORT_IID,
          isReadOnly: true
        }
      }
    }

    if(entityModel.spawnZoneEntityModelIds) {
      entityModel.spawnZoneEntityModelIds.forEach((zoneEntityModelId) => {
        const spawnEntityModelId = 'spawn-'+entityModelId+'-'+zoneEntityModelId
        gameData.effects[spawnEntityModelId] = {
          effectId: spawnEntityModelId,
          effectBehavior: EFFECT_SPAWN,
          zoneEntityModelId,
          spawnEntityModelId: entityModelId,
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true
        }
      })
    }

    const spawnOntoStageEffect = entityModel.autogeneration.spawnOntoStageEffect
    if(spawnOntoStageEffect) {
      const spawnEntityModelId = 'spawn-'+entityModelId
      gameData.effects[spawnEntityModelId] = {
        effectId: spawnEntityModelId,
        effectBehavior: EFFECT_SPAWN,
        zoneEntityModelId: initialStageZoneEntityId,
        spawnEntityModelId: entityModelId,
        isReadOnly: true,
        dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
      }
    }

    if(entityModel.graphics.textureId) {
      gameData.brushes[BRUSH_DID + entityModel.entityModelId] = {
        layerId: NON_LAYER_BRUSH_ID,
        textureId: entityModel.graphics.textureId,
        textureTint: entityModel.graphics.textureTint,
        dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
        isReadOnly: true
      }
    }

    if(entityModel.autogeneration.automaticEntityTag) {
      gameData.relationTags[entityModel.entityModelId] = {
        relationTagIID: RELATION_TAG_ENTITY_IID,
        dataSourceIID: DATA_SOURCE_ENTITY_MODEL_IID,
        textureId: entityModel.graphics.textureId,
        entityIID: entityModel.entityIID,
        textureTint: entityModel.graphics.textureTint,
        relationTagId: entityModel.entityModelId,
        isImported: entityModel.isImported,
        isRemoved: entityModel.isRemoved,
        name: entityModel.name,
        isReadOnly: true
      }
    }
  })
  
  Object.keys(gameData.relationTags).forEach((relationTagId) => {
    const relationTag = gameData.relationTags[relationTagId]
    const relationTagEntity  = gameData.entityModels[relationTagId]

    if(relationTag.relationTagIID === RELATION_TAG_ENTITY_IID || relationTag.relationTagIID === RELATION_TAG_GENERAL_IID) {
      if(relationTagEntity?.autogeneration.destroyAllEffect) {
        const destroyRelationTagId = 'destroy-'+relationTagId
        gameData.effects[destroyRelationTagId] = {
          effectId: destroyRelationTagId,
          effectBehavior: EFFECT_DESTROY,
          remoteEffectedRelationTagIds: [relationTagId],
          dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
          isReadOnly: true
        }
      }
    }
  })

  Object.keys(gameData.stages).forEach((stageId) => {
    gameData.effects[stageId] = {
      effectId: stageId,
      effectBehavior: EFFECT_SWITCH_STAGE,
      stageId,
      dataSourceIID: DATA_SOURCE_AUTOGENERATED_IID,
      isReadOnly: true
    }
  })

  Object.keys(gameData.relationTags).forEach((id) => {
    gameData.relationTags[id] = mergeDeep(_.cloneDeep(defaultRelationTag),  gameData.relationTags[id])
  })
}

export function cleanGameModel(gameData) {
  Object.keys(gameData.stages).forEach((key) => {
    const stage = gameData.stages[key]
    if (gameData.stages[key] === null || gameData.stages[key] === undefined) {
      console.log('deleting stage', key)
      delete gameData.stages[key];
    }

    // the default stage doesnt start with entityInstance because its virtual so gotta check
    if(stage.entityInstances) Object.keys(stage.entityInstances).forEach(key => {
      if (stage.entityInstances[key] === null || stage.entityInstances[key] === undefined) {
        console.log('deleting object', key)
        delete stage.entityInstances[key];
      }
    });
  })

  Object.keys(gameData.cutscenes).forEach(key => {
    if (gameData.cutscenes[key] === null || gameData.cutscenes[key] === undefined) {
      console.log('deleting cutscene', key)
      delete gameData.cutscenes[key];
    }
  });

  Object.keys(gameData.entityModels).forEach(key => {
    if (gameData.entityModels[key] === null || gameData.entityModels[key] === undefined) {
      console.log('deleting class', key)
      delete gameData.entityModels[key];
      return
    }
  });

  Object.keys(gameData.relations).forEach(key => {
    if (gameData.relations[key] === null || gameData.relations[key] === undefined) {
      console.log('deleting relation', key)
      delete gameData.relations[key];
    }
  });

  Object.keys(gameData.collisions).forEach(key => {
    if (gameData.collisions[key] === null || gameData.collisions[key] === undefined) {
      console.log('deleting collision', key)
      delete gameData.collisions[key];
    }
  });


  Object.keys(gameData.effects).forEach(key => {
    if (gameData.effects[key] === null || gameData.effects[key] === undefined) {
      console.log('deleting effect', key)
      delete gameData.effects[key];
    }
  });

  Object.keys(gameData.events).forEach(key => {
    if (gameData.events[key] === null || gameData.events[key] === undefined) {
      console.log('deleting event', key)
      delete gameData.events[key];
    }
  });

  
}
