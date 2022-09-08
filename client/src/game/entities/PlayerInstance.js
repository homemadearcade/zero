import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./CameraPreview";
import { ProjectileInstance } from "./ProjectileInstance";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    this.particles = scene.add.particles('blue');

    this.emitter = this.particles.createEmitter({
      speed: {
        onEmit: (particle, key, t, value) =>
        {
          return this.body.speed * 10;
        }
      },
      lifespan: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 40000;
        }
      },
      alpha: {
        onEmit: (particle, key, t, value) =>
        {
          return Phaser.Math.Percent(this.body.speed, 0, 300) * 1000;
        }
      },
      scale: { start: 1.0, end: 0 },
      blendMode: 'ADD'
    });

    this.emitter.startFollow(this);

    this.cursors = scene.input.keyboard.createCursorKeys();

    const { classId } = instanceData
    const objectClass = store.getState().game.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no hero class for id:' + classId)
    }

    if(objectClass.camera) {
      this.cameraPreview = new CameraPreview(scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
      this.cameraPreview.setVisible(false)
    }

    scene.playerInstanceLayer.add(this)
    scene.playerInstanceGroup.add(this)

    this.scene = scene

    return this
  }

  setZoom(zoom) {
    this.cameraPreview.setZoom(zoom)
  }

  update() {  
    super.update()

    const classId = this.classId
    const objectClass = store.getState().game.gameModel.classes[classId]
    const gameModel = store.getState().game.gameModel
    const gameMaxWidth = gameModel.world.boundaries.maxWidth
    const cameraSize = gameMaxWidth/objectClass.camera.zoom
    const x = this.x - cameraSize/2
    const y = this.y - cameraSize/2
    this.cameraPreview.update({x, y}, true)

    if(this.scene.isPaused) return

    if(this.cursors.space.isDown) {
      if (this.scene.game.loop.time < this.nextFire) { return; }

      const projectile = new ProjectileInstance(this.scene, 'hero-'+Math.random(), { classId: '3a0927a1-5aa3-412f-9e35-726aafd07410' } )
      projectile.fire(this)

      this.nextFire = this.scene.game.loop.time + projectile.fireRate;
    }

    if (this.cursors.left.isDown)
    {
        this.setAngularVelocity(-0.1);
    }
    else if (this.cursors.right.isDown)
    {
        this.setAngularVelocity(0.1);
    }

    if (this.cursors.up.isDown && !objectClass.behaviors.ignoreUpKey)
    {
        this.thrust(0.08);
    }
  }

  destroyInGame() {
    this.setActive(false)
    this.setCollisionCategory(null);
    this.setVisible(false)
    this.particles.setVisible(false)
  }

  respawn() {
    this.setActive(true)
    this.setCollisionCategory(1);
    this.setVisible(true)
    this.particles.setVisible(true)
  }
}
