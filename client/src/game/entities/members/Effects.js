import store from "../../../store"
import { ANIMATION_CAMERA_SHAKE, effectBehaviorInterface, EFFECT_CAMERA_SHAKE, EFFECT_CHANGE_GAME, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_OPEN_OVERLAY, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_WIN_GAME, GAME_OVER_STATE, NO_TAG_EFFECT, PLAYER_INSTANCE_ID_PREFIX, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPAWNED_INSTANCE_ID_PREFIX, SPAWN_ZONE_A_SELECT, SPAWN_ZONE_B_SELECT, SPAWN_ZONE_RANDOM_SELECT, WIN_GAME_STATE } from "../../constants"
import Phaser from "phaser";
import { clearCutscenes, openCutscene } from "../../../store/actions/playerInterfaceActions";
import { generateUniqueId } from "../../../utils/webPageUtils";
import { nonRemoteEffects } from "../../constants";
import { isZoneClassId } from "../../../utils/gameUtils";
import { changeCurrentStage } from "../../../store/actions/gameModelActions";
import { changeGameState, editGameRoom } from "../../../store/actions/gameRoomActions";
import _ from "lodash";
import { updateLobbyUser } from "../../../store/actions/lobbyActions"

export class Effects {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene

    this.isVisibilityModified = null
    this.isIgnoreGravityModified = null
    this.wasIgnoreGravityModified = null 
    this.wasVisibilityModified = null

    this.timeToTriggerAgain = {}
  }

  update() {
    const classId = this.objectInstance.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    const sprite = this.objectInstance.sprite

    ////////////////////////////////////////
    ////////////////////////////////////////
    // VISIBLITY AND IGNORE GRAVITY EFFECTS
    if(this.wasIgnoreGravityModified && !this.isIgnoreGravityModified) {
      this.objectInstance.setIgnoreGravity(objectClass.movement.ignoreGravity)
    }

    this.wasIgnoreGravityModified = this.isIgnoreGravityModified
    this.isIgnoreGravityModified = false

    if(this.wasVisibilityModified && !this.isVisibilityModified) {
      this.objectInstance.isVisible = !objectClass.graphics.invisible
    }

    this.wasVisibilityModified = this.isVisibilityModified
    this.isVisibilityModified = false

    ////////////////////////////////////////
    ////////////////////////////////////////
    // STICK TO EFFECT
    if (sprite.lockedTo) {
      sprite.body.position.x += sprite.lockedTo.body.deltaX();
      sprite.body.position.y += sprite.lockedTo.body.deltaY();   
    }
    
    if (sprite.lockedTo && this.fallenOff(sprite, sprite.lockedTo, sprite.lockedReleaseSides)) {
      sprite.lockedTo = null;   
      sprite.lockedReleaseSides = null
      this.objectInstance.setIgnoreGravity(objectClass.movement.ignoreGravity);
    }
  }

  unregister() {
    const sprite = this.objectInstance.sprite
    sprite.lockedTo = null
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

  getEffectedInstances({instanceSpriteA, instanceSpriteB, sidesA, sidesB, effect}) {
    const instanceSprites = []
    const alternateSpriteData = {}

    if(effect.effectTagA) {
      instanceSprites.push(instanceSpriteA)
      alternateSpriteData.sprite = instanceSpriteB
      alternateSpriteData.sides = sidesB
    }

    if(effect.effectTagB) {
      instanceSprites.push(instanceSpriteB)
      alternateSpriteData.sprite = instanceSpriteA
      alternateSpriteData.sides = sidesA
    }

    let remoteEffectedTagIds = effect.remoteEffectedTagIds.slice()
    if(effect.remoteEffectedTagIds2) {
      remoteEffectedTagIds.push(...effect.remoteEffectedTagIds2)
    }

    if(remoteEffectedTagIds && !nonRemoteEffects[effect.effectBehavior]) {
      remoteEffectedTagIds.forEach((tagId) => {
        this.scene.objectInstancesByTag[tagId]?.forEach((objectInstance) => {
          instanceSprites.push(objectInstance.sprite)
        })
      })
    }

    return [instanceSprites, alternateSpriteData]
  }
  
  runCollideActiveEffect({
    relation,
    instanceSpriteA,
    instanceSpriteB,
    sidesA = [],
    sidesB = []
  }) {
    const effect = relation.effect
    const scene = this.scene

    const [instanceSprites, alternateSpriteData] = this.getEffectedInstances({
      instanceSpriteA,
      instanceSpriteB,
      sidesA,
      sidesB,
      effect: relation.effect
    })

    instanceSprites.forEach((sprite) => {
      runEffect(sprite)
    })

    function runEffect(sprite) {
      const objectInstance = scene.getObjectInstance(sprite.instanceId)
      if(effect.effectBehavior === EFFECT_INVISIBLE && !objectInstance.effects.isVisibilityModified) {
        objectInstance.effects.isVisibilityModified = true
        objectInstance.isVisible = false
      }

      if(effect.effectBehavior === EFFECT_IGNORE_GRAVITY && !objectInstance.effects.isIgnoreGravityModified) {
        objectInstance.effects.isIgnoreGravityModified = true
        objectInstance.setIgnoreGravity(true)
      }

      if(effect.effectBehavior === EFFECT_STICK_TO) {
        if(!alternateSpriteData.sprite) console.error('bad!, stick to will not work here')
        sprite.lockedTo = alternateSpriteData.sprite;   
        sprite.lockedReleaseSides = alternateSpriteData.sides
        objectInstance.effects.isIgnoreGravityModified = true
        objectInstance.setIgnoreGravity(true)
      }
    }
  }

  runTargetlessAccuteEffect({relation, instanceSpriteA, instanceSpriteB}) {
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
      store.dispatch(editGameRoom(this.scene.gameRoom.id, {
        gameId: effect.gameId
      }))
    } else if(effect.effectBehavior === EFFECT_OPEN_OVERLAY) {
      const state = store.getState()
      store.dispatch(updateLobbyUser(state.auth.me?.id, {
        inConstellationView: true
      }))
    }

    // NARRATIVE
    if(effect.effectBehavior === EFFECT_CUTSCENE) {
      if(effect.cutsceneId) store.dispatch(openCutscene(instanceSpriteB.classId, effect.cutsceneId))
    }

    if(effect.effectBehavior === EFFECT_SPAWN) {
      const spawningClassId = effect.spawnClassId
      const modifiedClassData = { spawnX: null, spawnY: null, classId: spawningClassId }
      let zone 


    if(effect.spawnZoneSelectorType === SPAWN_ZONE_A_SELECT) {
        if(isZoneClassId(instanceSpriteA.classId)) {
          zone = instanceSpriteA
        } 
      } else if(effect.spawnZoneSelectorType === SPAWN_ZONE_B_SELECT) {
        if(isZoneClassId(instanceSpriteB.classId)) {
          zone = instanceSpriteB
        } 
      } else {
          //  if(effect.spawnZoneSelectorType === SPAWN_ZONE_RANDOM_SELECT) {
        zone = this.scene.getRandomInstanceOfClassId(effect.zoneClassId)
      // } else
      }

      if(!zone) return console.log('no zone exists for that')
      const gameModel = store.getState().gameModel.gameModel
      const objectClass = gameModel.classes[spawningClassId]
      const spawnedObjectInstance =  this.scene.addObjectInstance(SPAWNED_INSTANCE_ID_PREFIX+generateUniqueId(), modifiedClassData, true)
      spawnedObjectInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(objectClass))
    }
  }

  runAccuteEffect({
    relation,
    instanceSpriteA,
    instanceSpriteB,
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
          instanceSpriteA,
          instanceSpriteB,
          sidesA,
          sidesB
        })
      }, relation.effect.effectDelay)
      return
    }

    if(effectBehaviorInterface[effect.effectBehavior].effectableType === NO_TAG_EFFECT) {
      return this.runTargetlessAccuteEffect({
        relation,
        instanceSpriteA,
        instanceSpriteB,
      })
    }


    console.log(effect)

    const [instanceSprites] = this.getEffectedInstances({
      instanceSpriteA,
      instanceSpriteB,
      sidesA,
      sidesB,
      effect
    })

    instanceSprites.forEach((sprite) => {
      runEffect(sprite)
    })

    function runEffect(sprite) {
      if(effect.effectBehavior === EFFECT_STICK_TO) {
        sprite.body.setVelocityY(0)
        sprite.body.setVelocityX(0)
      }

      if(effect.effectBehavior === EFFECT_TELEPORT) {
        const gameModel = store.getState().gameModel.gameModel
        const objectClass = gameModel.classes[sprite.classId]
        const zone = scene.getRandomInstanceOfClassId(effect.zoneClassId)
        if(!zone) return
        sprite.setRandomPosition(...zone.getInnerCoordinateBoundaries(objectClass))
      }
      
      if(effect.effectBehavior === EFFECT_DESTROY) {
        const objectInstance = scene.getObjectInstance(sprite.instanceId)
        objectInstance.destroyAfterUpdate = true
      } else if(effect.effectBehavior === EFFECT_RECLASS) {
        const objectInstance = scene.getObjectInstance(sprite.instanceId)
        objectInstance.reclassId = effect.classId
      }
    }
  }
}