import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./members/CameraPreview";
import { InteractArea } from "./members/InteractArea";
import { ControlledMovement } from "./members/ControlledMovement";
import { ProjectileEjector } from "./members/ProjectileEjector";
import { PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID } from "../constants";
import { nodeSize } from "../defaultData/general";

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
      console.error('no player class for id:' + classId)
    }

    this.setDepth(PLAYGROUND_CANVAS_DEPTH + 1)

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.cameraPreview = new CameraPreview(this.scene, {color: 0x00FF00, zoom: objectClass.camera.zoom})
    this.cameraPreview.setVisible(false)
    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', width: objectClass.graphics.width + (nodeSize * 3), height: objectClass.graphics.height + (nodeSize * 3) }) 

    this.controlledMovement = new ControlledMovement(scene, this)
    this.projectileEjector = new ProjectileEjector(scene, this)

    return this
  }

  setSize(width, height) {
    super.setSize(width, height)

    this.interactArea.setSize(width, height)
  }

  setZoom(zoom) {
    this.cameraPreview.setZoom(zoom)
  }

  update(time, delta) {  
    super.update()
    
    const classId = this.classId
    const objectClass = store.getState().gameModel.gameModel.classes[classId]

    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.stages[this.scene.stage.id].boundaries.maxWidth

    const cameraSize = gameMaxWidth/objectClass.camera.zoom

    this.cameraPreview.update({x: this.sprite.x - cameraSize/2, y: this.sprite.y - cameraSize/2}, true)
    this.interactArea.update({x: this.sprite.x, y: this.sprite.y, angle: this.sprite.angle})

    if(this.scene.isPaused) return

    this.controlledMovement.update(time, delta)
    this.projectileEjector.update(time, delta)
  }

  registerRelations() {
    const relations = this.getRelations()
    super.registerRelations(relations)
    this.interactArea.register(relations)
  }

  unregister() {
    super.unregister()
    this.interactArea.unregister()
  }

  reclass(classId) {
    const sprite = this.sprite
    const modifiedClassData = { spawnX: sprite.x, spawnY: sprite.y, classId }

    const scene = this.scene
    this.scene.removePlayerInstance()
    scene.addPlayerInstance(modifiedClassData)
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
    // this.particles.setVisible(false)
    this.destroyed = true
    this.isVisible = false
    this.interactArea.pause()
  }

  respawn() {
    this.setCollideable(true);
    this.destroyed = false
    this.isVisible = true
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
