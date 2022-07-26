import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CAMERA_PREVIEW_BORDER_SIZE } from "../../constants";
import { CameraPreview } from "./CameraPreview";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, id, instanceData){
    super(scene, id, instanceData)

    var particles = scene.add.particles('blue');

    var emitter = particles.createEmitter({
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

    emitter.startFollow(this);

    this.cursors = scene.input.keyboard.createCursorKeys();

    const { classId } = instanceData
    const objectClass = store.getState().game.gameModel.classes[classId]
    if(!objectClass) {
      console.error('no hero class for id:' + classId)
    }

    if(objectClass.camera) {
      this.cameraPreview = new CameraPreview(scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
    }

    scene.playerInstanceLayer.add(this)
    scene.playerInstanceGroup.add(this)

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
    const gameWidth = gameModel.world.boundaries.width
    const cameraSize = gameWidth/objectClass.camera.zoom
    const x = this.x - cameraSize/2
    const y = this.y - cameraSize/2
    this.cameraPreview.update({x, y})

    if(this.scene.isPaused || this.scene.isEditModeOn) return

    if (this.cursors.left.isDown)
    {
        this.setAngularVelocity(-0.1);
    }
    else if (this.cursors.right.isDown)
    {
        this.setAngularVelocity(0.1);
    }

    if (this.cursors.up.isDown)
    {
        this.thrust(0.08);
    }
  }
}
