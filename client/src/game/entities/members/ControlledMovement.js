import store from "../../../store"
import { ADVANCED_DIRECTIONAL_CONTROLS, CAR_CONTROLS, DIRECTIONAL_CONTROLS, JUMP_AIR, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, JUMP_NONE, VEHICLE_CONTROLS } from "../../constants"

export class ControlledMovement {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene
    this.cursors = entityInstance.cursors
  }

  update(time, delta) {
    const entityClassId = this.entityInstance.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]
    const phaserInstance = this.entityInstance.phaserInstance

    const isJumpAllowed = !entityClass.movement.ignoreGravity && entityClass.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS

    const mod = (1/(delta * 5))
    const speed = entityClass.movement.speed * 100 * mod

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE/CAR
    // || entityClass.movement.movementControlsBehavior === CAR_CONTROLS
    if(entityClass.movement.movementControlsBehavior === VEHICLE_CONTROLS) {
      if(this.cursors.left.isDown) {
        this.entityInstance.setAngularVelocity(-entityClass.movement.speedAngular);
      } else if(this.cursors.right.isDown) {
        this.entityInstance.setAngularVelocity(entityClass.movement.speedAngular);
      }

      if(this.cursors.up.isDown) {
          this.entityInstance.thrust(speed * 4);
      } else {
        if(this.cursors.down.isDown && !entityClass.movement.disableDownKey) {
          this.entityInstance.thrust(-(speed * 4));
        } else {
          this.entityInstance.setAcceleration(0)
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // DIRECTIONAL
    if(entityClass.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.entityInstance.setVelocityX(-speed * 5)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.entityInstance.setVelocityX(speed * 5)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        this.entityInstance.setVelocityY(-speed * 5)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.entityInstance.setVelocityY(speed * 5)
        yTouched = true
      }

      if(!xTouched) this.entityInstance.setVelocityX(0)
      if(!yTouched) this.entityInstance.setVelocityY(0)
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // ADVANCED_DIRECTIONAL
    if(entityClass.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.entityInstance.setAccelerationX(-speed * 4)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.entityInstance.setAccelerationX(speed * 4)
        xTouched = true
      }
      
      if((entityClass.jump.jumpControlsBehavior === JUMP_NONE || !isJumpAllowed) && this.cursors.up.isDown) {
        this.entityInstance.setAccelerationY(-speed * 4)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.entityInstance.setAccelerationY(speed * 4)
        yTouched = true
      }

      if(!xTouched) this.entityInstance.setAccelerationX(0)
      if(!yTouched) this.entityInstance.setAccelerationY(0)
    }


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // JUMP
    if(isJumpAllowed) {
      if(entityClass.jump.jumpControlsBehavior === JUMP_GROUND) {
        if(this.cursors.up.isDown) {
          if(phaserInstance.body.touching.down || phaserInstance.body.blocked.down) {
            this.entityInstance.setVelocityY(-entityClass.jump.ground)
          }
        }
      }

      if(entityClass.jump.jumpControlsBehavior === JUMP_COMBO) {
        if(this.cursors.up.isDown) {
          if(this.cursors.up.isPressable) {
            this.cursors.up.isPressable = false
            if(phaserInstance.body.touching.down || phaserInstance.body.blocked.down) {
              this.entityInstance.setVelocityY(-entityClass.jump.ground * 5)
            } else if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
              this.entityInstance.setVelocityY(-entityClass.jump.air * 5)
              this.doubleJumpCoolDown = time + entityClass.jump.cooldown
            }
          }
        } else {
          this.cursors.up.isPressable = true
        }
      }

      if(entityClass.jump.jumpControlsBehavior === JUMP_AIR) {
        if(this.cursors.up.isDown) {
          if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
            this.entityInstance.setVelocityY(-entityClass.jump.air * 5)
            this.doubleJumpCoolDown = time + entityClass.jump.cooldown
          }
        }
      }

      if(entityClass.jump.jumpControlsBehavior === JUMP_CONSTANT) {
        if(this.cursors.up.isDown) {
            this.entityInstance.thrust(entityClass.jump.ground * 4);
        } else {
          // if(this.cursors.down.isDown && !entityClass.jump.disableDownKey) {
          //   this.entityInstance.thrust(-(entityClass.jump.ground * 4));
          // } else {
          //   this.entityInstance.setAccelerationY(0)
          // }
        }
      }
    }

    // if(entityClass.movement.rotationFollowKeys) {
    //   if(this.cursors.left.isDown) {
    //     this.entityInstance.setAngle(270)
    //   } else if(this.cursors.right.isDown) {
    //     this.entityInstance.setAngle(90)
    //   } else if(this.cursors.up.isDown) {
    //     this.entityInstance.setAngle(0)
    //   } else if(this.cursors.down.isDown) {
    //     this.entityInstance.setAngle(180)
    //   }
    // }
  }
}