import Phaser from 'phaser';

import { PLAYER_INSTANCE_DID,  UI_LAYER_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, ON_PLAYTHROUGH, START_STATE, PAUSED_STATE, PLAY_STATE, PLAYTHROUGH_PLAY_STATE, GAME_OVER_STATE, WIN_GAME_STATE, PLAYTHROUGH_PAUSED_STATE, ANIMATION_CAMERA_SHAKE, ANIMATION_CONFETTI, EVENT_SPAWN_MODEL_IN_CAMERA, EVENT_SPAWN_MODEL_DRAG_FINISH, initialCameraZoneEntityId, UI_LAYER_ID, NON_LAYER_BRUSH_ID,  NON_LAYER_BRUSH_DEPTH, layerGroupIIDToDepth } from '../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { changePlayerEntity } from '../../store/actions/game/playerInterfaceActions';
import { changeCurrentStage } from '../../store/actions/game/gameModelActions';
import { editGameRoom, updateGameRoomPlayer } from '../../store/actions/game/gameRoomInstanceActions';
import { EntityInstance } from '../entities/EntityInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Stage } from '../entities/Stage';
import { ProjectileInstance } from '../entities/ProjectileInstance';
import JSConfetti from 'js-confetti'
import { directionalPlayerEntityId } from '../constants';
import { getLayerIdFromEraserId } from '../../utils';
import { PLAYGROUND_LAYER_GROUP_IID } from '../../constants/interfaceIds';

export class GameInstance extends Phaser.Scene {
  constructor(props) {
    super(props);

    this.playerInstance = null 

    this.entityInstances = []
    this.entityInstancesById = {}
    this.entityInstancesByTag = {}
    this.temporaryInstances = []
    this.temporaryInstancesById = {}
    this.temporaryInstancesByTag = {}

    this.layerInstancesById = {}
    this.layerInstancesByLayerGroupId = {}

    this.gameState = null

    this.relationsPopulated = {}

    this.colliderRegistrations = []

    this.physicsType = ARCADE_PHYSICS

    this.gameRoomInstance = props.gameRoomInstance

    this.lastUpdate = null
  }


  // --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// PLAYER
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  initializePlayerInstance(classData) {
    if(!classData) {
      const gameModel = this.getGameModel()
      const playerInterface = getCobrowsingState().playerInterface
      const currentStage = this.getCurrentStage()
      const zoneId = gameModel.stages[currentStage.stageId].playerSpawnZoneEntityId
      const zone = this.getRandomInstanceOfEntityId(zoneId)

      const {x, y} = this.getRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.entityModels[zoneId]))

      let lastPlayerEntityId = playerInterface.playerEntityModelId ? playerInterface.playerEntityModelId : directionalPlayerEntityId;

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_DID, {
        entityModelId: currentStage.playerEntityModelId ? currentStage.playerEntityModelId : lastPlayerEntityId,
        spawnX:x,
        spawnY: y
      });
    } else {

      const {entityModelId, spawnX, spawnY} = classData

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_DID, {
        entityModelId,
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

  setPlayerZoom({width, height}) {
    const boundaries = this.getCurrentStage().boundaries
    const zoom = 1/(width/boundaries.maxWidth)
    this.cameras.main.setZoom(zoom)
  }

  // --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// RELATIONS
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

  populateAndSortRelations() {
    const gameModel = this.getGameModel()
    const relations = gameModel.relations
    const effects = gameModel.effects
    const events = gameModel.events

    this.relationsByEventType = Object.keys(relations).reduce((relationsByEvent, relationId) => {
      const relation = relations[relationId]
      const populatedEvent = events[relation.eventId]
      const populatedEffects = relation.effectIds.map((effectId) => {
        let effect 
        if(relation.effects[effectId]) {
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
  }


  reregisterRelationships() {
    this.unregisterRelations()
    this.populateAndSortRelations()
    this.sortInstancesIntoTags()
    this.registerRelations()
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
    const gameModel = this.getGameModel()
    const currentStage = this.getCurrentStage()
    const releventInstances = this.entityInstances.filter((entityInstance) => {
      const entityModel = gameModel.entityModels[entityInstance.entityModelId]
      const layerGroupIID = currentStage.layers[entityModel.graphics.layerId].layerGroupIID
      return layerGroupIID === PLAYGROUND_LAYER_GROUP_IID
    }).map(({phaserInstance}) => phaserInstance)

    this.colliderRegistrations.push(
      this.physics.add.collider(this.playerInstance.phaserInstance, releventInstances, (phaserInstanceA, phaserInstanceB) => {
        phaserInstanceA.justCollided = true
        phaserInstanceB.justCollided = true
      })
    )

    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      if(layerInstance.isCollisionCanvas) layerInstance.registerColliders()
    })
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

    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      if(layerInstance.isCollisionCanvas) layerInstance.unregisterColliders()
    })
  }

  // --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// LAYERS
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  initializeLayers = () => {
    const currentStage = this.getCurrentStage()
    const layers = currentStage.layers

    this.layerInstancesById = {}
    Object.keys(layers).forEach((layerId) => {
      const layer = layers[layerId]
      if(layer.hasCollisionBody) {
        this.layerInstancesById[layerId] = new CollisionCanvas(
          this, 
          {
            layerId: layerId,
            layerGroupIID: layer.layerGroupIID,
            isCodrawingHost: this.gameRoomInstance.isHost,
            textureId: layer.textureId,
            boundaries: currentStage.boundaries,
            autoSave: true
          }
        )
      } else {
        this.layerInstancesById[layerId] = new CodrawingCanvas(
          this, 
          {
            layerId: layerId,
            layerGroupIID: layer.layerGroupIID,
            isCodrawingHost: this.gameRoomInstance.isHost, 
            textureId: layer.textureId,
            boundaries: currentStage.boundaries, 
            autoSave: true
          }
        )
      }
      const depth = this.getDepthFromLayerId(layerId)
      this.layerInstancesById[layerId].setDepth(depth)
      if(!this.layerInstancesByLayerGroupId[layer.layerGroupIID]) this.layerInstancesByLayerGroupId[layer.layerGroupIID] = [this.layerInstancesById[layerId]]
      else this.layerInstancesByLayerGroupId[layer.layerGroupIID].push(this.layerInstancesById[layerId])
    })

    this.entityInstanceGroup = this.add.group()
    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_LAYER_DEPTH)
  }

  getLayerInstanceByTextureId(textureId) {
    const layerInstanceId = Object.keys(this.layerInstancesById).find((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      if(layerInstance.textureId === textureId) return true
    })

    if(!layerInstanceId) console.error('didnt find layer with id', textureId, typeof textureId)

    return this.layerInstancesById[layerInstanceId]
  }
  
  getLayerInstanceByLayerId(layerId) {
    return this.layerInstancesById[layerId]
  }

  getDepthFromEraserId(eraserId) {
    return this.getDepthFromLayerId(getLayerIdFromEraserId(eraserId))
  }

  getDepthFromLayerId(layerId) {
    if(layerId === UI_LAYER_ID) return UI_LAYER_DEPTH
    if(layerId === NON_LAYER_BRUSH_ID) return NON_LAYER_BRUSH_DEPTH
    const layer = this.getCurrentStage().layers[layerId]
    return layerGroupIIDToDepth[layer.layerGroupIID]
  }


// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// INSTANCES 
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  // spawnEntityInstanceInsidePlayerCamera({entityModelId}) {
  //   const [x, y, width, height] = this.playerInstance.getCameraBoundaries()
  //   const xMix = Math.random() * width;
  //   const yMix = Math.random() * height;
  //   const spawnX = x + (yMix);
  //   const spawnY = y + (xMix);
  //   console.log({
  //     spawnX,
  //     spawnY,
  //     xMix,
  //     yMix,
  //     x,y,width,height
  //   })
  //   this.addEntityInstance(ENTITY_INSTANCE_DID+generateUniqueId(), { spawnX, spawnY, entityModelId}, true)
  // }
  initializeEntityInstances() {
    const currentStage = this.getCurrentStage()
    const entityInstances = currentStage.entityInstances
    Object.keys(entityInstances).forEach((entityInstanceId) => {
      const entityInstanceData = entityInstances[entityInstanceId]
      if(!entityInstanceData) {
        // LEGACY
        // if(entityInstanceId === 'oi/playspawnzone' || entityInstanceId === 'oi-playspawnzone') {
        //   console.log('ding this thing?')
        //   this.initializeEntityInstance(entityInstanceId, initialPlayerSpawnZone)
        //   return
        // } else {
          return console.error('Object missing!', entityInstanceId)
        // }
      } 
      if(entityInstanceId === PLAYER_INSTANCE_DID) {
        return console.error('hero got in?!')
      }
      if(!entityInstanceData.entityModelId) {
        return console.error('missing entityModelId!!', entityInstanceData)
      }

      this.initializeEntityInstance(entityInstanceId, entityInstanceData)
    });

    this.entityInstances = this.entityInstances.filter((entityInstance) => {
      return !!entityInstance
    })
  }

  
  sortInstancesIntoTags() {
    this.entityInstancesByTag = {}
    const entityModels = this.getGameModel().entityModels
    const allInstances = this.entityInstances.slice()
    allInstances.push(this.playerInstance)
    allInstances.forEach((entityInstance) => {
      const entityModel = entityModels[entityInstance.entityModelId]
      Object.keys(entityModel.relationTags).forEach((relationTagId) => {
        if(entityModel.relationTags[relationTagId]) {
          if(!this.entityInstancesByTag[relationTagId]) {
            this.entityInstancesByTag[relationTagId] = [entityInstance]
          } else {
            this.entityInstancesByTag[relationTagId].push(entityInstance)
          }
        }
      })
    })
  }

// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// INSTANCE - ADD/REMOVE
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  addTemporaryInstance(entityInstanceId, entityModelId) {
    const temporaryInstance = new ProjectileInstance(this, entityInstanceId, { entityModelId })
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

  initializeEntityInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const newPhaserObject = new EntityInstance(this, entityInstanceId, entityInstanceData, effectSpawned)
    this.entityInstances.push(newPhaserObject)
    this.entityInstancesById[entityInstanceId] = newPhaserObject

    return newPhaserObject
  }
  addEntityInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const instance = this.initializeEntityInstance(entityInstanceId, entityInstanceData, effectSpawned)
    this.reregisterRelationships()
    return instance
  }
  removeEntityInstance(entityInstanceId) {
    this.entityInstances = this.entityInstances.filter((object) => {
      return entityInstanceId !== object.entityInstanceId
    })
    this.getEntityInstance(entityInstanceId).destroy()
    this.entityInstancesById[entityInstanceId] = null
    this.reregisterRelationships()
  }

  updateEntityInstance(entityInstance, {x, y, rotation, isVisible, destroyAfterUpdate, transformEntityModelId}) {
    if(x) entityInstance.phaserInstance.x = x;
    if(y) entityInstance.phaserInstance.y = y;
    if(rotation) entityInstance.phaserInstance.rotation = rotation;
    entityInstance.setVisible(isVisible);
    entityInstance.isVisible = isVisible
    entityInstance.destroyAfterUpdate = destroyAfterUpdate 
    entityInstance.transformEntityModelId = transformEntityModelId
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

// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// INSTANCE - HELPERS
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  getEntityModelDepth(entityModelId) {
    const layers = this.getCurrentStage().layers
    const gameModel = this.getGameModel()
    const entityModel = gameModel.entityModels[entityModelId]

    if(entityModel.graphics.depthOverride) return entityModel.graphics.depthOverride
    const layerGroupIID =  layers[entityModel.graphics.layerId].layerGroupIID
    return layerGroupIIDToDepth[layerGroupIID] + entityModel.graphics.depthModifier
  }

  getEntityInstance(entityInstanceId) {
    if(entityInstanceId === PLAYER_INSTANCE_DID) {
      return this.playerInstance
    }
    
    return this.entityInstancesById[entityInstanceId]
  }

  getAllEntityInstancesOfEntityId(entityModelId) {
    let instances = [...this.entityInstances]
    if(entityModelId === this.playerInstance?.entityInstanceId || entityModelId === this.playerInstance?.entityModelId) {
      instances.push(this.playerInstance)
    }
    instances = instances.filter((instance) => {
      return instance.entityModelId === entityModelId
    })
    
    const projectiles= this.temporaryInstances.filter((instance) => {
      return instance.entityModelId === entityModelId
    })

    return instances.concat(projectiles)
  }

  getRandomInstanceOfEntityId(entityModelId) {
    const instances = this.getAllEntityInstancesOfEntityId(entityModelId)
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  forAllEntityInstancesMatchingEntityId(entityModelId, fx) {
   [this.playerInstance, ...this.entityInstances, ...this.temporaryInstances].forEach((entityInstance) => {
      if(entityInstance.entityModelId === entityModelId) {
        fx(entityInstance)
      } else if(entityInstance.entityInstanceId === entityModelId) {
        //player class
        fx(entityInstance)
      }
    })
  }


// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// GAME EVENTS
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  init(data) {
    this.firstStage = data.firstStage
  }

  create() {
    const currentStage = this.getCurrentStage()
    const gameModel = this.getGameModel()

    this.populateAndSortRelations()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.stage = new Stage(this, currentStage.stageId, currentStage)

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

    this.initializeEntityInstances()

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
    const playerCameraZone = gameModel.entityModels[initialCameraZoneEntityId]
    this.setPlayerZoom({...playerCameraZone.graphics});

    this.startPlaythroughStartEffects()

    setTimeout(() => {
      this.setPlayerGameLoaded(this.gameRoomInstance.id)
      this.hasLoadedOnce = true
    })
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
      case EVENT_SPAWN_MODEL_IN_CAMERA: 
        this.spawnEntityInstanceInsidePlayerCamera(data)
        return
      case EVENT_SPAWN_MODEL_DRAG_FINISH: 
        const entityInstance = this.getEntityInstance(data.entityInstanceId)
        entityInstance.phaserInstance.x = data.x;
        entityInstance.phaserInstance.y = data.y;
        return
      default: 
        return
    }
  }

  startPlaythroughStartEffects() {
    if(this.isPlaythrough && this.firstStage) {
      this.relationsByEventType[ON_PLAYTHROUGH]?.forEach((relation) => {
        this.playerInstance.runRelation(
          relation,
        )
      })
    }
  }

  update(time, delta) {
    this.lastUpdate = Date.now()
    
    // FOR CLIENTS
    if(!this.isPaused) super.update(time, delta)

    const gameViewEditor = getCobrowsingState().gameViewEditor

    const layerInvisibility = gameViewEditor.layerInvisibility

    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      layerInstance.setVisible(!layerInvisibility[layerId])
    })

    this.stage.update()

    this.entityInstances.forEach((entityInstance) => {
      entityInstance.update(time, delta);
    })

    this.temporaryInstances.forEach((projectile) => {
      projectile.update(time, delta)
    })

    if(this.playerInstance) this.playerInstance.update(time, delta)

    const currentStageId = this.getCurrentStage().stageId
    if(this.stage.stageId !== currentStageId) {
      this.scene.start(currentStageId, this.props)
    }

    if(this.getState().cobrowsing.isActivelyCobrowsing === false) {
      let currentPlayerEntityId = this.getState().playerInterface.playerEntityModelId
      if(this.playerInstance.entityModelId !== currentPlayerEntityId) {
        store.dispatch(changePlayerEntity({entityModelId: this.playerInstance.entityModelId}))
      }
    }
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
      if(entityInstance.transformEntityModelId && entityInstance.transformEntityModelId !== entityInstance.entityModelId) {
        entityInstance.reclass(entityInstance.transformEntityModelId)
      } else if(entityInstance.destroyAfterUpdate) {
        entityInstance.destroyInGame()
      }
    })

    if(this.playerInstance.transformEntityModelId && this.playerInstance.entityModelId !== this.playerInstance.transformEntityModelId) {
      this.playerInstance.reclass(this.playerInstance.transformEntityModelId)
    }
  }

  respawn() {
    this.entityInstances.forEach((entityInstance) => {
      entityInstance.x = entityInstance.spawnX
      entityInstance.y = entityInstance.spawnY
    })
    const gameModel = this.getGameModel()
    this.stage.ensureSpawnZoneExists()
    const zoneId = gameModel.stages[this.stage.stageId].playerSpawnZoneEntityId
    const zone = this.scene.getRandomInstanceOfEntityId(zoneId)
    this.playerInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.entityModels[zoneId]))
  }

  reset = () => {
    // this.registry.destroy(); // destroy registry
    // this.events.off(); // disable all active events
    // this.scene.restart(); // restart current scene
    // this.unregisterEvents()
    this.destroyInstances()

    this.initializeEntityInstances()
    this.initializePlayerInstance()

    this.reregisterRelationships()
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
    this.destroyInstances()
    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      layerInstance.destroy()
    })
    this.layerInstancesById = {}
    this.layerInstancesByLayerGroupId = {}
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




// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// REDUX STORE
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  sendResetGameEvent() {
    // this updates here because all players are watching the current stage right now
    const startingStageId = this.getGameModel().player.startingStageId
    store.dispatch(changeCurrentStage(startingStageId))

    if(this.getState().gameRoomInstance.gameRoomInstance?.id) {
      store.dispatch(editGameRoom(this.getState().gameRoomInstance.gameRoomInstance.id, {
        gameResetDate: Date.now()
      }))
    } else {
      this.reset()
    }

    this.startPlaythroughStartEffects()
  }   

  getRandomPosition(x, y, w, h) {
    const xPlus = Math.random() * w
    const yPlus = Math.random() * h

    return {
      x: x + xPlus,
      y: y + yPlus
    }
  }

  getState() {
    return store.getState()
  }

  getCurrentStage() {
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    return gameModel.stages[stageId]
  }

  getGameModel() {
    return store.getState().gameModel.gameModel
  }

  getEntityModel(entityModelId) {
    return this.getGameModel().entityModels[entityModelId]
  }

  setPlayerGameLoaded(arcadeGameMongoId) {
    store.dispatch(updateGameRoomPlayer({
      gameRoomInstanceInstanceId: this.gameRoomInstance.id,
      userMongoId: store.getState().auth.me.id,
      user: {
        loadedGameId: arcadeGameMongoId
      }
    }))
  }
}