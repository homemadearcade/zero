import Phaser from "phaser";
import store from "../../store";

import { EntityInstance } from "./EntityInstance";
import { CameraPreview } from "./behaviors/CameraPreview";
import { InteractArea } from "./behaviors/InteractArea";
import { ControlledMovement } from "./behaviors/ControlledMovement";
import { ControlledProjectileEjector } from "./behaviors/ControlledProjectileEjector";
import { GAME_END_STATE, ON_INTERACT, PLAYTHROUGH_PLAY_STATE, PLAYTHROUGH_START_STATE, PLAY_STATE } from "../constants";
import { getCobrowsingState } from "../../utils";
import { changeGameState } from "../../store/actions/game/gameRoomInstanceActions";
import { progressActiveCutscene } from "../../store/actions/game/playerInterfaceActions";

export class PlayerInstance extends EntityInstance {
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

    const { entityModelId } = instanceData
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    if(!entityModel) {
      console.error('no player class for entityModelId:' + entityModelId)
    }


    const nodeSize = store.getState().gameModel.gameModel.size.nodeSize
    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', width: entityModel.graphics.width + (nodeSize * 4), height: entityModel.graphics.height + (nodeSize * 4) }) 
    this.lastInteractAreaUpdate = 0

    this.registerKeys()

    this.controlledMovement = new ControlledMovement(scene, this)
    this.controlledProjectileEjector = new ControlledProjectileEjector(scene, this)

    return this
  }

  registerKeys() {
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.xKey = this.scene.input.keyboard.addKey('X');  // Get key object
  }

  setSize(width, height) {
    super.setSize(width, height)

    this.interactArea.setSize(width, height)
  }

  update(time, delta) {  
    super.update()

    const gameState = store.getState().gameRoomInstance.gameRoomInstance.gameState
    const playerInterface = getCobrowsingState().playerInterface

    if(this.xKey.isUp) {
      this.xKey.isPressable = true
    }

    if(this.xKey.isDown && this.xKey.isPressable) {
      if(gameState === PLAYTHROUGH_START_STATE || gameState === GAME_END_STATE) {
        if(this.scene.isPlaythrough) {
          store.dispatch(changeGameState(PLAYTHROUGH_PLAY_STATE))
        } else {
          store.dispatch(changeGameState(PLAY_STATE))
        }
        this.xKey.isPressable = false
      } else if(playerInterface.cutsceneId) {
        store.dispatch(progressActiveCutscene())
        this.xKey.isPressable = false
      }
    }

    const isPlayerPaused = getCobrowsingState().playerInterface.isPlayerPaused
    if(isPlayerPaused) {
      this.disableBody()
      return
    } else {
      this.enableBody()
    }

    if(!this.lastInteractAreaUpdate || this.lastInteractAreaUpdate + 50 < time) {
      this.lastInteractAreaUpdate = time
      this.interactArea.update({x: this.phaserInstance.x, y: this.phaserInstance.y, angle: this.phaserInstance.angle}, this.xKey)
    }

    if(this.scene.isPaused) return
    this.controlledMovement.update(time, delta)
    this.controlledProjectileEjector.update(time, delta)
  }

  registerRelations(entityInstancesByTag) {
    super.registerRelations(entityInstancesByTag)
    this.interactArea.register(this.scene.relationsByEventType[ON_INTERACT], entityInstancesByTag)
  }

  unregister() {
    super.unregister()
    this.interactArea.unregister()
  }

  transformEntityModel(entityModelId) {
    const phaserInstance = this.phaserInstance
    const modifiedEntityData = { 
      spawnX: phaserInstance.x,
      spawnY: phaserInstance.y,
      entityModelId,
      transformCancelEntityModelId: this.transformCancelEntityModelId
    }

    const scene = this.scene
    this.scene.removePlayerInstance()
    scene.addPlayerInstance(modifiedEntityData)
  }

  setLerp() {
    const entityModelId = this.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    let lerpX = entityModel.camera.lerpX
    let lerpY = entityModel.camera.lerpY
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
    this.interactArea.destroy()
    super.destroy()
  }
}
