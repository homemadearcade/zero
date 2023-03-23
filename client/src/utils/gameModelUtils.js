import _ from "lodash"
import { classLibrary } from "../game/classLibrary"
import { BRUSH_ID_PREFIX, defaultClass, defaultEntityInstance, defaultStage, effectBehaviorInterfaces, EFFECT_CUTSCENE, EFFECT_SPAWN, initialStageZoneClassId, initialTags, NON_LAYER_BRUSH_ID } from "../game/constants"
import { mergeDeep } from "./utils"
import { defaultTag, EFFECT_DESTROY, EFFECT_TRANSFORM, EFFECT_TELEPORT,  ON_INTERACT, playerRelationTagId, PLAYER_CLASS, RELATION_TAG_CLASS, RELATION_TAG_CUTSCENE, RELATION_TAG_DIALOGUE, RELATION_TAG_LIBRARY, ZONE_CLASS } from '../game/constants';
import { libraryClassAugment } from '../game/constants';

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

    if(gameData.entityClasses) Object.keys(gameData.entityClasses).forEach((id) => {
      if(!oldGameData.entityClasses[id]) gameData.entityClasses[id] = mergeDeep(_.cloneDeep(defaultClass), gameData.entityClasses[id])
    })

    return 
  }

  if(gameData.entityClasses) {
    Object.keys(gameData.entityClasses).forEach((id) => {
      gameData.entityClasses[id] = mergeDeep(_.cloneDeep(defaultClass), gameData.entityClasses[id])
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
}

export function addLibraryToGameModel(gameData) {
  classLibrary.forEach((libraryObjectClass) => {
    if(!gameData.entityClasses[libraryObjectClass.entityClassId]) {
      gameData.entityClasses[libraryObjectClass.entityClassId] = mergeDeep(_.cloneDeep(libraryObjectClass), _.cloneDeep(libraryClassAugment))
    } else {
      gameData.entityClasses[libraryObjectClass.entityClassId] = mergeDeep(_.cloneDeep(libraryObjectClass), _.cloneDeep(libraryClassAugment), gameData.entityClasses[libraryObjectClass.entityClassId])
    }
  })

  gameData.relationTags = {
    ..._.cloneDeep(initialTags),
    ...gameData.relationTags
  }
}

export function enrichGameModel(gameData) {
  if(!gameData.brushes) gameData.brushes = {}
  if(!gameData.relationTags) gameData.relationTags = {}

  Object.keys(effectBehaviorInterfaces).forEach((effectBehavior) => {
    const effectBehaviorInterface = effectBehaviorInterfaces[effectBehavior]
    if(effectBehaviorInterface.isStandalone) {
      gameData.effects[effectBehavior] = {
        effectId: effectBehavior,
        effectBehavior: effectBehavior,
        isAutogenerated: true,
        customCategory: '_General'
      }
    }
  })

  Object.keys(gameData.cutscenes).forEach((cutsceneId) => {
    const cutscene = gameData.cutscenes[cutsceneId]
    gameData.effects[cutsceneId] = {
      effectId: cutsceneId,
      effectBehavior: EFFECT_CUTSCENE,
      cutsceneId,
      isAutogenerated: true
    }

    gameData.relationTags[cutsceneId] = {
      ...defaultTag,
      isAutogenerated: true,
      relationTagId: cutscene,
      name: 'Interact to play "' + cutscene.name + '"',
      relationTagInterfaceType: cutscene.inDialogueMenu ? RELATION_TAG_DIALOGUE : RELATION_TAG_CUTSCENE
    }

    gameData.events[cutsceneId] = {
      eventId: cutsceneId,
      eventType: ON_INTERACT,
      relationTagIdA: playerRelationTagId,
      relationTagIdB: cutsceneId,
      isAutogenerated: true
    }

    gameData.relations[cutsceneId] = {
      relationId: cutsceneId,
      eventId: cutsceneId,
      effects: {
        [cutsceneId]: {
          effectId: cutsceneId
        }
      },
      effectIds: [cutsceneId],
      isAutogenerated: true
    }
  })

  Object.keys(gameData.entityClasses).forEach((entityClassId) => {
    const entityClass = gameData.entityClasses[entityClassId]

    entityClass.relationTags[entityClassId] = {
      isAutogenerated: true
    }
    if(entityClass.classInterfaceCategory === PLAYER_CLASS) {
      entityClass.relationTags[playerRelationTagId] = {
        isAutogenerated: true,
      }
    }

   
    const noTransformEffect = entityClass.editorInterface.noTransformEffect
    if(!noTransformEffect) {
      const transformClassId = 'transform-'+entityClassId
      gameData.effects[transformClassId] = {
        effectId: transformClassId,
        effectBehavior: EFFECT_TRANSFORM,
        entityClassId,
        isAutogenerated: true
      }
    }

    const noTeleportEffect = entityClass.editorInterface.noTeleportEffect
    if(entityClass.classInterfaceCategory === ZONE_CLASS && !noTeleportEffect) {
      const teleportClassId = 'teleport-'+entityClassId
      gameData.effects[teleportClassId] = {
        effectId: teleportClassId,
        effectBehavior: EFFECT_TELEPORT,
        zoneClassId: entityClassId,
        isAutogenerated: true
      }
    }

    const noSpawnAnywhereEffect = entityClass.editorInterface.noTeleportEffect
    if(!noSpawnAnywhereEffect) {
      const spawnClassId = 'spawn-'+entityClassId
      gameData.effects[spawnClassId] = {
        effectId: spawnClassId,
        effectBehavior: EFFECT_SPAWN,
        zoneClassId: initialStageZoneClassId,
        spawnClassId: entityClassId,
        isAutogenerated: true,
      }
    }

    if(entityClass.graphics.textureId) {
      gameData.brushes[BRUSH_ID_PREFIX + entityClass.entityClassId] = {
        layerId: NON_LAYER_BRUSH_ID,
        textureId: entityClass.graphics.textureId,
        textureTint: entityClass.graphics.textureTint
      }
    }

    gameData.relationTags[entityClass.entityClassId] = {
      relationTagInterfaceType: RELATION_TAG_CLASS,
      isAutogenerated: true,
      textureId: entityClass.graphics.textureId,
      interfaceLocked: entityClass.interfaceLocked,
      textureTint: entityClass.graphics.textureTint,
      relationTagId: entityClass.entityClassId,
      isRemoved: entityClass.isRemoved,
      name: entityClass.name,
    }
  })
  
  Object.keys(gameData.relationTags).forEach((relationTagId) => {
    const relationTag = gameData.relationTags[relationTagId]
    const relationTagClass  = gameData.entityClasses[relationTagId]

    if(relationTag.relationTagInterfaceType === RELATION_TAG_CLASS || relationTag.relationTagInterfaceType === RELATION_TAG_LIBRARY) {
      if(relationTagClass?.noDestroyAllEffect) return 

      const destroyRelationTagId = 'destroy-'+relationTagId
      gameData.effects[destroyRelationTagId] = {
        effectId: destroyRelationTagId,
        effectBehavior: EFFECT_DESTROY,
        remoteEffectedRelationTagIds: [relationTagId],
        isAutogenerated: true
      }
    }
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

  Object.keys(gameData.entityClasses).forEach(key => {
    if (gameData.entityClasses[key] === null || gameData.entityClasses[key] === undefined) {
      console.log('deleting class', key)
      delete gameData.entityClasses[key];
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
