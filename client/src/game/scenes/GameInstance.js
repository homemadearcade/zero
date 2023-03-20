import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { BACKGROUND_LAYER_CANVAS_DEPTH, BACKGROUND_LAYER_CANVAS_ID, PLAYER_INSTANCE_ID_PREFIX, FOREGROUND_LAYER_CANVAS_DEPTH, FOREGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_DEPTH, PLAYGROUND_LAYER_CANVAS_ID, UI_CANVAS_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, NPC_CLASS, ZONE_CLASS, PLAYER_CLASS, ON_PLAYTHROUGH, START_STATE, PAUSED_STATE, PLAY_STATE, STOPPED_STATE, PLAYTHROUGH_PLAY_STATE, GAME_OVER_STATE, WIN_GAME_STATE, PLAYTHROUGH_PAUSED_STATE, ANIMATION_CAMERA_SHAKE, ANIMATION_CONFETTI, OBJECT_INSTANCE_ID_PREFIX, EVENT_SPAWN_CLASS_IN_CAMERA, EVENT_SPAWN_CLASS_DRAG_FINISH } from '../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Stage } from '../entities/Stage';
import { changePlayerClass } from '../../store/actions/playerInterfaceActions';
import { ProjectileInstance } from '../entities/ProjectileInstance';
import { changeCurrentStage } from '../../store/actions/gameModelActions';
import JSConfetti from 'js-confetti'
import { editGameRoom, updateGameRoomPlayer } from '../../store/actions/gameRoomActions';
import { generateUniqueId } from '../../utils/webPageUtils';
import { directionalPlayerClassId } from '../constants';
import { getTextureIdForLayerCanvasId } from '../../utils';

export class GameInstance extends Phaser.Scene {
  constructor(props) {
    super(props);

    this.playerInstance = null 
    this.backgroundCanvasLayer = null
    this.playgroundCanvasLayer = null
    this.foregroundCanvasLayer = null

    this.backgroundCanvasLayerTextureId = null
    this.playgroundCanvasLayerTextureId = null
    this.foregroundCanvasLayerTextureId = null

    this.entityInstances = []
    this.entityInstancesById = {}
    this.entityInstancesByTag = {}

    this.temporaryInstances = []
    this.temporaryInstancesById = {}
    this.temporaryInstancesByTag = {}

    this.gameState = null

    this.relationsPopulated = {}

    this.colliderRegistrations = []

    this.physicsType = ARCADE_PHYSICS

    this.gameRoom = props.gameRoom

    this.lastUpdate = null
  }

  init(data) {
    this.firstStage = data.firstStage
  }

  runGameInstanceEvent({gameInstanceEventType, data}) {
    switch(gameInstanceEventType) {
      case ANIMATION_CAMERA_SHAKE: 
        this.cameras.main.shake(data.intensity)
        return
      case ANIMATION_CONFETTI:
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti();
        return
      case EVENT_SPAWN_CLASS_IN_CAMERA: 
        this.spawnObjectInstanceInsidePlayerCamera(data)
        return
      case EVENT_SPAWN_CLASS_DRAG_FINISH: 
        const entityInstance = this.getObjectInstance(data.entityInstanceId)
        entityInstance.phaserInstance.x = data.x;
        entityInstance.phaserInstance.y = data.y;
        return
      default: 
        return
    }
  }

  getAllObjectInstancesOfClassId(entityClassId) {
    let instances = [...this.entityInstances]
    if(entityClassId === this.playerInstance?.entityInstanceId || entityClassId === this.playerInstance?.entityClassId) {
      instances.push(this.playerInstance)
    }
    instances = instances.filter((instance) => {
      return instance.entityClassId === entityClassId
    })
    
    const projectiles= this.temporaryInstances.filter((instance) => {
      return instance.entityClassId === entityClassId
    })

    return instances.concat(projectiles)
  }

  getRandomInstanceOfClassId(entityClassId) {
    const instances = this.getAllObjectInstancesOfClassId(entityClassId)
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  forAllObjectInstancesMatchingClassId(entityClassId, fx) {
   [this.playerInstance, ...this.entityInstances, ...this.temporaryInstances].forEach((entityInstance) => {
      if(entityInstance.entityClassId === entityClassId) {
        fx(entityInstance)
      } else if(entityInstance.entityInstanceId === entityClassId) {
        //player class
        fx(entityInstance)
      }
    })
  }

  getObjectInstance(entityInstanceId) {
    if(entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
      return this.playerInstance
    }
    
    return this.entityInstancesById[entityInstanceId]
  }

  getRandomPosition(x, y, w, h) {
    const xPlus = Math.random() * w
    const yPlus = Math.random() * h

    return {
      x: x + xPlus,
      y: y + yPlus
    }
  }

  initializePlayerInstance(classData) {
    if(!classData) {
      const state = store.getState()
      const gameModel = state.gameModel.gameModel
      const playerInterface = getCobrowsingState().playerInterface
      const stageId = state.gameModel.currentStageId
      const currentStage = gameModel.stages[stageId]
      const zoneId = gameModel.stages[stageId].spawnZoneClassId
      const zone = this.getRandomInstanceOfClassId(zoneId)

      const {x, y} = this.getRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.entityClasses[zoneId]))

      let lastPlayerClassId = playerInterface.playerClassId ? playerInterface.playerClassId : directionalPlayerClassId;

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_ID_PREFIX, {
        entityClassId: currentStage.playerClassId ? currentStage.playerClassId : lastPlayerClassId,
        spawnX:x,
        spawnY: y
      });
    } else {

      const {entityClassId, spawnX, spawnY} = classData

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_ID_PREFIX, {
        entityClassId,
        spawnX,
        spawnY
      });
    }

    this.playerInstance.setLerp()
  }

  addPlayerInstance(classData) {
    this.initializePlayerInstance(classData)
    this.reregisterRelationships()
  }

  removePlayerInstance() {
    // this.playerInstance.particles.destroy()
    this.playerInstance.destroy()
    this.playerInstance = null
  }

  sortInstancesIntoTags() {
    this.entityInstancesByTag = {}
    const entityClasses = store.getState().gameModel.gameModel.entityClasses
    const allInstances = this.entityInstances.slice()
    allInstances.push(this.playerInstance)
    allInstances.forEach((entityInstance) => {
      const entityClass = entityClasses[entityInstance.entityClassId]
      Object.keys(entityClass.tags).forEach((tagId) => {
        if(entityClass.tags[tagId]) {
          if(!this.entityInstancesByTag[tagId]) {
            this.entityInstancesByTag[tagId] = [entityInstance]
          } else {
            this.entityInstancesByTag[tagId].push(entityInstance)
          }
        }
      })
    })
  }

  populateAndSortRelations() {
    const relations = store.getState().gameModel.gameModel.relations
    const effects = store.getState().gameModel.gameModel.effects
    const events = store.getState().gameModel.gameModel.events

    this.relationsByEventType = Object.keys(relations).reduce((relationsByEvent, relationId) => {
      const relation = relations[relationId]
      const populatedEvent = events[relation.eventId]
      const populatedEffects = relation.effectIds.map((effectId) => {
        let effect 
        if(!relation.effects[effectId]) {
          effect = {
            ...effects[effectId],
            ...relation.effects[effectId],
          }
        } else {
          effect = effects[effectId]
        }
        return effect
      })

      const populatedRelation = {
        event: populatedEvent,
        effects: populatedEffects,
        relationId: relation.relationId
      }

      if(relationsByEvent[populatedEvent.eventType]) {
        relationsByEvent[populatedEvent.eventType].push(populatedRelation)
      } else {
        relationsByEvent[populatedEvent.eventType] = [populatedRelation]
      }
      

      return relationsByEvent
    }, {})

    console.log(this.relationsByEventType)
  }
  
  reregisterRelationships() {
    this.unregisterRelations()
    this.populateAndSortRelations()
    this.sortInstancesIntoTags()
    this.registerRelations()
  }

  addTemporaryInstance(entityInstanceId, entityClassId) {
    const temporaryInstance = new ProjectileInstance(this, entityInstanceId, { entityClassId })
    this.temporaryInstances.push(temporaryInstance)
    this.temporaryInstancesById[entityInstanceId] = temporaryInstance
    // this.unregisterRelations()
    // this.registerRelations()
    return temporaryInstance
  }

  removeTemporaryInstance(entityInstanceId) {
    this.temporaryInstances = this.temporaryInstances.filter((temporaryInstance) => {
      return entityInstanceId !== temporaryInstance.entityInstanceId
    })
    this.temporaryInstancesById[entityInstanceId].destroy()
    this.temporaryInstancesById[entityInstanceId] = null
  }

  initializeObjectInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const newPhaserObject = new ObjectInstance(this, entityInstanceId, entityInstanceData, effectSpawned)
    this.entityInstances.push(newPhaserObject)
    this.entityInstancesById[entityInstanceId] = newPhaserObject

    return newPhaserObject
  }
  addObjectInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const instance = this.initializeObjectInstance(entityInstanceId, entityInstanceData, effectSpawned)
    this.reregisterRelationships()
    return instance
  }
  removeObjectInstance(entityInstanceId) {
    this.entityInstances = this.entityInstances.filter((object) => {
      return entityInstanceId !== object.entityInstanceId
    })
    this.getObjectInstance(entityInstanceId).destroy()
    this.entityInstancesById[entityInstanceId] = null
    this.reregisterRelationships()
  }
  updateObjectInstance(entityInstance, {x, y, rotation, isVisible, destroyAfterUpdate, transformEntityClassId}) {
    if(x) entityInstance.phaserInstance.x = x;
    if(y) entityInstance.phaserInstance.y = y;
    if(rotation) entityInstance.phaserInstance.rotation = rotation;
    entityInstance.setVisible(isVisible);
    entityInstance.isVisible = isVisible
    entityInstance.destroyAfterUpdate = destroyAfterUpdate 
    entityInstance.transformEntityClassId = transformEntityClassId
  }

  registerRelations() {
    /// RELATIONS
    this.playerInstance.registerRelations()

    this.entityInstances.forEach((instance) => {
      instance.registerRelations()
    })

    // this.temporaryInstances.forEach((instance) => {
    //   instance.registerRelations()
    // })

    /// COLLIDERS
    this.playerInstance.registerColliders()

    this.entityInstances.forEach((instance) => {
      instance.registerColliders()
    })

    this.temporaryInstances.forEach((instance) => {
      instance.registerColliders()
    })

    // all phaserInstances on playground layer collide with the player
    const gameModel = store.getState().gameModel.gameModel
    const releventInstances = this.entityInstances.filter((entityInstance) => {
      const entityClass = gameModel.entityClasses[entityInstance.entityClassId]
      return entityClass.graphics.layerId === PLAYGROUND_LAYER_CANVAS_ID
    }).map(({phaserInstance}) => phaserInstance)

    this.colliderRegistrations.push(
      this.physics.add.collider(this.playerInstance.phaserInstance, releventInstances, (phaserInstanceA, phaserInstanceB) => {
        phaserInstanceA.justCollided = true
        phaserInstanceB.justCollided = true
      })
    )

    this.playgroundCanvasLayer.registerColliders()
  }

  unregisterRelations() {
    /// RELATIONS AND COLLIDERS
    this.playerInstance.unregister()

    this.entityInstances.forEach((instance) => {
      instance.unregister()
    })

    // this.temporaryInstances.forEach((instance) => {
    //   instance.unregister()
    // })

    this.colliderRegistrations.forEach((collider) =>  {
      // this.physics.world.removeCollider(collider)
      collider.destroy()
    })
    this.colliderRegistrations = []

    this.playgroundCanvasLayer.unregisterColliders()
  }

  afterGameInstanceUpdateEffects() {
    if(this.playerInstance.destroyAfterUpdate) {
      this.playerInstance.destroyInGame()
    }

    this.temporaryInstances.forEach((temporaryInstance) => {
      if(temporaryInstance.destroyTime < Date.now()) {
        temporaryInstance.destroyAfterUpdate = true
      }
    });
    
    [...this.temporaryInstances, ...this.entityInstances].forEach((entityInstance) => {
      if(entityInstance.transformEntityClassId && entityInstance.transformEntityClassId !== entityInstance.entityClassId) {
        entityInstance.reclass(entityInstance.transformEntityClassId)
      } else if(entityInstance.destroyAfterUpdate) {
        entityInstance.destroyInGame()
      }
    })

    if(this.playerInstance.transformEntityClassId && this.playerInstance.entityClassId !== this.playerInstance.transformEntityClassId) {
      this.playerInstance.reclass(this.playerInstance.transformEntityClassId)
    }
  }

  // getSpriteTexture(textureId) {
  //   const { phaserInstanceSheetName, phaserInstanceIndex } = getTextureMetadata(textureId)
  //   return this.images.getFrame(phaserInstanceSheetName, phaserInstanceIndex)
  // }

  //Sine.easeInOut
  // zoomAndPanTo(camera, zoomLevel, x, y, duration, easing = "Linear") {
  //   camera.pan(
  //     x,
  //     y,
  //     duration,
  //     easing,
  //     true,
  //     (camera, progress) => {
  //       // if (phaserInstanceToFollow) {
  //       //   camera.panEffect.destination.x = phaserInstanceToFollow.x;
  //       //   camera.panEffect.destination.y = phaserInstanceToFollow.y;
  //       // } 
  //       // if (progress === 1 && whenFinished) {
  //       //   whenFinished();
  //       // }
  //     }
  //   );
  //   camera.zoomTo(zoomLevel, duration, easing);
  // }

  getLayerCanvasInstanceByTextureId(textureId) {
    if(textureId === this.backgroundCanvasLayer.textureId) {
      return this.backgroundCanvasLayer
    }
    if(textureId === this.playgroundCanvasLayer.textureId) {
      return this.playgroundCanvasLayer
    }
    if(textureId === this.foregroundCanvasLayer.textureId) {
      return this.foregroundCanvasLayer
    }

    console.error('didnt find layer with id', textureId, typeof textureId)
  }
  
  getLayerCanvasInstanceById(layerCanvasId) {
    if(layerCanvasId === BACKGROUND_LAYER_CANVAS_ID) {
      return this.backgroundCanvasLayer
    }
    if(layerCanvasId === PLAYGROUND_LAYER_CANVAS_ID) {
      return this.playgroundCanvasLayer
    }
    if(layerCanvasId === FOREGROUND_LAYER_CANVAS_ID) {
      return this.foregroundCanvasLayer
    }

    console.error('didnt find layer with id', layerCanvasId, typeof layerCanvasId)
  }

  initializeObjectInstances() {
    const state = store.getState()
    const gameModel = store.getState().gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    const currentStage = gameModel.stages[stageId]
    const entityInstances = currentStage.entityInstances
    Object.keys(entityInstances).forEach((entityInstanceId) => {
      const entityInstanceData = entityInstances[entityInstanceId]
      if(!entityInstanceData) {
        // LEGACY
        // if(entityInstanceId === 'oi/playspawnzone' || entityInstanceId === 'oi-playspawnzone') {
        //   console.log('ding this thing?')
        //   this.initializeObjectInstance(entityInstanceId, initialPlayerSpawnZone)
        //   return
        // } else {
          return console.error('Object missing!', entityInstanceId)
        // }
      } 
      if(entityInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
        return console.error('hero got in?!')
      }
      if(!entityInstanceData.entityClassId) {
        return console.error('missing entityClassId!!', entityInstanceData)
      }

      this.initializeObjectInstance(entityInstanceId, entityInstanceData)
    });

    this.entityInstances = this.entityInstances.filter((entityInstance) => {
      return !!entityInstance
    })
  }

  initializeLayers = () => {
    const state = store.getState()
    const gameModel = store.getState().gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    const currentStage = gameModel.stages[stageId]

    this.backgroundCanvasLayerTextureId = getTextureIdForLayerCanvasId(gameModel.id, stageId, BACKGROUND_LAYER_CANVAS_ID)
    this.playgroundCanvasLayerTextureId = getTextureIdForLayerCanvasId(gameModel.id, stageId, PLAYGROUND_LAYER_CANVAS_ID)
    this.foregroundCanvasLayerTextureId = getTextureIdForLayerCanvasId(gameModel.id, stageId, FOREGROUND_LAYER_CANVAS_ID)

    this.backgroundCanvasLayer = new CodrawingCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost, 
        textureId: this.backgroundCanvasLayerTextureId,
        boundaries: currentStage.boundaries, 
        autoSave: true
      })
    this.backgroundCanvasLayer.setDepth(BACKGROUND_LAYER_CANVAS_DEPTH)
    // layer zero
    this.playgroundCanvasLayer = new CollisionCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost,
        textureId: this.playgroundCanvasLayerTextureId,
        boundaries: currentStage.boundaries,
        autoSave: true
      })
    this.playgroundCanvasLayer.setDepth(PLAYGROUND_LAYER_CANVAS_DEPTH)

    this.entityInstanceGroup = this.add.group()
    // this.basicClassGroup = this.add.group()
    // this.npcClassGroup = this.add.group()
    // this.temporaryInstanceGroup = this.add.group()


    // FOREGROUND layer
    this.foregroundCanvasLayer = new CodrawingCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost,
        textureId: this.foregroundCanvasLayerTextureId,
        boundaries: currentStage.boundaries,
        autoSave: true
      })
    this.foregroundCanvasLayer.setDepth(FOREGROUND_LAYER_CANVAS_DEPTH)

    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_CANVAS_DEPTH)
  }

  

  create() {
    const state = store.getState()
    const gameModel = store.getState().gameModel.gameModel
    const gameRoom = store.getState().gameRoom.gameRoom
    const stageId = state.gameModel.currentStageId
    const currentStage = gameModel.stages[stageId]

    this.populateAndSortRelations()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.stage = new Stage(this, stageId, currentStage)

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // LAYERS
    ////////////////////////////////////////////////////////////
    this.initializeLayers()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // OBJECTS
    ////////////////////////////////////////////////////////////
    this.entityInstances = []
    this.entityInstancesById = {}
    this.temporaryInstances = []
    this.temporaryInstancesById = {}

    this.initializeObjectInstances()

    this.stage.ensureSpawnZoneExists()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // PLAYER
    ////////////////////////////////////////////////////////////
    this.initializePlayerInstance()
    this.sortInstancesIntoTags()

    this.registerRelations()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CAMERA
    ////////////////////////////////////////////////////////////
    const gameWidth = currentStage.boundaries.width
    const gameHeight = currentStage.boundaries.height
    const gameX = currentStage.boundaries.x
    const gameY = currentStage.boundaries.y

    this.cameras.main.setBounds(gameX, gameY, gameWidth, gameHeight);
    this.cameras.main.pan(this.playerInstance.phaserInstance.x, this.playerInstance.phaserInstance.y, 0)
    const playerClass = gameModel.entityClasses[this.playerInstance.entityClassId]
    this.cameras.main.setZoom(playerClass.camera.zoom);

    this.startPlaythroughStartEffects()

    setTimeout(() => {
      this.setPlayerGameLoaded(this.gameRoom.id)
      this.hasLoadedOnce = true
    })
  }

  setPlayerGameLoaded(gameId) {
    store.dispatch(updateGameRoomPlayer({
      gameRoomId: this.gameRoom.id,
      userId: store.getState().auth.me.id,
      user: {
        loadedGameId: gameId
      }
    }))
  }

  respawn() {
    this.entityInstances.forEach((entityInstance) => {
      entityInstance.x = entityInstance.spawnX
      entityInstance.y = entityInstance.spawnY
    })
    const state = store.getState()
    const gameModel = state.gameModel
    this.stage.ensureSpawnZoneExists()
    const zoneId = gameModel.stages[this.stage.stageId].spawnZoneClassId
    const zone = this.scene.getRandomInstanceOfClassId(zoneId)
    this.playerInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.entityClasses[zoneId]))
  }

  spawnObjectInstanceInsidePlayerCamera({entityClassId}) {
    const [x, y, width, height] = this.playerInstance.getCameraBoundaries()
    const xMix = Math.random() * width;
    const yMix = Math.random() * height;
    const spawnX = x + (yMix);
    const spawnY = y + (xMix);
    console.log({
      spawnX,
      spawnY,
      xMix,
      yMix,
      x,y,width,height
    })
    this.addObjectInstance(OBJECT_INSTANCE_ID_PREFIX+generateUniqueId(), { spawnX, spawnY, entityClassId}, true)
  }

  startPlaythroughStartEffects() {
    if(this.isPlaythrough && this.firstStage) {
      this.relationsByEventType[ON_PLAYTHROUGH]?.forEach((relation) => {
        this.playerInstance.startRunEventEffects(
          relation,
        )
      })
    }
  }

  sendResetGameEvent() {
    // this updates here because all players are watching the current stage right now
    const startingStageId = store.getState().gameModel.gameModel.player.startingStageId
    store.dispatch(changeCurrentStage(startingStageId))

    if(store.getState().gameRoom.gameRoom?.id) {
      store.dispatch(editGameRoom(store.getState().gameRoom.gameRoom.id, {
        gameResetDate: Date.now()
      }))
    } else {
      this.reset()
    }

    this.startPlaythroughStartEffects()
  }

  destroyInstances() {
    this.entityInstances.forEach((instance) => {
      instance.destroy()
    })
    this.temporaryInstances.forEach((instance) => {
      instance.destroyAfterUpdate = true
      instance.destroy()
    })
    this.temporaryInstances = []
    this.temporaryInstancesById = {}
    this.temporaryInstancesByTag = {}
    this.entityInstances= []
    this.entityInstancesById = {}
    this.entityInstancesByTag = {}
    this.playerInstance.destroy()
    this.playerInstance = null
  }

  reset = () => {
    // this.registry.destroy(); // destroy registry
    // this.events.off(); // disable all active events
    // this.scene.restart(); // restart current scene
    // this.unregisterEvents()
    this.destroyInstances()

    this.initializeObjectInstances()
    this.initializePlayerInstance()

    this.reregisterRelationships()
  }
  
  update(time, delta) {
    this.lastUpdate = Date.now()
    
    // FOR CLIENTS
    if(!this.isPaused) super.update(time, delta)

    const gameViewEditor = getCobrowsingState().gameViewEditor

    const layerInvisibility = gameViewEditor.layerInvisibility

    this.backgroundCanvasLayer.setVisible(!layerInvisibility[BACKGROUND_LAYER_CANVAS_ID])
    this.playgroundCanvasLayer.setVisible(!layerInvisibility[PLAYGROUND_LAYER_CANVAS_ID])
    this.foregroundCanvasLayer.setVisible(!layerInvisibility[FOREGROUND_LAYER_CANVAS_ID])

    this.stage.update()

    this.entityInstances.forEach((entityInstance) => {
      entityInstance.update(time, delta);
    })

    this.temporaryInstances.forEach((projectile) => {
      projectile.update(time, delta)
    })

    if(this.playerInstance) this.playerInstance.update(time, delta)

    const currentStageId = store.getState().gameModel.currentStageId
    if(this.stage.stageId !== currentStageId) {
      this.scene.start(currentStageId, this.props)
    }

    if(store.getState().cobrowsing.isActivelyCobrowsing === false) {
      let currentPlayerClassId = store.getState().playerInterface.playerClassId
      if(this.playerInstance.entityClassId !== currentPlayerClassId) {
        store.dispatch(changePlayerClass({entityClassId: this.playerInstance.entityClassId}))
      }
    }
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
    this.destroyInstances()
    this.backgroundCanvasLayer.destroy()
    this.playgroundCanvasLayer.destroy()
    this.foregroundCanvasLayer.destroy()
    this.setPlayerGameLoaded(null)
  }

  pause() {
    if(this.physicsType === MATTER_PHYSICS) {
      this.matter.pause()
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physics.pause()
    }
  }
  
  resume() {
    if(this.physicsType === MATTER_PHYSICS) {
      this.matter.resume()
    }
    if(this.physicsType === ARCADE_PHYSICS) {
      this.physics.resume()
    }  
  }

  onStateChange(oldGameState, gameState) {
    if(gameState === START_STATE) {
      this.isPaused = true
      this.isPlaythrough = true
      if(this.hasLoadedOnce) {
        this.sendResetGameEvent()
      }
    }
    if(gameState === PLAYTHROUGH_PAUSED_STATE) {
      this.isPaused = true
    }
    if(gameState === PAUSED_STATE) {
      this.isPaused = true
    }
    if(gameState === PLAY_STATE) {
      this.isPaused = false
      this.isPlaythrough = false
    }
    if(gameState === STOPPED_STATE) {
      this.isPaused = true
      this.isPlaythrough = false
      this.sendResetGameEvent()
    }
    if(gameState === PLAYTHROUGH_PLAY_STATE) {
      this.isPaused = false
      this.isPlaythrough = true
    }
    if(gameState === GAME_OVER_STATE) {
      this.isPaused = true   
    }
    if(gameState === WIN_GAME_STATE) {
      this.isPaused = true
    }

    this.gameState = gameState
  }

  addSpriteToTypeLayer(entityClassId, phaserInstance, modifier) {
    const gameModel = store.getState().gameModel.gameModel
    const entityClass = gameModel.entityClasses[entityClassId]

    const layerToDepth = {
      [BACKGROUND_LAYER_CANVAS_ID]: BACKGROUND_LAYER_CANVAS_DEPTH + 1,
      [PLAYGROUND_LAYER_CANVAS_ID]: PLAYGROUND_LAYER_CANVAS_DEPTH + 1,
      [FOREGROUND_LAYER_CANVAS_ID]: FOREGROUND_LAYER_CANVAS_DEPTH + 1
    }

    if(modifier !== undefined) {
      phaserInstance.setDepth(layerToDepth[entityClass.graphics.layerId] + modifier)
    } else {
      phaserInstance.setDepth(layerToDepth[entityClass.graphics.layerId])
    }
  }
}