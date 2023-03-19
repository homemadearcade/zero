import store from "../../../store"
import { ADVANCED_DIRECTIONAL_CONTROLS, CAR_CONTROLS, DIRECTIONAL_CONTROLS, JUMP_AIR, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, JUMP_NONE, VEHICLE_CONTROLS } from "../../constants"

export class ControlledMovement {
  constructor(scene, objectInstance){
    this.objectInstance = objectInstance
    this.scene = scene
    this.cursors = objectInstance.cursors
  }

  update(time, delta) {
    const classId = this.objectInstance.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    const sprite = this.objectInstance.sprite

    const isJumpAllowed = !objectClass.movement.ignoreGravity && objectClass.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS

    const mod = (1/(delta * 5))
    const speed = objectClass.movement.speed * 100 * mod

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE/CAR
    // || objectClass.movement.movementControlsBehavior === CAR_CONTROLS
    if(objectClass.movement.movementControlsBehavior === VEHICLE_CONTROLS) {
      if(this.cursors.left.isDown) {
        this.objectInstance.setAngularVelocity(-objectClass.movement.speedAngular);
      } else if(this.cursors.right.isDown) {
        this.objectInstance.setAngularVelocity(objectClass.movement.speedAngular);
      }

      if(this.cursors.up.isDown) {
          this.objectInstance.thrust(speed * 4);
      } else {
        if(this.cursors.down.isDown && !objectClass.movement.disableDownKey) {
          this.objectInstance.thrust(-(speed * 4));
        } else {
          this.objectInstance.setAcceleration(0)
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // DIRECTIONAL
    if(objectClass.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.objectInstance.setVelocityX(-speed * 5)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.objectInstance.setVelocityX(speed * 5)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        this.objectInstance.setVelocityY(-speed * 5)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.objectInstance.setVelocityY(speed * 5)
        yTouched = true
      }

      if(!xTouched) this.objectInstance.setVelocityX(0)
      if(!yTouched) this.objectInstance.setVelocityY(0)
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // ADVANCED_DIRECTIONAL
    if(objectClass.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.objectInstance.setAccelerationX(-speed * 4)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.objectInstance.setAccelerationX(speed * 4)
        xTouched = true
      }
      
      if((objectClass.jump.jumpBehavior === JUMP_NONE || !isJumpAllowed) && this.cursors.up.isDown) {
        this.objectInstance.setAccelerationY(-speed * 4)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.objectInstance.setAccelerationY(speed * 4)
        yTouched = true
      }

      if(!xTouched) this.objectInstance.setAccelerationX(0)
      if(!yTouched) this.objectInstance.setAccelerationY(0)
    }


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // JUMP
    if(isJumpAllowed) {
      if(objectClass.jump.jumpBehavior === JUMP_GROUND) {
        if(this.cursors.up.isDown) {
          if(sprite.body.touching.down || sprite.body.blocked.down) {
            this.objectInstance.setVelocityY(-objectClass.jump.ground)
          }
        }
      }

      if(objectClass.jump.jumpBehavior === JUMP_COMBO) {
        if(this.cursors.up.isDown) {
          if(this.cursors.up.isPressable) {
            this.cursors.up.isPressable = false
            if(sprite.body.touching.down || sprite.body.blocked.down) {
              this.objectInstance.setVelocityY(-objectClass.jump.ground * 5)
            } else if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
              this.objectInstance.setVelocityY(-objectClass.jump.air * 5)
              this.doubleJumpCoolDown = time + objectClass.jump.cooldown
            }
          }
        } else {
          this.cursors.up.isPressable = true
        }
      }

      if(objectClass.jump.jumpBehavior === JUMP_AIR) {
        if(this.cursors.up.isDown) {
          if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
            this.objectInstance.setVelocityY(-objectClass.jump.air * 5)
            this.doubleJumpCoolDown = time + objectClass.jump.cooldown
          }
        }
      }

      if(objectClass.jump.jumpBehavior === JUMP_CONSTANT) {
        if(this.cursors.up.isDown) {
            this.objectInstance.thrust(objectClass.jump.ground * 4);
        } else {
          // if(this.cursors.down.isDown && !objectClass.jump.disableDownKey) {
          //   this.objectInstance.thrust(-(objectClass.jump.ground * 4));
          // } else {
          //   this.objectInstance.setAccelerationY(0)
          // }
        }
      }
    }

    // if(objectClass.movement.rotationFollowKeys) {
    //   if(this.cursors.left.isDown) {
    //     this.objectInstance.setAngle(270)
    //   } else if(this.cursors.right.isDown) {
    //     this.objectInstance.setAngle(90)
    //   } else if(this.cursors.up.isDown) {
    //     this.objectInstance.setAngle(0)
    //   } else if(this.cursors.down.isDown) {
    //     this.objectInstance.setAngle(180)
    //   }
    // }
  }
}