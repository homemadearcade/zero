import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./CameraPreview";
import { ProjectileInstance } from "./ProjectileInstance";
import { InteractArea } from "./InteractArea";
import { ON_INTERACT } from "../../constants";

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

    this.xKey = scene.input.keyboard.addKey('X');  // Get key object
    // this.interactArea = new InteractArea(this.scene, {color: 0x0000FF, size: this.width * 3 })
    
    this.interactables = []
    // objectClass.relationships.forEach(({classId, event, effect}) => {
    //   if(event === ON_INTERACT) {
    //     this.scene.matterCollision.addOnCollideActive({
    //       objectA: this.interactArea,
    //       callback: eventData => {
    //         const { gameObjectB } = eventData;
    //         if(gameObjectB === this) return
    //         if(!gameObjectB) return
    //         if(classId === gameObjectB.classId) {
    //           this.interactables.push({gameObject: gameObjectB, effect})
    //         }
    //       }
    //     })
    //     this.scene.matterCollision.addOnCollideEnd({
    //       objectA: this.interactArea,
    //       callback: eventData => {
    //         const { gameObjectB } = eventData;
    //         if(gameObjectB === this) return
    //         if(!gameObjectB) return
    //         if(classId === gameObjectB.classId) {
    //           gameObjectB.border.setVisible(false)
    //         }
    //       }
    //     })
    //   }
    // })

    this.setAngularDrag(100)

    return this
  }

  setZoom(zoom) {
    this.cameraPreview.setZoom(zoom)
  }

  update() {  
    super.update()

    this.updateInteractions()

    const classId = this.classId
    const objectClass = store.getState().game.gameModel.classes[classId]

    const gameModel = store.getState().game.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth

    const cameraSize = gameMaxWidth/objectClass.camera.zoom

    this.cameraPreview.update({x: this.sprite.x - cameraSize/2, y: this.sprite.y - cameraSize/2}, true)
    // this.interactArea.update({x: this.sprite.x, y: this.sprite.y, angle: this.sprite.angle})

    if(this.scene.isPaused) return

    if(this.cursors.space.isDown && objectClass.projectile?.classId) {
      if(this.scene.game.loop.time < this.nextFire) { 
        return
      }

      const projectile = new ProjectileInstance(this.scene, 'hero-'+Math.random(), { classId: objectClass.projectile?.classId } )
      projectile.fire(this)

      this.nextFire = this.scene.game.loop.time + projectile.fireRate;
    }

    if(this.cursors.left.isDown) {
      this.setAngularVelocity(-100);
    } else if(this.cursors.right.isDown) {
      this.setAngularVelocity(100);
    }

    if(this.cursors.up.isDown && !objectClass.attributes.ignoreUpKey) {
      this.thrust(200);
    } else {
      this.setAcceleration(0)
    }
  }

  updateInteractions() {
    let interactPossibility = {
      closestInteractable: null,
      closestDistance: Infinity,
      effect: null
    }

    this.interactables.forEach(({gameObject, effect}) => {
      gameObject.border.setVisible(false)
      const distance = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, this.sprite.x, this.sprite.y)
      const { closestDistance } = interactPossibility
      if(distance < closestDistance) {
        interactPossibility.closestDistance = distance
        interactPossibility.closestInteractable = gameObject
        interactPossibility.effect = effect
      }
    })
    
    const { closestInteractable, effect } = interactPossibility
    if(closestInteractable) closestInteractable.border.setVisible(true)
    if(closestInteractable && this.xKey.isDown) {
      this.runEffect(effect, closestInteractable)
    }
    this.interactables = []
  }

  destroyInGame() {
    this.setCollideable(false);
    this.setVisible(false)
    this.particles.setVisible(false)
  }

  respawn() {
    this.setCollideable(true);
    this.setVisible(true)
    this.particles.setVisible(true)
  }

  destroy() {
    // this.particles.destroy()
    this.cameraPreview.destroy()
    // this.interactArea.destroy()
    super.destroy()
  }
}
