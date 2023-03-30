import store from "../../../store"
import { ANIMATION_CAMERA_SHAKE, effectBehaviorInterfaces, EFFECT_CAMERA_SHAKE, EFFECT_CHANGE_GAME, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_OPEN_OVERLAY, EFFECT_TRANSFORM, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_WIN_GAME, GAME_OVER_STATE, NO_RELATION_TAG_EFFECT, PLAYER_INSTANCE_ID_PREFIX, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPAWNED_INSTANCE_ID_PREFIX, SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, SPAWN_ZONE_RANDOM_SELECT, WIN_GAME_STATE } from "../../constants"
import Phaser from "phaser";
import { clearCutscenes, openCutscene } from "../../../store/actions/game/playerInterfaceActions";
import { generateUniqueId } from "../../../utils/webPageUtils";
import { nonRemoteEffects } from "../../constants";
import { isZoneClassId } from "../../../utils/gameUtils";
import { changeCurrentStage } from "../../../store/actions/game/gameModelActions";
import { changeGameState, editGameRoom } from "../../../store/actions/game/gameRoomInstanceActions";
import _ from "lodash";
import { updateLobbyMember } from "../../../store/actions/experience/lobbyInstanceActions"

export class Effects {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene

    this.isVisibilityModified = null
    this.isIgnoreGravityModified = null
    this.wasIgnoreGravityModified = null 
    this.wasVisibilityModified = null

    this.timeToTriggerAgain = {}
  }

  update() {
    const entityClassId = this.entityInstance.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]
    const phaserInstance = this.entityInstance.phaserInstance

    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    if(this.wasIgnoreGravityModified && !this.isIgnoreGravityModified) {
      this.entityInstance.setIgnoreGravity(entityClass.movement.ignoreGravity)
    }

    this.wasIgnoreGravityModified = this.isIgnoreGravityModified
    this.isIgnoreGravityModified = false

    if(this.wasVisibilityModified && !this.isVisibilityModified) {
      this.entityInstance.isVisible = !entityClass.graphics.invisible
    }

    this.wasVisibilityModified = this.isVisibilityModified
    this.isVisibilityModified = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (phaserInstance.lockedTo) {
      phaserInstance.body.position.x += phaserInstance.lockedTo.body.deltaX();
      phaserInstance.body.position.y += phaserInstance.lockedTo.body.deltaY();   
    }
    
    if (phaserInstance.lockedTo && this.fallenOff(phaserInstance, phaserInstance.lockedTo, phaserInstance.lockedReleaseSides)) {
      phaserInstance.lockedTo = null;   
      phaserInstance.lockedReleaseSides = null
      this.entityInstance.setIgnoreGravity(entityClass.movement.ignoreGravity);
    }
  }

  unregister() {
    const phaserInstance = this.entityInstance.phaserInstance
    phaserInstance.lockedTo = null
  }

  fallenOff(player, platform, sides) {
    // if turns out to be annoying
    if(Phaser.Math.Distance.Between(player.body.x, player.body.y, platform.body.x, platform.body.y) > 100) {
      return true
    }

    if(sides[SIDE_LEFT] || sides[SIDE_RIGHT]) {
      return (
        player.body.bottom <= platform.body.position.y ||
        player.body.position.y >= platform.body.bottom 
      );
    } else if(sides[SIDE_UP] >= 0 || sides[SIDE_DOWN] >= 0) {
      return (
        player.body.right <= platform.body.position.x ||
        player.body.position.x >= platform.body.right 
      );
    } else {
      return (
        (player.body.right <= platform.body.position.x ||
        player.body.position.x >= platform.body.right) && (
          player.body.bottom <= platform.body.position.y ||
          player.body.position.y >= platform.body.bottom 
        )
      );
    }
  }

  getEffectedPhaserInstances({phaserInstanceA, phaserInstanceB, sidesA, sidesB, effect}) {
    const phaserInstances = []
    const alternatePhaserInstanceData = {}

    if(effect.effectTagA) {
      phaserInstances.push(phaserInstanceA)
      alternatePhaserInstanceData.phaserInstance = phaserInstanceB
      alternatePhaserInstanceData.sides = sidesB
    }

    if(effect.effectTagB) {
      phaserInstances.push(phaserInstanceB)
      alternatePhaserInstanceData.phaserInstance = phaserInstanceA
      alternatePhaserInstanceData.sides = sidesA
    }

    let remoteEffectedRelationTagIds = effect.remoteEffectedRelationTagIds?.slice()
    if(effect.remoteEffectedRelationTagIdsExtension) {
      remoteEffectedRelationTagIds.push(...effect.remoteEffectedRelationTagIdsExtension)
    }

    if(remoteEffectedRelationTagIds && !nonRemoteEffects[effect.effectBehavior]) {
      remoteEffectedRelationTagIds?.forEach((relationTagId) => {
        this.scene.entityInstancesByTag[relationTagId]?.forEach((entityInstance) => {
          phaserInstances.push(entityInstance.phaserInstance)
        })
      })
    }

    return [phaserInstances, alternatePhaserInstanceData]
  }
  
  runCollideActiveEffect({
    relation,
    phaserInstanceA,
    phaserInstanceB,
    sidesA = [],
    sidesB = []
  }) {
    const effect = relation.effect
    const scene = this.scene

    const [phaserInstances, alternatePhaserInstanceData] = this.getEffectedPhaserInstances({
      phaserInstanceA,
      phaserInstanceB,
      sidesA,
      sidesB,
      effect: relation.effect
    })

    phaserInstances.forEach((phaserInstance) => {
      runEffect(phaserInstance)
    })

    function runEffect(phaserInstance) {
      const entityInstance = scene.getEntityInstance(phaserInstance.entityInstanceId)
      if(effect.effectBehavior === EFFECT_INVISIBLE && !entityInstance.effects.isVisibilityModified) {
        entityInstance.effects.isVisibilityModified = true
        entityInstance.isVisible = false
      }

      if(effect.effectBehavior === EFFECT_IGNORE_GRAVITY && !entityInstance.effects.isIgnoreGravityModified) {
        entityInstance.effects.isIgnoreGravityModified = true
        entityInstance.setIgnoreGravity(true)
      }

      if(effect.effectBehavior === EFFECT_STICK_TO) {
        if(!alternatePhaserInstanceData.phaserInstance) console.error('bad!, stick to will not work here')
        phaserInstance.lockedTo = alternatePhaserInstanceData.phaserInstance;   
        phaserInstance.lockedReleaseSides = alternatePhaserInstanceData.sides
        entityInstance.effects.isIgnoreGravityModified = true
        entityInstance.setIgnoreGravity(true)
      }
    }
  }

  runTargetlessAccuteEffect({relation, phaserInstanceA, phaserInstanceB}) {
    const effect = relation.effect

    if(effect.effectBehavior === EFFECT_CAMERA_SHAKE) {
      this.scene.callGameInstanceEvent({
        gameInstanceEventType: ANIMATION_CAMERA_SHAKE,
        data: {
          intensity: 200,
        }
      })
    }

    if(effect.effectBehavior === EFFECT_WIN_GAME) {
      store.dispatch(changeGameState(WIN_GAME_STATE, effect.text))
      this.scene.sendResetGameEvent()
    } else if(effect.effectBehavior === EFFECT_GAME_OVER) {
      store.dispatch(changeGameState(GAME_OVER_STATE, effect.text))
      this.scene.sendResetGameEvent()
    } else if(effect.effectBehavior === EFFECT_SWITCH_STAGE) {
      store.dispatch(changeCurrentStage(effect.stageId))
      store.dispatch(clearCutscenes())
    } else if(effect.effectBehavior === EFFECT_CHANGE_GAME) {
      store.dispatch(editGameRoom(this.scene.gameRoomInstance.id, {
        arcadeGameMongoId: effect.arcadeGameMongoId
      }))
    } else if(effect.effectBehavior === EFFECT_OPEN_OVERLAY) {
      const state = store.getState()
      store.dispatch(updateLobbyMember({
        lobbyInstanceMongoId: state.lobbyInstance.lobbyInstance?.id,
        userMongoId: state.auth.me?.id, 
        member: {
          inOverlayView: true
        }
      }))
    }

    // NARRATIVE
    if(effect.effectBehavior === EFFECT_CUTSCENE) {
      if(effect.cutsceneId) store.dispatch(openCutscene(phaserInstanceB.entityClassId, effect.cutsceneId))
    }

    if(effect.effectBehavior === EFFECT_SPAWN) {
      const spawningClassId = effect.spawnEntityClassId
      const modifiedClassData = { spawnX: null, spawnY: null, entityClassId: spawningClassId }
      let zone 


    if(effect.spawnZoneSelectorType === SPAWN_ZONE_A_SELECT) {
        if(isZoneClassId(phaserInstanceA.entityClassId)) {
          zone = phaserInstanceA
        } 
      } else if(effect.spawnZoneSelectorType === SPAWN_ZONE_B_SELECT) {
        if(isZoneClassId(phaserInstanceB.entityClassId)) {
          zone = phaserInstanceB
        } 
      } else {
          //  if(effect.spawnZoneSelectorType === SPAWN_ZONE_RANDOM_SELECT) {
        zone = this.scene.getRandomInstanceOfClassId(effect.zoneEntityClassId)
      // } else
      }

      if(!zone) return console.log('no zone exists for that')
      const gameModel = store.getState().gameModel.gameModel
      const entityClass = gameModel.entityClasses[spawningClassId]
      const spawnedEntityInstance =  this.scene.addEntityInstance(SPAWNED_INSTANCE_ID_PREFIX+generateUniqueId(), modifiedClassData, true)
      spawnedEntityInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(entityClass))
    }
  }

  runAccuteEffect({
    relation,
    phaserInstanceA,
    phaserInstanceB,
    sidesA = [],
    sidesB = []
  }) {
    const effect = relation.effect
    const scene = this.scene

    if(this.timeToTriggerAgain[relation.relationId]) {
      if(this.timeToTriggerAgain[relation.relationId] > Date.now()) {
        return
      }
    }

    if(relation.event.onlyOnce) {
      this.timeToTriggerAgain[relation.relationId] = Date.now() + 10000000000000
    } else {
      if(relation.effect.effectCooldown) {
        this.timeToTriggerAgain[relation.relationId] = Date.now() + relation.effect.effectCooldown
      } else if(relation.effect === EFFECT_SPAWN) {
        this.timeToTriggerAgain[relation.relationId] = Date.now() + 200
      }
    }
    

    if(relation.effect.effectDelay) {
      setTimeout(() => {
        const delayedRelation = _.cloneDeep(relation)
        delayedRelation.effect.effectDelay = null
        this.runAccuteEffect({
          relation: delayedRelation,
          phaserInstanceA,
          phaserInstanceB,
          sidesA,
          sidesB
        })
      }, relation.effect.effectDelay)
      return
    }

    if(effectBehaviorInterfaces[effect.effectBehavior].effectableType === NO_RELATION_TAG_EFFECT) {
      return this.runTargetlessAccuteEffect({
        relation,
        phaserInstanceA,
        phaserInstanceB,
      })
    }

    const [phaserInstances] = this.getEffectedPhaserInstances({
      phaserInstanceA,
      phaserInstanceB,
      sidesA,
      sidesB,
      effect
    })

    phaserInstances.forEach((phaserInstance) => {
      runEffect(phaserInstance)
    })

    function runEffect(phaserInstance) {
      if(effect.effectBehavior === EFFECT_STICK_TO) {
        phaserInstance.body.setVelocityY(0)
        phaserInstance.body.setVelocityX(0)
      }

      if(effect.effectBehavior === EFFECT_TELEPORT) {
        const gameModel = store.getState().gameModel.gameModel
        const entityClass = gameModel.entityClasses[phaserInstance.entityClassId]
        const zone = scene.getRandomInstanceOfClassId(effect.zoneEntityClassId)
        if(!zone) return
        phaserInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(entityClass))
      }
      
      if(effect.effectBehavior === EFFECT_DESTROY) {
        const entityInstance = scene.getEntityInstance(phaserInstance.entityInstanceId)
        entityInstance.destroyAfterUpdate = true
      } else if(effect.effectBehavior === EFFECT_TRANSFORM) {
        const entityInstance = scene.getEntityInstance(phaserInstance.entityInstanceId)
        entityInstance.transformEntityClassId = effect.entityClassId
      }
    }
  }
}