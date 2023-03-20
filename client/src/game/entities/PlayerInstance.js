import Phaser from "phaser";
import store from "../../store";

import { ObjectInstance } from "./ObjectInstance";
import { CameraPreview } from "./members/CameraPreview";
import { InteractArea } from "./members/InteractArea";
import { ControlledMovement } from "./members/ControlledMovement";
import { ControlledProjectileEjector } from "./members/ControlledProjectileEjector";
import { ON_INTERACT, PLAYGROUND_LAYER_CANVAS_DEPTH, PLAYGROUND_LAYER_CANVAS_ID } from "../constants";
import { nodeSize } from "../constants";

export class PlayerInstance extends ObjectInstance {
  constructor(scene, entityInstanceId, instanceData){
    super(scene, entityInstanceId, instanceData)

    // this.particles = scene.add.particles('blue');

    // this.emitter = this.particles.createEmitter({
    //   speed: {
    //     onEmit: (particle, key, t, value) =>
    //     {
    //       return this.phaserInstance.body.speed/10;
    //     }
    //   },
    //   lifespan: {
    //     onEmit: (particle, key, t, value) =>
    //     {reg
    //       return Phaser.Math.Percent(this.phaserInstance.body.speed/50, 0, 300) * 40000;
    //     }
    //   },
    //   alpha: {
    //     onEmit: (particle, key, t, value) =>
    //     {
    //       return Phaser.Math.Percent(this.phaserInstance.body.speed/50, 0, 300) * 1000;
    //     }
    //   },
    //   scale: { start: 1.0, end: 0 },
    //   blendMode: 'ADD'
    // });

    // this.emitter.startFollow(this.phaserInstance);

    this.scene = scene

    const { entityClassId } = instanceData
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]
    if(!entityClass) {
      console.error('no player class for entityClassId:' + entityClassId)
    }

    this.setDepth(PLAYGROUND_LAYER_CANVAS_DEPTH + 2)

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.cameraPreview = new CameraPreview(this.scene, {color: 0x00FF00, zoom: entityClass.camera.zoom})
    this.cameraPreview.setVisible(false)
    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', width: entityClass.graphics.width + (nodeSize * 3), height: entityClass.graphics.height + (nodeSize * 3) }) 

    this.controlledMovement = new ControlledMovement(scene, this)
    this.controlledProjectileEjector = new ControlledProjectileEjector(scene, this)

    return this
  }

  getCameraBoundaries() {
    const cameraPreview = this.cameraPreview   
    // const entityClass = store.getState().gameModel.gameModel.entityClasses[this.entityClassId]

    const x = cameraPreview.x
    const y = cameraPreview.y
    const width = cameraPreview.width
    const height = cameraPreview.height

    return [ x, y, width, height]
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
    
    const entityClassId = this.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]

    const gameModel = store.getState().gameModel.gameModel
    const gameMaxWidth = gameModel.stages[this.scene.stage.stageId].boundaries.maxWidth

    const cameraSize = gameMaxWidth/entityClass.camera.zoom

    this.cameraPreview.update({x: this.phaserInstance.x - cameraSize/2, y: this.phaserInstance.y - cameraSize/2}, true)
    this.interactArea.update({x: this.phaserInstance.x, y: this.phaserInstance.y, angle: this.phaserInstance.angle})

    if(this.scene.isPaused) return
    this.controlledMovement.update(time, delta)
    this.controlledProjectileEjector.update(time, delta)
  }

  registerRelations() {
    super.registerRelations()
    this.interactArea.register(this.scene.relationsByEventType[ON_INTERACT])
  }

  unregister() {
    super.unregister()
    this.interactArea.unregister()
  }

  reclass(entityClassId) {
    const phaserInstance = this.phaserInstance
    const modifiedClassData = { spawnX: phaserInstance.x, spawnY: phaserInstance.y, entityClassId }

    const scene = this.scene
    this.scene.removePlayerInstance()
    scene.addPlayerInstance(modifiedClassData)
  }

  setLerp() {
    const entityClassId = this.entityClassId
    const entityClass = store.getState().gameModel.gameModel.entityClasses[entityClassId]
    let lerpX = entityClass.camera.lerpX
    let lerpY = entityClass.camera.lerpY
    this.scene.cameras.main.startFollow(this.phaserInstance, false, lerpX, lerpY)
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
