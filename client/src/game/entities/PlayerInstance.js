import Phaser from "phaser";
import store from "../../store";

import { EntityInstance } from "./EntityInstance";
import { CameraPreview } from "./behaviors/CameraPreview";
import { InteractArea } from "./behaviors/InteractArea";
import { ControlledMovement } from "./behaviors/ControlledMovement";
import { ControlledProjectileEjector } from "./behaviors/ControlledProjectileEjector";
import { GAME_END_STATE, ON_INTERACT, PLAYTHROUGH_PLAY_STATE, PLAYTHROUGH_START_STATE, PLAY_STATE, initialCameraZoneEntityId, initialCameraZoneInstanceId } from "../constants";
import { getCobrowsingState } from "../../utils";
import { changeGameState } from "../../store/actions/game/gameRoomInstanceActions";
import { progressActiveCutscene } from "../../store/actions/game/playerInterfaceActions";
import { editGameModel } from "../../store/actions/game/gameModelActions";

export class PlayerInstance extends EntityInstance {
  constructor(scene, entityInstanceId, entityInstanceData){
    super(scene, entityInstanceId, entityInstanceData)

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

    const { entityModelId } = entityInstanceData
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    if(!entityModel) {
      console.error('no player class for entityModelId:' + entityModelId)
    }

    const nodeSize = store.getState().gameModel.gameModel.size.nodeSize
    this.interactArea = new InteractArea(this.scene, this, {color: '0000FF', width: this.width + (nodeSize * 4), height: this.height + (nodeSize * 4) }) 
    this.lastInteractAreaUpdate = 0

    this.registerKeys()

    this.controlledMovement = new ControlledMovement(scene, this)
    this.controlledProjectileEjector = new ControlledProjectileEjector(scene, this)

    setTimeout(() => {
      // this.cameraZoneInstanceId = ENTITY_INSTANCE_DID + generateUniqueId()
      this.cameraInstance = this.scene.addEntityInstance(initialCameraZoneInstanceId, {
        entityModelId: initialCameraZoneEntityId,
        spawnX: 0,
        spawnY: 0,
      })
      this.cameraInstance.onResizeComplete = ({ width, height }) => {
        store.dispatch(editGameModel({
          entityModels: {
            [this.entityModelId]: {
              camera: {
                width,
                height,
              }
            }
          }
        }))
      }
    })

    this.isPlayerInstance = true
    this.phaserInstance.isPlayerInstance = true

    return this
  }

  registerKeys() {
    // this.mergedInput = this.scene.mergedInput.addPlayer(0)

    this.scene.input.gamepad.on('down', (pad, button, value) =>{
      console.log('gamepad down', pad, button, value)         
    });

    this.interactKey = {
      isDown: false,
      isPressable: false,
    }

    this.projectileKey = {
      isDown: false,
      isPressable: false,
    }

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.xKey = this.scene.input.keyboard.addKey('X');  // Get key object
    this.zKey = this.scene.input.keyboard.addKey('Z');  // Get key object
    this.rKey = this.scene.input.keyboard.addKey('R');  // Get key object
  }

  setSize(width, height) {
    super.setSize(width, height)
    this.interactArea.setSize(width, height)
  }

  update(time, delta) {  
    super.update()

    this.gamePad = this.scene.input.gamepad.pad1

    this.interactKey.isDown = this.xKey.isDown || (this.gamePad && this.gamePad.buttons[1].pressed)
    this.projectileKey.isDown = this.zKey.isDown || (this.gamePad && this.gamePad.buttons[0].pressed)

    if((this.gamePad && this.gamePad.buttons[2].pressed)) {
      window.location.reload()
    }

    // console.log('merged input', this.mergedInput)
    // console.log('merged input buttons', this.mergedInput.buttons)
    // console.log('merged input buttons_mapped', this.mergedInput.direction)
    // console.log('merged input', this.mergedInput.direction_secondary)

    // console.log('merged input', this.mergedInput.interaction.lastPressed)

    const gameState = store.getState().gameRoomInstance.gameRoomInstance.gameState
    const playerInterface = getCobrowsingState().playerInterface

    if(this.interactKey.isDown && this.interactKey.isPressable) {
      if(gameState === PLAYTHROUGH_START_STATE || gameState === GAME_END_STATE) {
        if(this.scene.isPlaythrough) {
          store.dispatch(changeGameState(PLAYTHROUGH_PLAY_STATE))
        } else {
          store.dispatch(changeGameState(PLAY_STATE))
        }
        this.interactKey.isPressable = false
      } else if(playerInterface.cutsceneId) {
        store.dispatch(progressActiveCutscene())
        this.interactKey.isPressable = false
      }
    }

    if(!this.interactKey.isPressable) {
      if(this.gamePad) {
        if(!this.gamePad.buttons[1].pressed) {
          this.interactKey.isPressable = true
        }
      } else {
        if(this.xKey.isUp) {
          this.interactKey.isPressable = true
        }
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
      this.interactArea.update(
        {
          x: this.phaserInstance.x, y: this.phaserInstance.y, angle: this.phaserInstance.angle
        },
        this.interactKey
      )
    }

    this.controlledMovement.update(time, delta)

    if(this.scene.isPaused) return
    // this.camera.update(time, delta)
    this.controlledProjectileEjector.update(time, delta, this.projectileKey)
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

    const playerCamera = this.scene.cameras.main
    const phaserInstance = this.phaserInstance
    const modifiedEntityData = { 
      spawnX: phaserInstance.x,
      spawnY: phaserInstance.y,
      entityModelId,
      transformCancelEntityModelId: this.transformCancelEntityModelId,
      velocityX: phaserInstance.body.velocity.x,
      velocityY: phaserInstance.body.velocity.y,
      cameraScrollX: playerCamera.scrollX,
      cameraScrollY: playerCamera.scrollY,
    }

    const scene = this.scene
    this.scene.removePlayerInstance()
    scene.addPlayerInstance(modifiedEntityData)
  }

  setLerp(
    cameraScrollX,
    cameraScrollY,
  ) {
    const entityModelId = this.entityModelId
    const entityModel = store.getState().gameModel.gameModel.entityModels[entityModelId]
    let lerpX = entityModel.camera.lerpX || 0.001
    let lerpY = entityModel.camera.lerpY || 0.001
    this.scene.cameras.main.startFollow(this.phaserInstance, false, lerpX, lerpY)
    if(cameraScrollX === undefined || cameraScrollY === undefined) return
    this.scene.cameras.main.setScroll(cameraScrollX, cameraScrollY)
  }

  destroyInGame() {
    this.setCollideable(false);
    // this.particles.setVisible(false)
    this.destroyed = true
    this.phaserInstance.invisibleOverride = true
    this.interactArea.pause()
  }

  respawn() {
    this.setCollideable(true);
    this.destroyed = false
    this.phaserInstance.invisibleOverride = false
    this.interactArea.resume()
    // this.particles.setVisible(true)
  }


  destroy() {
    // this.particles.destroy()
    if(this.cameraInstance) {
      this.scene.removeEntityInstance(this.cameraInstance.entityInstanceId, true)
    } else {
      try {
        this.scene.removeEntityInstance(this.cameraInstance.entityInstanceId, true)
      } catch(e) {
        console.error('no camera instance to destroy', this.scene?.stage.stageId, this.entityModelId)
      }
    }
    this.interactArea.destroy()
    this.scene.input.keyboard.removeKey(this.cursors.up) 
    this.scene.input.keyboard.removeKey(this.cursors.down)
    this.scene.input.keyboard.removeKey(this.cursors.left)
    this.scene.input.keyboard.removeKey(this.cursors.right)
    this.scene.input.keyboard.removeKey(this.cursors.space)
    this.scene.input.keyboard.removeKey(this.cursors.shift)
    this.scene.input.keyboard.removeKey(this.xKey)
    this.scene.input.keyboard.removeKey(this.zKey)

    super.destroy()
  }
}
