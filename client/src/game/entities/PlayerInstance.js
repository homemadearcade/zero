import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CAMERA_PREVIEW_BORDER_SIZE } from "../../constants";

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

    const gameModel = store.getState().game.gameModel
    const gameWidth = gameModel.world.boundaries.width
    // const gameHeight = gameModel.world.boundaries.height
    const cameraSize = gameWidth/objectClass.camera.zoom
    this.cameraPreview = scene.add.graphics();
    this.cameraPreview.lineStyle(CAMERA_PREVIEW_BORDER_SIZE, 0x00ff00, 1);

    // this.cameraPreview.strokeRect(0, 0, cameraSize + (CAMERA_PREVIEW_BORDER_SIZE), cameraSize + (CAMERA_PREVIEW_BORDER_SIZE));
    this.cameraPreview.strokeRect(0, 0, cameraSize, cameraSize);
    this.cameraPreview.setVisible(false)

    scene.uiLayer.add([this.cameraPreview])
    scene.playerInstanceLayer.add(this)
    scene.playerInstanceGroup.add(this)

    return this
  }

  update() {  
    super.update()

    if(this.scene.isEditModeOn) {
      this.cameraPreview.setVisible(true)
      const classId = this.classId
      const objectClass = store.getState().game.gameModel.classes[classId]
      const gameModel = store.getState().game.gameModel
      const gameWidth = gameModel.world.boundaries.width
      const cameraSize = gameWidth/objectClass.camera.zoom
      let cornerX = this.x
      let cornerY = this.y
  
      cornerX = cornerX - cameraSize/2
      cornerY = cornerY - cameraSize/2
  
      cornerX = Phaser.Math.Clamp(cornerX, 0, gameModel.world.boundaries.width - cameraSize)
      cornerY = Phaser.Math.Clamp(cornerY, 0, gameModel.world.boundaries.height - cameraSize)
    
      this.cameraPreview.setPosition(cornerX + (CAMERA_PREVIEW_BORDER_SIZE/2), cornerY + (CAMERA_PREVIEW_BORDER_SIZE/2))
      // this.cameraPreview.setPosition(cornerX, cornerY)
  
    } else {
      this.cameraPreview.setVisible(false)
    }


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
