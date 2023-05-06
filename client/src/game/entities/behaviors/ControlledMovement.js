import store from "../../../store"
import { getCobrowsingState, snapFreeXY, snapObjectXY } from "../../../utils"
import { ADVANCED_DIRECTIONAL_CONTROLS, CAR_CONTROLS, DIRECTIONAL_CONTROLS, JUMP_AIR, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, JUMP_NONE, VEHICLE_CONTROLS } from "../../constants"

export class ControlledMovement {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene
    this.cursors = entityInstance.cursors
  }

  update(time, delta) {
    const entityModelId = this.entityInstance.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    const phaserInstance = this.entityInstance.phaserInstance

    const isJumpAllowed = !entityModel.movement.ignoreGravity && entityModel.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS

    const mod = (1/(delta * 5))
    const speed = entityModel.movement.speed * 100 * mod

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    const playerEntityModelId = store.getState().playerInterface.playerEntityModelId
    if(isGridViewOn) {
      if(playerEntityModelId === entityModelId) {
        console.log('dooin this')
        const editorCamera = this.scene.editorCamera 
        const x = editorCamera.midPoint.x
        const y = editorCamera.midPoint.y
        const { boundaryX, boundaryY } = snapObjectXY({x, y, entityModel})
        this.entityInstance.setPosition(boundaryX, boundaryY)
        return
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE/CAR
    // || entityModel.movement.movementControlsBehavior === CAR_CONTROLS
    if(entityModel.movement.movementControlsBehavior === VEHICLE_CONTROLS) {
      if(this.cursors.left.isDown) {
        this.entityInstance.setAngularVelocity(-entityModel.movement.speedAngular);
      } else if(this.cursors.right.isDown) {
        this.entityInstance.setAngularVelocity(entityModel.movement.speedAngular);
      }

      if(this.cursors.up.isDown) {
          this.entityInstance.thrust(speed * 4);
      } else {
        if(this.cursors.down.isDown && !entityModel.movement.disableDownKey) {
          this.entityInstance.thrust(-(speed * 4));
        } else {
          this.entityInstance.setAcceleration(0)
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // DIRECTIONAL
    if(entityModel.movement.movementControlsBehavior === DIRECTIONAL_CONTROLS) {
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
    if(entityModel.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS) {
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
      
      if((entityModel.jump.jumpControlsBehavior === JUMP_NONE || !isJumpAllowed) && this.cursors.up.isDown) {
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
      if(entityModel.jump.jumpControlsBehavior === JUMP_GROUND) {
        if(this.cursors.up.isDown) {
          if(phaserInstance.body.blocked.down) {
            this.entityInstance.setVelocityY(-entityModel.jump.ground)
          }
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_COMBO) {
        if(this.cursors.up.isDown) {
          if(this.cursors.up.isPressable) {
            this.cursors.up.isPressable = false
            if(phaserInstance.body.blocked.down) {
              this.entityInstance.setVelocityY(-entityModel.jump.ground * 5)
            } else if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
              this.entityInstance.setVelocityY(-entityModel.jump.air * 5)
              this.doubleJumpCoolDown = time + entityModel.jump.cooldown
            }
          }
        } else {
          this.cursors.up.isPressable = true
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_AIR) {
        if(this.cursors.up.isDown) {
          if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
            this.entityInstance.setVelocityY(-entityModel.jump.air * 5)
            this.doubleJumpCoolDown = time + entityModel.jump.cooldown
          }
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_CONSTANT) {
        if(this.cursors.up.isDown) {
            this.entityInstance.thrust(entityModel.jump.ground * 4);
        } else {
          // if(this.cursors.down.isDown && !entityModel.jump.disableDownKey) {
          //   this.entityInstance.thrust(-(entityModel.jump.ground * 4));
          // } else {
          //   this.entityInstance.setAccelerationY(0)
          // }
        }
      }
    }

    // if(entityModel.movement.rotationFollowKeys) {
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