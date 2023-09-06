import store from "../../../store"
import { getCobrowsingState, snapFreeXY, snapObjectXY } from "../../../utils"
import { ADVANCED_DIRECTIONAL_CONTROLS, CAR_CONTROLS, DIRECTIONAL_CONTROLS, JUMP_AIR, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, JUMP_NONE, VEHICLE_CONTROLS } from "../../constants"

export class ControlledMovement {
  constructor(scene, entityInstance){
    this.entityInstance = entityInstance
    this.scene = scene
    this.cursors = entityInstance.cursors
  }

  update(time, delta, jumpKey) {
    const entityModelId = this.entityInstance.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    const matterSprite = this.entityInstance.matterSprite

    const isJumpAllowed = !entityModel.movement.ignoreGravity && entityModel.movement.movementControlsBehavior === ADVANCED_DIRECTIONAL_CONTROLS

    const gamePad = this.entityInstance.gamePad
    let downPressed = this.cursors.down.isDown
    let upPressed = this.cursors.up.isDown
    let leftPressed = this.cursors.left.isDown
    let rightPressed = this.cursors.right.isDown
    let jumpPressed = jumpKey.isDown

    if(gamePad) {
      leftPressed = leftPressed || gamePad.leftStick.x === -1
      rightPressed = rightPressed || gamePad.leftStick.x === 1
      upPressed = upPressed || gamePad.leftStick.y === -1
      downPressed = downPressed || gamePad.leftStick.y === 1
    }

    const mod = (1/(delta * 5))
    const speed = entityModel.movement.speed * 100 * mod

    const isGridViewOn = getCobrowsingState().gameViewEditor.isGridViewOn
    const playerEntityModelId = store.getState().playerInterface.playerEntityModelId
    if(isGridViewOn && !this.scene.editorCameraControls) {
      const speed = 500 * mod 
      if(playerEntityModelId === entityModelId) {
        if(leftPressed) {
          this.entityInstance.setPosition(matterSprite.x - speed, matterSprite.y)
        } else if(rightPressed) {
          this.entityInstance.setPosition(matterSprite.x + speed, matterSprite.y)
        } else {
          this.entityInstance.setVelocityX(0)
          // matterSprite.setX(matterSprite.body.prev.x)
        }
        
        if(upPressed) {
          this.entityInstance.setPosition(matterSprite.x, matterSprite.y - speed)
        } else if(downPressed) {
          this.entityInstance.setPosition(matterSprite.x, matterSprite.y + speed)
        } else {
          this.entityInstance.setVelocityY(0)
          // matterSprite.setY(matterSprite.body.prev.y)
        }

        // const editorCamera = this.scene.editorCamera 
        // const x = editorCamera.midPoint.x
        // const y = editorCamera.midPoint.y
        // const { boundaryX, boundaryY } = snapObjectXY({x, y, entityModel})
        // this.entityInstance.setPosition(boundaryX, boundaryY)
        return
      }
    }

    if(this.scene.isPaused) return

    if(matterSprite.upKeyClimbOverride) {
      if(upPressed) {
        // a bit of a hack...
        this.entityInstance.setPosition(matterSprite.x, matterSprite.y - (700 * mod))
        upPressed = false
      } else if(downPressed) {
        this.entityInstance.setPosition(matterSprite.x, matterSprite.y + (500 * mod))
        downPressed = false
      }
    }


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE/CAR
    // || entityModel.movement.movementControlsBehavior === CAR_CONTROLS
    if(entityModel.movement.movementControlsBehavior === VEHICLE_CONTROLS) {
      if(leftPressed) {
        this.entityInstance.setAngularVelocity(-entityModel.movement.speedAngular);
      } else if(rightPressed) {
        this.entityInstance.setAngularVelocity(entityModel.movement.speedAngular);
      }

      if(jumpPressed || upPressed) {
          this.entityInstance.thrust(speed * 4);
      } else {
        if(downPressed && !entityModel.movement.disableDownKey) {
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

      if(leftPressed) {
        this.entityInstance.setVelocityX(-speed * 5)
        xTouched = true
      }
      
      if(rightPressed) {
        this.entityInstance.setVelocityX(speed * 5)
        xTouched = true
      }
      
      if(upPressed) {
        this.entityInstance.setVelocityY(-speed * 5)
        yTouched = true
      }

      if(downPressed) {
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

      if(leftPressed) {
        this.entityInstance.setAccelerationX(-speed * 4)
        xTouched = true
      }
      
      if(rightPressed) {
        this.entityInstance.setAccelerationX(speed * 4)
        xTouched = true
      }
      
      if((entityModel.jump.jumpControlsBehavior === JUMP_NONE || !isJumpAllowed) && upPressed) {
        this.entityInstance.setAccelerationY(-speed * 4)
        yTouched = true
      }

      if(downPressed) {
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
        if(jumpPressed) {
          if(matterSprite.body.blocked.down) {
            this.entityInstance.setVelocityY(-entityModel.jump.ground)
          }
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_COMBO) {
        if(jumpPressed) {
          if(jumpKey.isPressable) {
            jumpKey.isPressable = false
            if(matterSprite.body.blocked.down) {
              this.entityInstance.setVelocityY(-entityModel.jump.ground * 5)
            } else if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
              this.entityInstance.setVelocityY(-entityModel.jump.air * 5)
              this.doubleJumpCoolDown = time + entityModel.jump.cooldown
            }
          }
        } else {
          jumpKey.isPressable = true
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_AIR) {
        if(jumpPressed) {
          if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
            this.entityInstance.setVelocityY(-entityModel.jump.air * 5)
            this.doubleJumpCoolDown = time + entityModel.jump.cooldown
          }
        }
      }

      if(entityModel.jump.jumpControlsBehavior === JUMP_CONSTANT) {
        if(jumpPressed) {
            this.entityInstance.thrust(entityModel.jump.ground * 4);
        } else {
          // if(downPressed && !entityModel.jump.disableDownKey) {
          //   this.entityInstance.thrust(-(entityModel.jump.ground * 4));
          // } else {
          //   this.entityInstance.setAccelerationY(0)
          // }
        }
      }
    }

    // if(entityModel.movement.rotationFollowKeys) {
    //   if(leftPressed) {
    //     this.entityInstance.setAngle(270)
    //   } else if(rightPressed) {
    //     this.entityInstance.setAngle(90)
    //   } else if(upPressed) {
    //     this.entityInstance.setAngle(0)
    //   } else if(downPressed) {
    //     this.entityInstance.setAngle(180)
    //   }
    // }
  }
}