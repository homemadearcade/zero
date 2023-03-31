import store from "../../../store"
import { isPlayerId } from "../../../utils/gameUtils"
import { MOVEMENT_FOLLOW_RELATION_TAG, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_TURN_RANDOMLY, MOVEMENT_MIRROR_PLAYER } from "../../constants"

export class Movement {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]

    this.entityInstance.setAngularDrag(entityModel.movement.dragAngular)
    this.entityInstance.setDamping(true)
    this.entityInstance.setDragX(entityModel.movement.dragX)
    this.entityInstance.setDragY(entityModel.movement.dragY)
    this.entityInstance.setGravityX(entityModel.movement.gravityX)
    this.entityInstance.setGravityY(entityModel.movement.gravityY)
    this.entityInstance.setIgnoreGravity(entityModel.movement.ignoreGravity)
    this.entityInstance.setVelocity(entityModel.movement.velocityX, entityModel.movement.velocityY)
  }

  resetPhysics() {
    const gameModel = store.getState().gameModel.gameModel
    const entityModel = gameModel.entityModels[this.entityInstance.entityModelId]
    this.entityInstance.setAcceleration(0,0)
    this.entityInstance.setVelocity(entityModel.movement.velocityX, entityModel.movement.velocityY)
    this.entityInstance.setRotation(0)
  }

  update(time, delta) {
    const entityModel = store.getState().gameModel.gameModel.entityModels[this.entityInstance.entityModelId]
    const movementBehavior = entityModel.movement.movementBehavior 
    const phaserInstance = this.entityInstance.phaserInstance

    if(movementBehavior === MOVEMENT_TURN_ON_COLLIDE) {
      if(phaserInstance.body.blocked.none === false || phaserInstance.justCollided) {
        const speed = entityModel.movement.speed
        const check = Math.random()
    
        if(check < 0.25) {
          this.entityInstance.setVelocity(speed, 0)
        } else if(check < 0.5) {
          this.entityInstance.setVelocity(0, speed)
        } else if(check < 0.75) {
          this.entityInstance.setVelocity(-speed, 0)
        } else {
          this.entityInstance.setVelocity(0, -speed)
        }      
      }
    }

    if(movementBehavior === MOVEMENT_TURN_RANDOMLY) {
      const speed = entityModel.movement.speed

      const check1 = Math.random()

      if(check1 < .01) {
        const check2 = Math.random()
        
        if(check2 < 0.25) {
          this.entityInstance.setVelocity(speed, 0)
        } else if(check2 < 0.5) {
          this.entityInstance.setVelocity(0, speed)
        } else if(check2 < 0.75) {
          this.entityInstance.setVelocity(-speed, 0)
        } else {
          this.entityInstance.setVelocity(0, -speed)
        }  
      }
    }
    
    if(!this.mirroringInstance || (movementBehavior === MOVEMENT_MIRROR_PLAYER)) {
      if(movementBehavior === MOVEMENT_MIRROR_PLAYER) {
        this.mirroringInstance = this.scene.playerInstance
      } else {
        this.mirroringInstance = null
      }
    }

    if(!this.followingInstance || this.followingInstance.destroyed || ( movementBehavior === MOVEMENT_FOLLOW_RELATION_TAG && this.followingInstance.entityModelId !== entityModel.movement.relationTagId ) || (movementBehavior === MOVEMENT_FOLLOW_PLAYER && !isPlayerId(this.followingInstance.entityInstanceId) ) ) {
      if(movementBehavior === MOVEMENT_FOLLOW_PLAYER) {
        this.followingInstance = this.scene.playerInstance
      } else if(movementBehavior === MOVEMENT_FOLLOW_RELATION_TAG && entityModel.movement.relationTagId) {
        const instances = this.scene.entityInstancesByTag[entityModel.movement.relationTagId]
        if(instances.length) this.followingInstance = instances[0]
      } else {
        this.followingInstance = null
      }
    }

    if(this.mirroringInstance) {
      const mirroringPhaserInstance = this.mirroringInstance.phaserInstance
      phaserInstance.x = mirroringPhaserInstance.x 
      phaserInstance.y = mirroringPhaserInstance.y
    }

    if(this.followingInstance) {
      const speed = entityModel.movement.speed
      const followingPhaserInstance = this.followingInstance.phaserInstance
      if(Math.abs(phaserInstance.x - followingPhaserInstance.x) < (speed/4) + 10) {

      } else if(phaserInstance.x > followingPhaserInstance.x) {
        this.entityInstance.setVelocityX(-speed)
      } else {
        this.entityInstance.setVelocityX(speed)
      }

      if(Math.abs(phaserInstance.y - followingPhaserInstance.y) < (speed/4) + 10) {

      } else if(phaserInstance.y > followingPhaserInstance.y) {
        this.entityInstance.setVelocityY(-speed)
      } else {
        this.entityInstance.setVelocityY(speed)
      }
    }

    phaserInstance.justCollided = false
  }
}