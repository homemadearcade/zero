import store from "../../../store"
import { getCobrowsingState } from "../../../utils"
import { isPlayerId } from "../../../utils/gameUtils"
import { MOVEMENT_FOLLOW_RELATION_TAG, MOVEMENT_FOLLOW_PLAYER, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_TURN_RANDOMLY, MOVEMENT_MIRROR_PLAYER, MOVEMENT_SIDE_TO_SIDE, MOVEMENT_UP_AND_DOWN, MOVEMENT_JUMP } from "../../constants"

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
    const matterSprite = this.entityInstance.matterSprite

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    if(isGridViewOn && this.entityInstance.isPlayerInstance) {
      this.entityInstance.setIgnoreGravity(true)
    } else if(matterSprite.ignoreGravityOverride) {
      this.entityInstance.setIgnoreGravity(true)
    } else {
      this.entityInstance.setIgnoreGravity(entityModel.movement.ignoreGravity)
    }

    if(movementBehavior === MOVEMENT_TURN_ON_COLLIDE) {
      if(matterSprite.body.blocked.none === false || matterSprite.justCollided) {
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

    if(!this.followingInstance || this.followingInstance.destroyed || ( movementBehavior === MOVEMENT_FOLLOW_RELATION_TAG && this.followingInstance.entityModelId !== entityModel.movement.relationTagId ) || (movementBehavior === MOVEMENT_FOLLOW_PLAYER && !this.followingInstance.isPlayerInstance ) ) {
      if(movementBehavior === MOVEMENT_FOLLOW_PLAYER) {
        this.followingInstance = this.scene.playerInstance
      } else if(movementBehavior === MOVEMENT_FOLLOW_RELATION_TAG && entityModel.movement.relationTagId) {
        const instances = this.scene.entityInstancesByTag[entityModel.movement.relationTagId]
        if(instances.length) this.followingInstance = instances[0]
      } else {
        this.followingInstance = null
      }
    }


    if(movementBehavior === MOVEMENT_SIDE_TO_SIDE && matterSprite.body.velocity.x === 0) {
      if(matterSprite.body.blocked.right) {
        matterSprite.setVelocityX(-entityModel.movement.velocityX)
      } else if(matterSprite.body.blocked.left || matterSprite.body.blocked.none) {
        matterSprite.setVelocityX(entityModel.movement.velocityX)
      }
    }

    if(movementBehavior === MOVEMENT_UP_AND_DOWN && matterSprite.body.velocity.y === 0) {
      if(matterSprite.body.blocked.down) {
        matterSprite.setVelocityY(-entityModel.movement.velocityY)
      } else if(matterSprite.body.blocked.up || matterSprite.body.blocked.none) {
        matterSprite.setVelocityY(entityModel.movement.velocityY)
      }
    }

    // if(movementBehavior === MOVEMENT_JUMP) {
    //   console.log('jumping', matterSprite.body.blocked.down, matterSprite.body.velocity.y)
    // }
    // if(movementBehavior === MOVEMENT_JUMP && matterSprite.body.blocked.down && matterSprite.body.velocity.y === 0) {
    //   console.log('setting jump velocity', entityModel.movement.velocityY)
    //   matterSprite.setVelocityY(entityModel.movement.velocityY)
    // }

    if(this.mirroringInstance) {
      const mirroringmatterSprite = this.mirroringInstance.matterSprite
      matterSprite.x = mirroringmatterSprite.x 
      matterSprite.y = mirroringmatterSprite.y
    }

    if(this.followingInstance) {
      const speed = entityModel.movement.speed
      const followingmatterSprite = this.followingInstance.matterSprite
      if(Math.abs(matterSprite.x - followingmatterSprite.x) < (speed/4) + 10) {

      } else if(matterSprite.x > followingmatterSprite.x) {
        this.entityInstance.setVelocityX(-speed)
      } else {
        this.entityInstance.setVelocityX(speed)
      }

      if(Math.abs(matterSprite.y - followingmatterSprite.y) < (speed/4) + 10) {

      } else if(matterSprite.y > followingmatterSprite.y) {
        this.entityInstance.setVelocityY(-speed)
      } else {
        this.entityInstance.setVelocityY(speed)
      }
    }

    matterSprite.justCollided = false
  }
}