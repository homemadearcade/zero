import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./CameraPreview";
import { ProjectileInstance } from "./ProjectileInstance";
import { InteractArea } from "./members/InteractArea";
import { ADVENTURER_CONTROLS, PLATFORMER_CONTROLS, SPACESHIP_CONTROLS } from "../../constants";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    this.particles = scene.add.particles('blue');

    this.emitter = this.particles.createEmitter({
      speed: {
        onEmit: (particle, key, t, value) =>
        {
          return this.sprite.body.speed/10;
        }
      },
      lifespan: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.sprite.body.speed/50, 0, 300) * 40000;
        }
      },
      alpha: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.sprite.body.speed/50, 0, 300) * 1000;
        }
      },
      scale: { start: 1.0, end: 0 },
      blendMode: 'ADD'
    });

    this.emitter.startFollow(this.sprite);

    this.scene = scene
    scene.playerInstanceLayer.add(this.sprite)
    scene.playerInstanceGroup.add(this.sprite)

    this.cursors = scene.input.keyboard.createCursorKeys();

    const { classId } = instanceData
    const objectClass = store.getState().game.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no hero class for id:' + classId)
    }

    if(objectClass.camera) {
      this.cameraPreview = new CameraPreview(this.scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
      this.cameraPreview.setVisible(false)
    }

    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', size: this.width * 3 })

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
    const objectClass = store.getState().game.gameModel.classes[classId]

    const gameModel = store.getState().game.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth

    const cameraSize = gameMaxWidth/objectClass.camera.zoom

    this.cameraPreview.update({x: this.sprite.x - cameraSize/2, y: this.sprite.y - cameraSize/2}, true)
    this.interactArea.update({x: this.sprite.x, y: this.sprite.y, angle: this.sprite.angle})

    this.updateControls(delta)
  }

  updateControls(delta) {
    const classId = this.classId
    const objectClass = store.getState().game.gameModel.classes[classId]
    const gravity = store.getState().game.gameModel.world.gravity

    const mod = (1/(delta * 10))

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PROJECTILE
    if(this.cursors.space.isDown && objectClass.projectile?.classId) {
      if(this.scene.game.loop.time < this.nextFire) { 
        return
      }

      const projectile = new ProjectileInstance(this.scene, 'hero-'+Math.random(), { classId: objectClass.projectile?.classId } )
      projectile.fire(this)

      this.nextFire = this.scene.game.loop.time + projectile.fireRate;
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // SPACESHIP
    if(objectClass.controls.type === SPACESHIP_CONTROLS) {
      let hasAngularMovement = false
      if(this.cursors.left.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(-objectClass.speed);
      } else if(this.cursors.right.isDown) {
        hasAngularMovement = true
        this.setAngularVelocity(objectClass.speed);
      }

      if(objectClass.controls.sticky && !hasAngularMovement) {
        this.setAngularVelocity(false)
      }
  
      if(!objectClass.controls.ignoreUpKey) {
        if(this.cursors.up.isDown) {
          this.thrust(objectClass.speed * 2);
        } else {
          this.setAcceleration(0)
          // if(objectClass.controls.sticky) {
          //   this.setVelocity(0, 0)
          // }
        }
      }
    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // ADVENTURER
    if(objectClass.controls.type === ADVENTURER_CONTROLS) {
      let xTouched = false 
      let yTouched = false

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x - objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(-objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x + objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.up.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(-objectClass.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x, this.sprite.y - objectClass.speed * mod)
          }
        } else this.setAccelerationY(-objectClass.speed)
        yTouched = true
      }

      if(this.cursors.down.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.y === 0) {
            this.setVelocityY(objectClass.speed)
            yVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x, this.sprite.y +  objectClass.speed * mod)
          }
        } else this.setAccelerationY(objectClass.speed)
        yTouched = true
      }

      if(objectClass.controls.sticky) {
        console.log(gravity, xVelocityTouched, yVelocityTouched)
        if(gravity.y === 0 && !yVelocityTouched) this.setVelocityY(0)
        if(gravity.x === 0 && !xVelocityTouched) this.setVelocityX(0)
      } else {
        if(!xTouched) this.setAccelerationX(0)
        if(!yTouched) this.setAccelerationY(0)
      }

    }

    //////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////
    // PLATFORMER
    if(objectClass.controls.type === PLATFORMER_CONTROLS) {
      let xTouched = false 

      let xVelocityTouched = false
      let yVelocityTouched = false

      if(this.cursors.left.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(-objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x - objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(-objectClass.speed)
        xTouched = true
      }
      
      if(this.cursors.right.isDown) {
        if(objectClass.controls.sticky) {
          if(gravity.x === 0) {
            this.setVelocityX(objectClass.speed)
            xVelocityTouched = true
          } else {
            this.setPosition(this.sprite.x + objectClass.speed * mod, this.sprite.y)
          }
        } else this.setAccelerationX(objectClass.speed)
        xTouched = true
      }

      if(this.cursors.down.isDown) {
        if(gravity.y === 0) {
          this.setVelocityY(objectClass.speed)
          yVelocityTouched = true
        } else {
          this.setPosition(this.sprite.x, this.sprite.y +  objectClass.speed * mod)
        }
      }

      if(this.cursors.space.isDown && this.sprite.body.touching.down) {
        this.setVelocityY(-objectClass.jumpSpeed)
      }

      if(objectClass.controls.sticky) {
        if(gravity.y === 0 && !yVelocityTouched) this.setVelocityY(0)
        if(gravity.x === 0 && !xVelocityTouched) this.setVelocityX(0)
      } else {
        if(!xTouched && !objectClass.controls.sticky) this.setAccelerationX(0)
      }
    }

    if(objectClass.attributes.rotationFollowKeys) {
      if(this.cursors.left.isDown) {
        this.setAngle(270)
      } else if(this.cursors.right.isDown) {
        this.setAngle(90)
      } else if(this.cursors.up.isDown) {
        this.setAngle(0)
      } else if(this.cursors.down.isDown) {
        this.setAngle(180)
      }
    }
  }

  registerRelations() {
    super.registerRelations()
    const gameModel = store.getState().game.gameModel
    const objectClass = gameModel.classes[this.classId]
    this.interactArea.register(objectClass.relations)
  }

  unregisterRelations() {
    super.unregisterRelations()
    this.interactArea.unregister()
  }

  destroyInGame() {
    this.setCollideable(false);
    this.setVisible(false)
    this.particles.setVisible(false)
    this.interactArea.pause()
  }

  spawn() {
    super.spawn()
    // this.interactArea.resume()
  }

  respawn() {
    this.setCollideable(true);
    this.setVisible(true)
    this.particles.setVisible(true)
  }

  destroy() {
    // this.particles.destroy()
    this.cameraPreview.destroy()
    this.interactArea.destroy()
    super.destroy()
  }
}
