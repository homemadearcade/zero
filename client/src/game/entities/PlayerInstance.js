import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./CameraPreview";
import { ProjectileInstance } from "./ProjectileInstance";
import { InteractArea } from "./members/InteractArea";
import { WALKER_CONTROLS, CAR_CONTROLS, JUMP_COMBO, JUMP_CONSTANT, JUMP_GROUND, VEHICLE_CONTROLS, JUMP_AIR, RUNNER_CONTROLS, JUMP_NONE } from "../constants";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    // this.particles = scene.add.particles('blue');

    // this.emitter = this.particles.createEmitter({
    //   speed: {
    //     onEmit: (particle, key, t, value) =>
    //     {
    //       return this.sprite.body.speed/10;
    //     }
    //   },
    //   lifespan: {
    //     onEmit: (particle, key, t, value) =>
    //     {
    //       return Phaser.Math.Percent(this.sprite.body.speed/50, 0, 300) * 40000;
    //     }
    //   },
    //   alpha: {
    //     onEmit: (particle, key, t, value) =>
    //     {
    //       return Phaser.Math.Percent(this.sprite.body.speed/50, 0, 300) * 1000;
    //     }
    //   },
    //   scale: { start: 1.0, end: 0 },
    //   blendMode: 'ADD'
    // });

    // this.emitter.startFollow(this.sprite);

    this.scene = scene
    scene.playerInstanceGroup.add(this.sprite)

    this.cursors = scene.input.keyboard.createCursorKeys();

    const { classId } = instanceData
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no hero class for id:' + classId)
    }

    if(objectClass.camera) {
      this.cameraPreview = new CameraPreview(this.scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
      this.cameraPreview.setVisible(false)
    }

    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', size: objectClass.graphics.width * 3 })

    this.setAngularDrag(100)

    return this
  }

  setZoom(zoom) {
    this.cameraPreview.setZoom(zoom)
  }

  update(time, delta) {  
    super.update()

    if(this.scene.isPaused) return

    const classId = this.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth

    const cameraSize = gameMaxWidth/objectClass.camera.zoom

    this.cameraPreview.update({x: this.sprite.x - cameraSize/2, y: this.sprite.y - cameraSize/2}, true)
    this.interactArea.update({x: this.sprite.x, y: this.sprite.y, angle: this.sprite.angle})

    this.updateControls(time, delta)
  }

  updateControls(time, delta) {
    const classId = this.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    const isJumpAllowed = !objectClass.movement.ignoreGravity && objectClass.movement.controls === RUNNER_CONTROLS

    const mod = (1/(delta * 5))
    const speed = objectClass.movement.speed * 100 * mod

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PROJECTILE
    if(this.cursors.space.isDown && objectClass.projectile?.classId) {
      if(time < this.nextFire) { 
        return
      }

      const projectile = new ProjectileInstance(this.scene, 'hero-'+Math.random(), { classId: objectClass.projectile?.classId } )
      projectile.fire(this, time, this.cursors)

      this.nextFire = time + objectClass.projectile.cooldown;
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // VEHICLE/CAR
    if(objectClass.movement.controls === VEHICLE_CONTROLS || objectClass.movement.controls === CAR_CONTROLS) {
      if(this.cursors.left.isDown) {
        this.setAngularVelocity(-speed);
      } else if(this.cursors.right.isDown) {
        this.setAngularVelocity(speed);
      }

      if(this.cursors.up.isDown) {
          this.thrust(speed * 4);
      } else {
        if(this.cursors.down.isDown && !objectClass.movement.disableDownKey) {
          this.thrust(-(speed * 4));
        } else {
          this.setAcceleration(0)
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // WALKER
    if(objectClass.movement.controls === WALKER_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.setVelocityX(-speed * 5)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.setVelocityX(speed * 5)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        this.setVelocityY(-speed * 5)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.setVelocityY(speed * 5)
        yTouched = true
      }

      if(!xTouched) this.setVelocityX(0)
      if(!yTouched) this.setVelocityY(0)
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // RUNNER
    if(objectClass.movement.controls === RUNNER_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      if(this.cursors.left.isDown) {
        this.setAccelerationX(-speed * 4)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        this.setAccelerationX(speed * 4)
        xTouched = true
      }
      
      if((objectClass.jump.style === JUMP_NONE || !isJumpAllowed) && this.cursors.up.isDown) {
        this.setAccelerationY(-speed * 4)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        this.setAccelerationY(speed * 4)
        yTouched = true
      }

      if(!xTouched) this.setAccelerationX(0)
      if(!yTouched) this.setAccelerationY(0)
    }


    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // JUMP
    if(isJumpAllowed) {
      if(objectClass.jump.style === JUMP_GROUND) {
        if(this.cursors.up.isDown) {
          if(this.sprite.body.touching.down || this.sprite.body.blocked.down) {
            this.setVelocityY(-objectClass.jump.ground)
          }
        }
      }

      if(objectClass.jump.style === JUMP_COMBO) {
        if(this.cursors.up.isDown) {
          if(this.cursors.up.isPressable) {
            this.cursors.up.isPressable = false
            if(this.sprite.body.touching.down || this.sprite.body.blocked.down) {
              this.setVelocityY(-objectClass.jump.ground * 5)
            } else if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
              this.setVelocityY(-objectClass.jump.air * 5)
              this.doubleJumpCoolDown = time + objectClass.jump.cooldown
            }
          }
        } else {
          this.cursors.up.isPressable = true
        }
      }

      if(objectClass.jump.style === JUMP_AIR) {
        if(this.cursors.up.isDown) {
          if((!this.doubleJumpCoolDown || time > this.doubleJumpCoolDown)) {
            this.setVelocityY(-objectClass.jump.air * 5)
            this.doubleJumpCoolDown = time + objectClass.jump.cooldown
          }
        }
      }

      if(objectClass.jump.style === JUMP_CONSTANT) {
        if(this.cursors.up.isDown) {
            this.thrust(objectClass.jump.ground * 4);
        } else {
          // if(this.cursors.down.isDown && !objectClass.jump.disableDownKey) {
          //   this.thrust(-(objectClass.jump.ground * 4));
          // } else {
          //   this.setAccelerationY(0)
          // }
        }
      }
    }

    // if(objectClass.movement.rotationFollowKeys) {
    //   if(this.cursors.left.isDown) {
    //     this.setAngle(270)
    //   } else if(this.cursors.right.isDown) {
    //     this.setAngle(90)
    //   } else if(this.cursors.up.isDown) {
    //     this.setAngle(0)
    //   } else if(this.cursors.down.isDown) {
    //     this.setAngle(180)
    //   }
    // }
  }

  registerRelations() {
    super.registerRelations()
    this.interactArea.register(this.getRelations())
  }

  unregisterRelations() {
    super.unregisterRelations()
    this.interactArea.unregister()
  }

  destroyInGame() {
    this.setCollideable(false);
    this.setVisible(false)
    // this.particles.setVisible(false)
    this.destroyed = true
    this.interactArea.pause()
  }

  // spawn() {
  //   super.spawn()
  //   // this.interactArea.resume()
  // }

  respawn() {
    this.setCollideable(true);
    this.setVisible(true)
    // this.particles.setVisible(true)
  }

  destroy() {
    // this.particles.destroy()
    this.cameraPreview.destroy()
    this.interactArea.destroy()
    super.destroy()
  }
}
