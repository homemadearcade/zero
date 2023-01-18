import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./members/CameraPreview";
import { InteractArea } from "./members/InteractArea";
import { ControlledMovement } from "./members/ControlledMovement";
import { ProjectileEjector } from "./members/ProjectileEjector";
import { PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID } from "../constants";

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

    const { classId } = instanceData
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no hero class for id:' + classId)
    }

    this.setDepth(PLAYGROUND_CANVAS_DEPTH + 1)

    this.setAngularDrag(100)

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.cameraPreview = new CameraPreview(this.scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
    this.cameraPreview.setVisible(false)
    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', size: objectClass.graphics.width * 3 }) 

    this.controlledMovement = new ControlledMovement(scene, this)
    this.projectileEjector = new ProjectileEjector(scene, this)

    this.unregisterColliders = []

    return this
  }

  setZoom(zoom) {
    this.cameraPreview.setZoom(zoom)
  }

  update(time, delta) {  
    super.update()

    // paused type?
    // if(this.scene.isPaused) return

    const classId = this.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth

    const cameraSize = gameMaxWidth/objectClass.camera.zoom

    this.cameraPreview.update({x: this.sprite.x - cameraSize/2, y: this.sprite.y - cameraSize/2}, true)
    this.interactArea.update({x: this.sprite.x, y: this.sprite.y, angle: this.sprite.angle})

    this.controlledMovement.update(time, delta)
    this.projectileEjector.update(time, delta)
  }

  registerRelations() {
    super.registerRelations()
    this.interactArea.register(this.getRelations())

    // all sprites on playground layer collide with hero
    const gameModel = store.getState().gameModel.gameModel
    const releventInstances = this.scene.objectInstances.filter((objectInstance) => {
      const objectClass = gameModel.classes[objectInstance.classId]
      return objectClass.graphics.layerId === PLAYGROUND_CANVAS_ID
    }).map(({sprite}) => sprite)

    this.unregisterColliders.push(
      this.scene.physics.add.collider(this.sprite, releventInstances, (instanceA, instanceB) => {
        instanceA.justCollided = true
        instanceB.justCollided = true
      })
    )
  }

  unregisterRelations() {
    super.unregisterRelations()
    this.interactArea.unregister()
    this.unregisterColliders.forEach((fx) =>  {
      this.scene.physics.world.removeCollider(fx)
    })
  }

  reclass(classId) {
    const sprite = this.sprite
    const modifiedClassData = { spawnX: sprite.x, spawnY: sprite.y, classId }
    this.scene.addPlayerInstance(modifiedClassData)
    this.scene.removePlayerInstance()
  }

  setLerp() {
    const classId = this.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]
    let lerpX = objectClass.camera.lerpX
    let lerpY = objectClass.camera.lerpY
    this.scene.cameras.main.startFollow(this.sprite, false, lerpX, lerpY)
  }

  destroyInGame() {
    this.setCollideable(false);
    this.setVisible(false)
    // this.particles.setVisible(false)
    this.destroyed = true
    this.interactArea.pause()
  }

  respawn() {
    this.setCollideable(true);
    this.setVisible(true)
    this.interactArea.resume()
    // this.particles.setVisible(true)
  }

  destroy() {
    // this.particles.destroy()
    this.cameraPreview.destroy()
    this.interactArea.destroy()
    super.destroy()
  }
}
