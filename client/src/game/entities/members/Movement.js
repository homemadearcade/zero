import store from "../../../store"
import { MOVEMENT_FOLLOW_PLAYER, MOVEMENT_TURN_ON_COLLIDE, MOVEMENT_TURN_RANDOMLY } from "../../constants"

export class Movement {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene

    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.objectInstance.classId]

    this.objectInstance.setAngularDrag(objectClass.movement.dragAngular)
    this.objectInstance.setDamping(true)
    this.objectInstance.setDragX(objectClass.movement.dragX)
    this.objectInstance.setDragY(objectClass.movement.dragY)
    this.objectInstance.setGravityX(objectClass.movement.gravityX)
    this.objectInstance.setGravityY(objectClass.movement.gravityY)
    this.objectInstance.setIgnoreGravity(objectClass.movement.ignoreGravity)
    this.objectInstance.setVelocity(objectClass.movement.velocityX, objectClass.movement.velocityY)
  }

  resetPhysics() {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[this.objectInstance.classId]
    this.objectInstance.setAcceleration(0,0)
    this.objectInstance.setVelocity(objectClass.movement.velocityX, objectClass.movement.velocityY)
    this.objectInstance.setRotation(0)
  }

  update(time, delta) {
    const objectClass = store.getState().gameModel.gameModel.classes[this.objectInstance.classId]
    const pattern = objectClass.movement.pattern 
    const sprite = this.objectInstance.sprite

    if(pattern === MOVEMENT_TURN_ON_COLLIDE) {
      if(sprite.body.blocked.none === false || sprite.justCollided) {
        const speed = objectClass.movement.speed
        const check = Math.random()
    
        if(check < 0.25) {
          this.objectInstance.setVelocity(speed, 0)
        } else if(check < 0.5) {
          this.objectInstance.setVelocity(0, speed)
        } else if(check < 0.75) {
          this.objectInstance.setVelocity(-speed, 0)
        } else {
          this.objectInstance.setVelocity(0, -speed)
        }      
      }
    }

    if(pattern === MOVEMENT_TURN_RANDOMLY) {
      const speed = objectClass.movement.speed

      const check1 = Math.random()

      if(check1 < .01) {
        const check2 = Math.random()
        
        if(check2 < 0.25) {
          this.objectInstance.setVelocity(speed, 0)
        } else if(check2 < 0.5) {
          this.objectInstance.setVelocity(0, speed)
        } else if(check2 < 0.75) {
          this.objectInstance.setVelocity(-speed, 0)
        } else {
          this.objectInstance.setVelocity(0, -speed)
        }  
      }
    }

    if(pattern === MOVEMENT_FOLLOW_PLAYER) {
      const speed = objectClass.movement.speed
      const player = this.scene.playerInstance.sprite
      
      if(Math.abs(sprite.x - player.x) < (speed/2)) {

      } else if(sprite.x > player.x) {
        this.objectInstance.setVelocityX(-speed)
      } else {
        this.objectInstance.setVelocityX(speed)
      }

      if(Math.abs(sprite.y - player.y) < (speed/2)) {

      } else if(sprite.y > player.y) {
        this.objectInstance.setVelocityY(-speed)
      } else {
        this.objectInstance.setVelocityY(speed)
      }
    }

    sprite.justCollided = false
  }
}