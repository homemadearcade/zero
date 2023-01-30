import store from "../../../store"
import { EFFECT_CAMERA_SHAKE, EFFECT_CUTSCENE, EFFECT_DESTROY, EFFECT_GAME_OVER, EFFECT_IGNORE_GRAVITY, EFFECT_INVISIBLE, EFFECT_RECLASS, EFFECT_SPAWN, EFFECT_STICK_TO, EFFECT_SWITCH_STAGE, EFFECT_TELEPORT, EFFECT_WIN_GAME, GAME_OVER_STATE, PLAYER_INSTANCE_ID_PREFIX, SIDE_DOWN, SIDE_LEFT, SIDE_RIGHT, SIDE_UP, SPAWNED_INSTANCE_ID_PREFIX, WIN_GAME_STATE } from "../../constants"
import Phaser from "phaser";
import { changeGameState, clearCutscenes, openCutscene } from "../../../store/actions/gameContextActions";
import { ANIMATION_CAMERA_SHAKE } from "../../../store/types";
import { generateUniqueId } from "../../../utils/webPageUtils";
import { nonRemoteEffects } from "../../defaultData/relationship";
import { isZoneClassId } from "../../../utils/gameUtils";
import { changeCurrentStage } from "../../../store/actions/gameModelActions";
import _ from "lodash";

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
  
  runPersistentEffect(relation, instanceSpriteB, sides) {
    const effect = relation.effect
    const sprite = this.objectInstance.sprite

    // spawning does not effect existing instances
    if(effect.remoteEffectedClassId && !nonRemoteEffects[effect.type]) {
      this.scene.forAllObjectInstancesMatchingClassId(effect.remoteEffectedClassId, (object) => {
        object.effects.runPersistentEffect({...relation, effect: {...effect, remoteEffectedClassId: null}}, instanceSpriteB, sides)
      })
      return
    }

    if(effect.type === EFFECT_INVISIBLE && !this.isVisibilityModified) {
      this.isVisibilityModified = true
      this.objectInstance.isVisible = false
    }

    if(effect.type === EFFECT_IGNORE_GRAVITY && !this.isIgnoreGravityModified) {
      this.isIgnoreGravityModified = true
      this.objectInstance.setIgnoreGravity(true)
    }

    if(effect.type === EFFECT_STICK_TO) {
      sprite.lockedTo = instanceSpriteB;   
      sprite.lockedReleaseSides = sides
      this.isIgnoreGravityModified = true
      this.objectInstance.setIgnoreGravity(true)
    }
  }

  runAccuteEffect(relation, instanceSpriteB, sides = []) {
    const effect = relation.effect
    const sprite = this.objectInstance.sprite
    const instanceId = this.objectInstance.id
    const classId = this.objectInstance.classId

    // spawning does not effect existing instances so it cannot run here
    if(effect.remoteEffectedClassId && !nonRemoteEffects[effect.type]) {
      this.scene.forAllObjectInstancesMatchingClassId(effect.remoteEffectedClassId, (object) => {
        object.effects.runAccuteEffect({...relation, effect: {...effect, remoteEffectedClassId: null}}, instanceSpriteB, sides)
      })
      return
    }

    if(this.timeToTriggerAgain[relation.relationId]) {
      if(this.timeToTriggerAgain[relation.relationId] > Date.now()) {
        return
      }
    }

    if(relation.onlyOnce) {
      this.timeToTriggerAgain[relation.relationId] = Date.now() + 10000000000000
    } else {
      if(relation.delayInterval) {
        this.timeToTriggerAgain[relation.relationId] = Date.now() + relation.delayInterval
      }
    }

    if(relation.effect.delayEffect) {
      setTimeout(() => {
        const delayedRelation = _.cloneDeep(relation)
        delayedRelation.effect.delayEffect = null
        this.runAccuteEffect(delayedRelation, instanceSpriteB, sides)
      }, relation.effect.delayEffect)
      return
    }
    
    if(effect.type === EFFECT_STICK_TO) {
      sprite.body.setVelocityY(0)
      sprite.body.setVelocityX(0)
    }

    if(effect.type === EFFECT_CAMERA_SHAKE) {
      this.scene.callAnimation({
        type: ANIMATION_CAMERA_SHAKE,
        data: {
          intensity: 400,
        }
      })
    }

    if(effect.type === EFFECT_WIN_GAME) {
      store.dispatch(changeGameState(WIN_GAME_STATE, effect.text))
      this.scene.sendReloadGameEvent()
    } else if(effect.type === EFFECT_GAME_OVER) {
      store.dispatch(changeGameState(GAME_OVER_STATE, effect.text))
      this.scene.sendReloadGameEvent()
    } else if(effect.type === EFFECT_SWITCH_STAGE) {
      store.dispatch(changeCurrentStage(effect.stageId))
      store.dispatch(clearCutscenes())
    }

    if(effect.type === EFFECT_TELEPORT) {
      const gameModel = store.getState().gameModel.gameModel
      const objectClass = gameModel.classes[classId]
      const zone = this.scene.getRandomInstanceOfClassId(effect.zoneClassId)
      if(!zone) return
      this.objectInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(objectClass))
    }
    
    if(effect.type === EFFECT_DESTROY) {
      this.objectInstance.destroyAfterUpdate = true
    } else if(effect.type === EFFECT_SPAWN) {
      const spawningClassId = effect.spawnClassId ? effect.spawnClassId : classId
      const modifiedClassData = { spawnX: sprite.x, spawnY: sprite.y, classId: spawningClassId }
      const spawnedObjectInstance =  this.scene.addObjectInstance(SPAWNED_INSTANCE_ID_PREFIX+generateUniqueId(), modifiedClassData, true)
      
      let zone 
      if(effect.pickRandomZone) {
        zone = this.scene.getRandomInstanceOfClassId(effect.zoneClassId)
      } else {
        if(isZoneClassId(this.objectInstance.classId)) {
          zone = this.objectInstance
        } else {
          zone = this.scene.getObjectInstance(instanceSpriteB.id)
        }
      }
      if(!zone) return console.log('no zone exists for that')
      
      const gameModel = store.getState().gameModel.gameModel
      const objectClass = gameModel.classes[spawningClassId]
      spawnedObjectInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(objectClass))
    } else if(effect.type === EFFECT_RECLASS) {
      if(this.objectInstance.id === PLAYER_INSTANCE_ID_PREFIX) {
        this.objectInstance.reclassId = effect.classId
      } else {
        this.objectInstance.reclassId = effect.classId
      }
    }

    // NARRATIVE
    if(effect.type === EFFECT_CUTSCENE) {
      if(effect.cutsceneId) store.dispatch(openCutscene(instanceSpriteB?.classId, effect.cutsceneId))
    }
  }
}