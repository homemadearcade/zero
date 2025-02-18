import { BOUNDARY_DOWN_WALL_ID, BOUNDARY_LEFT_WALL_ID, BOUNDARY_RIGHT_WALL_ID, BOUNDARY_UP_WALL_ID, BOUNDARY_WALL_ID, PLAYER_INSTANCE_DID, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, ENTITY_MODEL_DID, PLAYER_ENTITY_TYPE_PREFIX, ZONE_ENTITY_TYPE_PREFIX, effectInterfaceData, getEffectShorthand, EFFECT_INTERFACE_UNLOCK, isUseableEffect, EFFECT_INTERFACE_ACTION, RUN_GAME_INSTANCE_ACTION, EFFECT_CUTSCENE } from "../game/constants";
import { GameClientScene } from "../game/scenes/GameClientScene";
import { GameHostScene } from "../game/scenes/GameHostScene";
import { GameLocalScene } from "../game/scenes/GameLocalScene";
import { GamePlayScene } from "../game/scenes/GamePlayScene";
import store from "../store";
import { getCobrowsingState } from "./cobrowsingUtils";
import { getCurrentGameScene } from "./editorUtils";
import Phaser from 'phaser'
import { interfaceActionData } from "../constants/interfaceActionIdData";
import { unlockInterfaceId } from "../store/actions/game/unlockedInterfaceActions";
import { RELATION_TAG_GENERAL_IID } from "../constants/interfaceIds";
import { interfaceActionGroupData } from "../constants";

export const getGameModelSize = (gameModel) => {
  const width = gameModel.size.nodeSize * gameModel.size.gridWidth
  const height = gameModel.size.nodeSize * gameModel.size.gridHeight
  const aspectRatio = width / height

  return {
    width,
    height,
    aspectRatio
  }
}

export function runEffect(effect) {
  const effectId = effect.effectId 
  if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    effect.onClick(store.dispatch, gameModel, store.getState)
  } else if(effect.effectBehavior === EFFECT_INTERFACE_UNLOCK) {
    store.dispatch(unlockInterfaceId(effect.interfaceId))
  } else {
    const gameInstance = getCurrentGameScene(store.getState().webPage.gameInstance)
    gameInstance.callGameInstanceEvent({gameRoomInstanceEventType: RUN_GAME_INSTANCE_ACTION, data: { effectId } , hostOnly: true })
  }
}

export function enrichEffectData(effect, eventType, gameModel) {
  const effectTypeInterfaceData = effectInterfaceData[effect.effectBehavior]

  let subTitle = effect.subTitle || getEffectShorthand(effect)
  if(effect.effectBehavior === EFFECT_INTERFACE_UNLOCK) {
    subTitle = null
  }

  let icon = effect.icon || effectTypeInterfaceData.icon
  let subIcon = effect.subIcon || effectTypeInterfaceData.subIcon
  let group = effect.group || effectTypeInterfaceData.displayName

  if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
    const actionIdData = interfaceActionData[effect.interfaceActionId]
    const groupIdData = interfaceActionGroupData[actionIdData.interfaceActionGroupId]
    icon = effect.icon || groupIdData?.icon || icon 
    subIcon = effect.subIcon || actionIdData.subIcon || subIcon
    group = effect.group || actionIdData.group || groupIdData?.displayName || group
  }

  let isRemoved = effect.isRemoved || !isUseableEffect(effect, effect.effectBehavior, eventType)

  let textureId = effect.textureId
  let textureTint = effect.textureTint

  const entityModelId = effect.entityModelId ||effect.spawnEntityModelId || effect.zoneEntityModelId

  // override any texture Ids if we have an entity model
  if(entityModelId) {
    const entityModel = gameModel.entityModels[entityModelId]
    if(entityModel) {
      textureId = entityModel.graphics.textureId
      textureTint = entityModel.graphics.textureTint
    }
  }
  if(effect.remoteEffectedRelationTagIds && !entityModelId) {
    const relationTagId = effect.remoteEffectedRelationTagIds[0]
    const relationTag = gameModel.relationTags[relationTagId]
    if(relationTag) {
      textureId = relationTag.textureId
      textureTint = relationTag.textureTint
    }
  } 


  /// commonly used
  let isCommonlyUsed = effect.isCommonlyUsed

  if(effect.effectBehavior === EFFECT_INTERFACE_ACTION) {
    const interfaceAction = interfaceActionData[effect.interfaceActionId]
    if(interfaceAction) {
      isCommonlyUsed = interfaceAction.isCommonlyUsed
    }

    if(interfaceAction.subscribedCobrowsingRequired || interfaceAction.activeCobrowsingRequired) {
      const isSubscribedCobrowsing = store.getState().cobrowsing.isSubscribedCobrowsing
      if(!isSubscribedCobrowsing) {
        isRemoved = true
      }
    }
  }

  return {
    title: effect.title,
    subTitle,
    icon,
    subIcon,
    group,
    isRemoved,
    textureId,
    textureTint,
    isCommonlyUsed
  }
}


export function isGameBoundaryWall(world, body) {
  if(body === world.walls.left || body === world.walls.right || body === world.walls.up || body === world.walls.down) {
    return true
  }

  return false
}

export function getAngleBetweenInstances(obj1, obj2) {
  let sprite1 = obj1.physicsSprite ? obj1.physicsSprite : obj1
  let sprite2 = obj2.physicsSprite ? obj2.physicsSprite : obj2

    //I use the offset because the ship is pointing down
    //at the 6 o'clock position
    //set to 0 if your sprite is facing 3 o'clock
    //set to 180 if your sprite is facing 9 o'clock
    //set to 270 if your sprite is facing 12 o'clock
    //
    // let offSet = 90;
    // angle in radians
    // let angleRadians = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    // angle in degrees
    let angleDeg = (Math.atan2(sprite2.y - sprite1.y, sprite2.x - sprite1.x) * 180 / Math.PI);
    //add the offset
    // angleDeg += offSet;

    return Phaser.Math.DegToRad(angleDeg)
}

export function getEntityAandB(entityModelIdA, entityModelIdB) {
  const state = store.getState()
  const gameModel = state.gameModel.gameModel

  let classA = gameModel.entityModels[entityModelIdA] 
  let classB = gameModel.entityModels[entityModelIdB]

  return {
    classA, 
    classB
  }
}

export function getTextureIdForLayerId(arcadeGameMongoId, stageId, layerId) {
   return arcadeGameMongoId+'/' + stageId + '_' + layerId
}

export function isEventMatch({effect, entityModelId, world, entityModel, body}) {
  if(
    (entityModelId === BOUNDARY_DOWN_WALL_ID && body === world.walls.down) ||
    (entityModelId === BOUNDARY_UP_WALL_ID && body === world.walls.up) ||
    (entityModelId === BOUNDARY_LEFT_WALL_ID && body === world.walls.left) ||
    (entityModelId === BOUNDARY_RIGHT_WALL_ID && body === world.walls.right) ||
    (entityModelId === BOUNDARY_WALL_ID && isGameBoundaryWall(world, body))
  ) {
    return true
  }

  if(!entityModel) return false
  
  if(entityModel.entityModelId === entityModelId) {
    return true
  }

  return false
}

export function areBSidesHit(sidesList, a, b) {
  const verdict = sidesList.some((side) => {
    if(side === SIDE_UP) {
      if (b.body.touching.up && a.body.touching.down) {
        return true
      }
    } else if(side === SIDE_DOWN) {
      if (b.body.touching.down && a.body.touching.up) {
        return true
      }
    } else if(side === SIDE_RIGHT) {
      if (b.body.touching.right && a.body.touching.left) {
        return true
      }
    } else if(side === SIDE_LEFT) {
      if (b.body.touching.left && a.body.touching.right) {
        return true
      }
    }

    return false
  })

  return verdict
}

export function getEntityDisplayName(visualTags, entityModelId) {
  return visualTags ? visualTags[0] : entityModelId
}

export function getOppositeColliderRelationTagId(relationTagId, collision) {
  if(relationTagId === collision.relationTagIdA) {
    return collision.relationTagIdB
  }
  if(relationTagId === collision.relationTagIdB) {
    return collision.relationTagIdA
  }

  return null
}

export function isPlayerId(id) {
  if(id.indexOf(ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX) === 0) {
    return true
  }

  if(id.indexOf(PLAYER_INSTANCE_DID) === 0) {
    return true
  }
}

export function isZoneEntityId(id) {
  if(id.indexOf(ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX) === 0) {
    return true
  }
}


// getRandomPosition(x, y, w, h) {
//   const xPlus = Math.random() * w
//   const yPlus = Math.random() * h

//   return {
//     x: x + xPlus,
//     y: y + yPlus
//   }
// }

// export function getGameStateFromGameModel(gameModel) {
//   const stages = gameModel.stages

//   const initialStageId = gameModel.player.startingStageId
//   const stage = gameModel.stages[initialStageId]
//   const zoneId = stage.playerSpawnZoneEntityId
//   // const zone = this.getRandomInstanceOfEntityId(zoneId)
//   const playerEntityModelId = stage.playerEntityModelId ? stage.playerEntityModelId : directionalPlayerEntityId
//   const playerEntityModel = gameModel.entityModels[playerEntityModelId]

//   const zones = Object.keys(stage.entityModels).map((entityInstanceId) => {
//     const entityInstance = stages[initialStageId].entityInstances[entityInstanceId]
//     const { spawnX, spawnY, width, height, entityModelId } = entityInstance

//     return {
//       x: spawnX,
//       y: spawnY,
//       width, height,
//       entityModelId,
//       entityInstanceId
//     }
//   }).filter((entityInstance) => {
//     return entityInstance.entityModelId === zoneId
//   })
//   const zone = zones[Math.floor(Math.random() * zones.length - 1)]

//   const { x, y } = getRandomPosition(zone.x, zone.y, zone.width, zone.height)
//   // const { x, y } = zone.getInnerCoordinates(lastPlayerEntityModel) 

//   return {
//     playerInstance: {
//       spawnX: x,
//       spawnY: y,
//       x,
//       y,
//       entityModelId: playerEntityModelId
//     },
//     stages: Object.keys(stages).map((stageId) => {

//       const entityInstances = Object.keys(stages[stageId].entityInstances).map((entityInstanceId) => {
//         const entityInstance = stages[stageId].entityInstances[entityInstanceId]
//         const { spawnX, spawnY, width, height, entityModelId } = entityInstance
//         return {
//           x: spawnX,
//           y: spawnY,
//           spawnX,
//           spawnY,
//           width,
//           height,
//           entityInstanceId,
//           entityModelId,
//           removed: false,
//           effectSpawned: false,
//           isVisible: true,
//           transformEntityModelId: null,
//           destroyAfterUpdate: false
//         }
//       })

//       return {
//         stageId,
//         entityInstances,
//         temporaryInstances: []
//       }
//     }).reduce((prev, next) => {
//       prev[next.stageId] = next
//       return prev
//     }, {}),
//     player: gameModel.player
//   }
// }

export function createGameSceneInstance(key, gameRoomInstance) {
  const { isEdit, isOnlineMultiplayer, isHost } = gameRoomInstance
  if(isEdit) {
    if(isOnlineMultiplayer) {
      if(isHost) {
        return new GameHostScene({ gameRoomInstance: gameRoomInstance, key, stageId: key})
      } else {
        return new GameClientScene({ gameRoomInstance: gameRoomInstance, key, stageId: key})
      }
    } else {
      return new GameLocalScene({ gameRoomInstance: gameRoomInstance, key, stageId: key})
    }
  } else {
    return new GamePlayScene({ gameRoomInstance: gameRoomInstance, key, stageId: key})
  }
}

export function getRelationsForEntityModel({entityModel, gameModel, showUnregisteredRelations = false}) {
  const entityModelRelationTags = Object.keys(entityModel.relationTags).filter(relationTagId => {
    const entityModelRelationTag = entityModel.relationTags[relationTagId]
    return !!entityModelRelationTag
  })

  const relationTagIdsRegistered = Object.values(gameModel.entityModels).reduce((acc, entityModel) => {
    const entityModelRelationTags = Object.keys(entityModel.relationTags).filter(relationTagId => {
      const entityModelRelationTag = entityModel.relationTags[relationTagId]
      return !!entityModelRelationTag
    })

    return acc.concat(entityModelRelationTags)
  }, [])

  const relationsForEachTag = entityModelRelationTags.map(entityModelRelationTagId => {
    const relationTag = gameModel.relationTags[entityModelRelationTagId]
    const relations = Object.values(gameModel.relations).filter(relation => {
      if(relation.isRemoved) {
        return false
      }

      const event = gameModel.events[relation.eventId]

      const hasTagA = (event.relationTagIdA && event.relationTagIdA === relationTag.relationTagId)
      const hasTagB = (event.relationTagIdB && event.relationTagIdB === relationTag.relationTagId)
      
      const relationTagA = gameModel.relationTags[event.relationTagIdA]
      const relationTagB = gameModel.relationTags[event.relationTagIdB]
      const isTagARegistered = relationTagIdsRegistered.includes(event.relationTagIdA) || RELATION_TAG_GENERAL_IID === relationTagA.relationTagIID
      const isTagBRegistered = !event.relationTagIdB || relationTagIdsRegistered.includes(event.relationTagIdB) || RELATION_TAG_GENERAL_IID === relationTagB?.relationTagIID

      return (hasTagA || hasTagB) && (showUnregisteredRelations || (isTagARegistered && isTagBRegistered))
    })

    return {
      relationTag,
      relations
    }
  })

  return relationsForEachTag
}

export function getCutscenesForEntityModel({entityModel, gameModel}) {
  const entityModelCutscenesInvolved = Object.keys(gameModel.cutscenes).filter(cutsceneId => {
    const entityModelCutscene = gameModel.cutscenes[cutsceneId]
    return entityModelCutscene.scenes.some(scene => {
      return scene.entityModelId === entityModel.entityModelId
    })
  })

  const cutsceneRelationTags = []
  const cutsceneIdsByEventType = {}

  const relationsForEachTag = getRelationsForEntityModel({entityModel, gameModel, showUnregisteredRelations: true})

  relationsForEachTag.forEach(({relationTag, relations}) => {
    relations.forEach(relation => {
      const event = gameModel.events[relation.eventId]
      relation.effectIds.forEach(effectId => {
        const effect = gameModel.effects[effectId]
        if(effect.effectBehavior === EFFECT_CUTSCENE) {
          const cutscene = gameModel.cutscenes[effect.cutsceneId]
          if(cutscene) {
            cutsceneRelationTags.push({
              relationTag,
              cutsceneIds: [cutscene.cutsceneId]
            })

            const eventType = event.eventType
            if(!cutsceneIdsByEventType[eventType]) {
              cutsceneIdsByEventType[eventType] = [cutscene.cutsceneId]
            } else {
              cutsceneIdsByEventType[eventType].push(cutscene.cutsceneId)
            }
          }
        }
      })
    })
  })

  return {
    entityModelCutscenesInvolved,
    cutsceneIdsByEventType,
    cutsceneRelationTags
  }
}


window.consoleTools = {
  getCurrentScene: () => { return getCurrentGameScene(store.getState().webPage.gameInstance) },
  getCurrentGameModel: () => { return store.getState().gameModel.gameModel },
  getCurrentState: () => { return store.getState() },
  getCobrowsingState: () => { return getCobrowsingState({forceActiveCobrowsing: true }) },
  getCurrentPhaserWorld: () => { return getCurrentGameScene(store.getState().webPage.gameInstance).world }
}