import Phaser from 'phaser';

import { PLAYER_INSTANCE_DID,
    UI_LAYER_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, ON_PLAYTHROUGH,
     PLAYTHROUGH_START_STATE, PAUSED_STATE, PLAY_STATE, PLAYTHROUGH_PLAY_STATE, 
     GAME_END_STATE, PLAYTHROUGH_PAUSED_STATE, ANIMATION_CAMERA_SHAKE, ANIMATION_CONFETTI,
      EVENT_SPAWN_MODEL_DRAG_FINISH, initialCameraZoneEntityId, UI_LAYER_ID, NON_LAYER_BRUSH_ID, 
      NON_LAYER_BRUSH_DEPTH, layerGroupIIDToDepth, EFFECT_SPAWN, effectInterfaceData, 
      EFFECT_STICK_TO, EFFECT_TELEPORT, EFFECT_DESTROY, EFFECT_TRANSFORM, SPAWNED_INSTANCE_DID, SPAWN_ZONE_A_SELECT, 
      SPAWN_ZONE_B_SELECT, EFFECT_CUTSCENE, EFFECT_CAMERA_SHAKE, EFFECT_END_GAME, EFFECT_SWITCH_STAGE, RUN_GAME_INSTANCE_ACTION,
       ON_STEP_BEGINS, defaultEvent, EFFECT_OPEN_TRANSITION, EFFECT_CLOSE_TRANSITION, EFFECT_PAUSE_GAME, EFFECT_UNPAUSE_GAME, ON_CUTSCENE_END, EFFECT_TRANSFORM_TEMPORARY_START, EFFECT_TRANSFORM_TEMPORARY_END, ON_STAGE_LOADED, DIRECTIONAL_PLAYER_ENTITY_RID } from '../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { changePlayerEntity, clearCutscenes, openCutscene } from '../../store/actions/game/playerInterfaceActions';
import { changeCurrentStage } from '../../store/actions/game/gameRoomInstanceActions';
import { changeGameStatus, editGameRoom, updateGameRoomPlayer } from '../../store/actions/game/gameRoomInstanceActions';
import { EntityInstance } from '../entities/EntityInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Stage } from '../entities/Stage';
import { ProjectileInstance } from '../entities/ProjectileInstance';
import JSConfetti from 'js-confetti'
import { generateUniqueId, getGameModelSize, getLayerIdFromEraserId, isZoneEntityId } from '../../utils';
import { NO_RELATION_TAG_EFFECT_IID, PLAYGROUND_LAYER_GROUP_IID } from '../../constants/interfaceIds';
import _, { last, set } from 'lodash';
import { updateLobbyMember } from '../../store/actions/experience/lobbyInstanceActions';

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

    this.gameStatus = null

    this.initialized = false

    this.relationsPopulated = {}

    this.colliderRegistrations = []

    this.physicsType = ARCADE_PHYSICS

    this.gameRoomInstance = props.gameRoomInstance

    this.lastUpdate = null
    this.lastDelta = null

    this.stageId = props.stageId

    this.timeToTriggerAgain = {}
  }


// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// PLAYER
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  initializePlayerInstance(entityInstanceData) {
    if(entityInstanceData) {
      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_DID, entityInstanceData);
      this.playerInstance.setLerp(
        entityInstanceData.cameraScrollX,
        entityInstanceData.cameraScrollY,
      )
    } else if(this.gameRoomInstance.isHost) {
      const gameModel = this.getGameModel()
      const playerInterface = getCobrowsingState().playerInterface
      const currentStage = this.getStage()
      const zoneId = gameModel.stages[currentStage.stageId].playerSpawnZoneEntityId
      const zone = this.getRandomInstanceOfEntityId(zoneId)


      const lastPlayerEntityId = playerInterface.playerEntityModelId
      const lastPlayerEntityModel = gameModel.entityModels[lastPlayerEntityId]

      const { x, y } = zone.getInnerCoordinates(lastPlayerEntityModel) 

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_DID, {
        entityModelId: currentStage.playerEntityModelId ? currentStage.playerEntityModelId : lastPlayerEntityId,
        spawnX:x,
        spawnY:y
      });
      
      this.playerInstance.setLerp()
    }
  }

  addPlayerInstance(entityInstanceData) {
    this.initializePlayerInstance(entityInstanceData)
    this.reregisterRelationships()
  }

  removePlayerInstance() {
    // this.playerInstance.particles.destroy()
    this.entityInstances = this.entityInstances.filter((object) => {
      return this.playerInstance.entityInstanceId !== object.entityInstanceId
    })
    this.playerInstance.destroy()
    this.playerInstance = null
  }

  setPlayerZoom({width, height}) {
    const boundaries = this.getStage().boundaries
    const zoom = 1/(height/boundaries.maxHeight)
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

      if(relation.isRemoved) {
        return relationsByEvent
      }

      const populatedEvent = events[relation.eventId]
      const populatedEffects = relation.effectIds.map((effectId) => {
        let effect 
        if(relation.effects?.[effectId]) {
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
    this.entityInstancesByTag = this.sortInstancesIntoTags()
    this.registerRelations()
  }

  registerRelations(newEntityInstances) {
    if(!newEntityInstances) newEntityInstances = this.entityInstances
    const newEntityInstancesByTag = this.sortInstancesIntoTags(newEntityInstances)
    
    // we cant reregister all relations, because a lot of them are already registered
    // but we can register 
    // 1) the relations that the new entity isntances are mentioned in
    // 2) the relation that the new entity instance has ON ALL CURRENT INSTANCES
            // because THOSE relations have DEFINITELY NOT been registered yet. Cuz the instnace just showed up

    /// RELATIONS
    this.playerInstance?.registerRelations(newEntityInstancesByTag)

    this.entityInstances.forEach((instance) => {
      if(newEntityInstances.includes(instance)) {
        instance.registerRelations(this.entityInstancesByTag)
      } else {
        instance.registerRelations(newEntityInstancesByTag)
      }
    })

    this.temporaryInstances.forEach((instance) => {
      if(newEntityInstances.includes(instance)) {
        instance.registerRelations(this.entityInstancesByTag)
      } else {
        instance.registerRelations(newEntityInstancesByTag)
      }
    })

    /// COLLIDERS
    this.playerInstance?.registerColliders(newEntityInstancesByTag)

    this.entityInstances.forEach((instance) => {
      if(newEntityInstances.includes(instance)) {
        instance.registerColliders(this.entityInstancesByTag)
      } else {
        instance.registerColliders(newEntityInstancesByTag)
      }
    })

    this.temporaryInstances.forEach((instance) => {
      if(newEntityInstances.includes(instance)) {
        instance.registerColliders(this.entityInstancesByTag)
      } else {
        instance.registerColliders(newEntityInstancesByTag)
      }
    })

    if(this.playerInstance) {
      // all physicsSprites on playground layer collide with the player
      const gameModel = this.getGameModel()
      const releventInstances = newEntityInstances.filter((entityInstance) => {
        const entityModel = gameModel.entityModels[entityInstance.entityModelId]
        const layerGroupIID = entityModel.graphics.layerGroupIID
        return layerGroupIID === PLAYGROUND_LAYER_GROUP_IID
      }).map(({physicsSprite}) => physicsSprite)

      this.colliderRegistrations.push(
        this.physics.add.collider(this.playerInstance.physicsSprite, releventInstances, (physicsSpriteA, physicsSpriteB) => {
          physicsSpriteA.justCollided = true
          physicsSpriteB.justCollided = true
        })
      )

      
    }
    
    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      if(layerInstance.isCollisionCanvas) {
        if(newEntityInstances) layerInstance.registerColliders(newEntityInstances)
        if(this.playerInstance) {
          layerInstance.registerColliders([this.playerInstance])
        }
      }
    })
  }

  unregisterRelations() {
    /// RELATIONS AND COLLIDERS
    this.playerInstance?.unregister()

    this.entityInstances.forEach((instance) => {
      instance.unregister()
    })

    this.temporaryInstances.forEach((instance) => {
      instance.unregister()
    })

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
    const gameModel = this.getGameModel()
    const stage = this.getStage()
    const layers = gameModel.layers

    this.layerInstancesById = {}
    Object.keys(layers).forEach((layerId) => {
      const layer = layers[layerId]
      if(layer.stageId !== stage.stageId) return
      if(layer.hasCollisionBody) {
        this.layerInstancesById[layerId] = new CollisionCanvas(
          this, 
          {
            layerId: layerId,
            layerGroupIID: layer.layerGroupIID,
            isCodrawingHost: this.gameRoomInstance.isHost,
            textureId: layer.textureId,
            boundaries: stage.boundaries,
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
            boundaries: stage.boundaries, 
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

    // if(!layerInstanceId) console.error('didnt find layer with id', textureId, typeof textureId)

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
    const layer = this.getGameModel().layers[layerId]
    return layerGroupIIDToDepth[layer.layerGroupIID]
  }


// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// INSTANCES 
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------

  initializeEntityInstances() {
    const entityInstances = this.gameState.entityInstances
    entityInstances.forEach((entityInstanceData) => {
      const entityInstanceId = entityInstanceData.entityInstanceId

      if(!entityInstanceData) {
        return console.error('Object missing!', entityInstanceData)
      }

      if(entityInstanceId === PLAYER_INSTANCE_DID) {
        return console.error('hero got in?!')
      }

      if(!entityInstanceData.entityModelId) {
        return console.error('missing entityModelId!!', entityInstanceId, entityInstanceData)
      }
      
      this.initializeEntityInstance(entityInstanceId, entityInstanceData)
    });

    this.entityInstances = this.entityInstances.filter((entityInstance) => {
      return !!entityInstance
    })
  }

  sortInstancesIntoTags(entityInstances) {
    if(!entityInstances) {
      entityInstances = this.entityInstances.slice()
      if(this.playerInstance) entityInstances.push(this.playerInstance)
    }
    const entityInstancesByTag = {}
    const entityModels = this.getGameModel().entityModels
    entityInstances.forEach((entityInstance) => {
      const entityModel = entityModels[entityInstance.entityModelId]
      Object.keys(entityModel.relationTags).forEach((relationTagId) => {
        if(entityModel.relationTags[relationTagId]) {
          if(!entityInstancesByTag[relationTagId]) {
            entityInstancesByTag[relationTagId] = [entityInstance]
          } else {
            entityInstancesByTag[relationTagId].push(entityInstance)
          }
        }
      })
    })

    return entityInstancesByTag
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
    
    this.addInstancesToEntityInstanceByTag([temporaryInstance])
    this.registerRelations([temporaryInstance])
    return temporaryInstance
  }

  removeTemporaryInstance(entityInstanceId) {
    this.temporaryInstances = this.temporaryInstances.filter((temporaryInstance) => {
      return entityInstanceId !== temporaryInstance.entityInstanceId
    })
    this.temporaryInstancesById[entityInstanceId].destroy()
    this.temporaryInstancesById[entityInstanceId] = null
    // this.registerRelations()
  }

  initializeEntityInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const newPhaserObject = new EntityInstance(this, entityInstanceId, entityInstanceData, effectSpawned)
    this.entityInstances.push(newPhaserObject)
    this.entityInstancesById[entityInstanceId] = newPhaserObject
    return newPhaserObject
  }

  addEntityInstance(entityInstanceId, entityInstanceData, effectSpawned) {
    const instance = this.initializeEntityInstance(entityInstanceId, entityInstanceData, effectSpawned)

    this.addInstancesToEntityInstanceByTag([instance])
    // this is written the way it is because spawning causes issues when you rereregister ALL of the relations
    this.registerRelations([instance])
    return instance
  }

  removeEntityInstance(entityInstanceId, skipReregisterRelationships) {
    this.entityInstances = this.entityInstances.filter((object) => {
      return entityInstanceId !== object.entityInstanceId
    })
    const entityInstance = this.getEntityInstance(entityInstanceId)
    if(!entityInstance) return console.error('no entity instance to remove', entityInstanceId)
    entityInstance.destroy()
    this.entityInstancesById[entityInstanceId] = null
    if(!skipReregisterRelationships) this.reregisterRelationships()
  }

  updateEntityInstance(entityInstance, {x, y, rotation, isVisible, destroyAfterUpdate, transformEntityModelId}) {
    if(x) entityInstance.physicsSprite.x = x;
    if(y) entityInstance.physicsSprite.y = y;
    if(rotation) entityInstance.physicsSprite.rotation = rotation;
    entityInstance.setVisible(isVisible);
    entityInstance.isVisible = isVisible
    entityInstance.destroyAfterUpdate = destroyAfterUpdate 
    entityInstance.transformEntityModelId = transformEntityModelId
  }

  destroyInstances() {
    this.playerInstance?.destroy()
    this.playerInstance = null

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
}

addInstancesToEntityInstanceByTag(instances) {
  instances.forEach((instance) => {
  const entityModel = this.getGameModel().entityModels[instance.entityModelId]
  Object.keys(entityModel.relationTags).forEach((relationTagId) => {
    if(this.entityInstancesByTag[relationTagId]) {
      if(!this.entityInstancesByTag[relationTagId].includes(instance)) {
        this.entityInstancesByTag[relationTagId].push(instance)
      }
    } else {
      this.entityInstancesByTag[relationTagId] = [instance]
    }
    })
  })
}

// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// INSTANCE - HELPERS
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------
  getEntityModelDepth(entityModelId) {
    const gameModel = this.getGameModel()
    const entityModel = gameModel.entityModels[entityModelId]

    const layerGroupIID =  entityModel.graphics.layerGroupIID
    return layerGroupIIDToDepth[layerGroupIID] + entityModel.graphics.depthModifier
  }

  getEntityInstance(entityInstanceId) {
    if(entityInstanceId === PLAYER_INSTANCE_DID) {
      return this.playerInstance
    }
    
    return this.entityInstancesById[entityInstanceId] || this.temporaryInstancesById[entityInstanceId]
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
      if(entityInstance.effectSpawned) return
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
    if(this.gameState.initialized) {
      this.initializeWithGameState()
    }
  }
 
  initializeWithGameState() {
    this.initialized = true

    this.populateAndSortRelations()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.stage = new Stage(this, this.stageId)


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
    if(this.gameRoomInstance.isHost) {
      this.initializePlayerInstance()
      this.entityInstancesByTag = this.sortInstancesIntoTags()
      this.registerRelations()
      this.initializeCamera()
    }

    setTimeout(() => {
      if(this.gameRoomInstance.isOnlineMultiplayer) {
        this.setPlayerGameLoaded(this.gameRoomInstance.arcadeGameMongoId)
      }
      this.hasLoadedOnce = true
    })

    this.events.on('wake', () => {
      if(this.gameRoomInstance.isHost) {
        this.reset()
      }
      setTimeout(() => {
        this.runOnStageSwitchEffects()
      })
    })
  }

  initializeCamera() {
    const currentStage = this.getStage()
    const gameModel = this.getGameModel()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CAMERA
    ////////////////////////////////////////////////////////////
    const stageWidth = currentStage.boundaries.width
    const stageHeight = currentStage.boundaries.height
    const stageX = currentStage.boundaries.x
    const stageY = currentStage.boundaries.y

    this.cameras.main.setBounds(stageX, stageY, stageWidth, stageHeight);
    this.cameras.main.pan(this.playerInstance.physicsSprite.x, this.playerInstance.physicsSprite.y, 0)
    const playerCamera = gameModel.entityModels[this.playerInstance.entityModelId].camera
    this.setPlayerZoom(playerCamera);

    this.runOnPlaythroughStartEffects()
  }

  runGameInstanceEvent({gameRoomInstanceEventType, data}) {
    switch(gameRoomInstanceEventType) {
      case ANIMATION_CAMERA_SHAKE: 
        let intensity = data.intensity/333
        const gameBoundaryWidth = this.getStage().boundaries.width

        const { width } = getGameModelSize(store.getState().gameModel.gameModel)
        const gameSizePercent = gameBoundaryWidth/width
        
        intensity = intensity * gameSizePercent

        const isGridViewOn = store.getState().gameViewEditor.isGridViewOn
        if(isGridViewOn) {
          this.editorCamera.shake(data.duration, intensity);
        } else {
          this.cameras.main.shake(data.duration, intensity);
        }
        return
      case ANIMATION_CONFETTI:
        const jsConfetti = new JSConfetti()
        jsConfetti.addConfetti();
        return
      case EVENT_SPAWN_MODEL_DRAG_FINISH: 
        const entityInstance = this.getEntityInstance(data.entityInstanceId)
        if(entityInstance?.physicsSprite) {
          entityInstance.physicsSprite.x = data.x;
          entityInstance.physicsSprite.y = data.y;
        } else {
          console.error('were trying to move an instance that doesnt exist', data.entityInstanceId)
        }
        return
      case RUN_GAME_INSTANCE_ACTION: 
        const effect = this.getGameModel().effects[data.effectId]
        const event = {
          ...defaultEvent,
          eventType: ON_STEP_BEGINS
        }

        this.runAccuteEffect({
          relation: {
            effect,
            event,
            relationId: generateUniqueId()
          },
        })

      default: 
        return
    }
  }

  switchStage(stageId) {
    store.dispatch(clearCutscenes())
    this.scene.switch(stageId)
  }

  runOnStageSwitchEffects() {
    if(this.isPlaythrough) {
      const stageId = this.stageId
      this.relationsByEventType[ON_STAGE_LOADED]?.forEach((relation) => {
        if(relation.event.stageId === stageId) {
          this.runRelation(relation)
        }
      })
    }
  }

  runOnPlaythroughStartEffects() {
    if(this.isPlaythrough && this.firstStage) {
      this.relationsByEventType[ON_PLAYTHROUGH]?.forEach((relation) => {
        this.runRelation(relation)
      })
    }
    this.runOnStageSwitchEffects()
  }

  update(time, delta) {
    const currentStageId = store.getState().gameRoomInstance.gameRoomInstance.currentStageId
    if(this.stage?.stageId !== currentStageId) {
      this.switchStage(currentStageId)
    }

    if(!this.initialized) return 

    this.lastUpdate = Date.now()
    this.lastDelta = delta
    
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

    if(this.playerInstance) {
      this.playerInstance.update(time, delta)
      if(this.getState().cobrowsing.isActivelyCobrowsing === false) {
        let currentPlayerEntityId = this.getState().playerInterface.playerEntityModelId
        if(this.playerInstance.entityModelId !== currentPlayerEntityId) {
          store.dispatch(changePlayerEntity({entityModelId: this.playerInstance.entityModelId, gameInstanceId: this.gameInstanceId}))
        }
      }
    }
  }

   afterGameInstanceUpdateEffects() {
    if(this.playerInstance?.destroyAfterUpdate) {
      this.playerInstance.destroyInGame()
    }

    this.temporaryInstances.forEach((temporaryInstance) => {
      if(temporaryInstance.destroyTime < Date.now()) {
        temporaryInstance.destroyAfterUpdate = true
      }
    });
    
    [...this.temporaryInstances, ...this.entityInstances].forEach((entityInstance) => {
      if(entityInstance.transformEntityModelId && entityInstance.transformEntityModelId !== entityInstance.entityModelId) {
        entityInstance.transformEntityModel(entityInstance.transformEntityModelId)
      } else if(entityInstance.destroyAfterUpdate) {
        entityInstance.destroyInGame()
      }
    })

    if(this.playerInstance && this.playerInstance.transformEntityModelId && this.playerInstance.entityModelId !== this.playerInstance.transformEntityModelId) {
      this.playerInstance.transformEntityModel(this.playerInstance.transformEntityModelId)
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
    const zone = this.getRandomInstanceOfEntityId(zoneId)
    const playerEntityModel = gameModel.entityModeplayerEs[this.playerInstance.entityModelId]
    const { x, y } = zone.getInnerCoordinates(playerEntityModel, this.playerInstance)
    this.playerInstance.setPosition(x, y)
  }

  reset = () => {
    // this.registry.destroy(); // destroy registry
    // this.events.off(); // disable all active events
    // this.scene.restart(); // restart current scene
    // this.unregisterEvents()
    this.timeToTriggerAgain = {}

    this.destroyInstances()

    this.gameState = this.getStartingGameState()
    this.gameState.gameInstanceId = this.gameInstanceId

    this.initializeEntityInstances()
    this.initializePlayerInstance()

    this.reregisterRelationships()

    if(this.editorCameraControls) {
      this.editorCameraControls.start();
    }
  }

  getStartingGameState() {
    const gameModel = this.getGameModel()
    const stages = gameModel.stages

    const stageId = this.stageId 

    const entityInstances = Object.keys(stages[stageId].entityInstances).map((entityInstanceId) => {
      const entityInstance = stages[stageId].entityInstances[entityInstanceId]
      const { spawnX, spawnY, width, height, entityModelId } = entityInstance
      return {
        entityInstanceId,
        x: spawnX,
        y: spawnY,
        spawnX,
        spawnY,
        width,
        height,
        entityModelId,
        removed: false,
        effectSpawned: false,
        isVisible: true,
        transformEntityModelId: null,
        destroyAfterUpdate: false
      }
    })
    
    return {
      playerInstance: {},
      entityInstances,
      temporaryInstances: []
    }
  }

  unload() {
    // this.destroyed = true 
    // if(this.destroyed) return
    // this.destroyScenes()

    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.destroyInstances()
    Object.keys(this.layerInstancesById).forEach((layerId) => {
      const layerInstance = this.layerInstancesById[layerId]
      layerInstance.destroy()
    })
    this.layerInstancesById = {}
    this.layerInstancesByLayerGroupId = {}
  }

  // destroyScenes() {
  //   const scenes = this.game.scene.scenes

  //   scenes.forEach((scene) => {
  //     console.log('destroying scene', scene.key)
  //     scene.unload()
  //   })
  // }

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

  onStateChange(oldGameStatus, gameStatus) {
    if(gameStatus === PLAYTHROUGH_START_STATE) {
      this.isPaused = true
      this.isPlaythrough = true
      if(this.hasLoadedOnce) {
        this.sendResetGameEvent()
      }
    }

    if(gameStatus === PLAYTHROUGH_PAUSED_STATE) {
      this.isPaused = true
    }
    if(gameStatus === PAUSED_STATE) {
      this.isPaused = true
    }
    if(gameStatus === PLAY_STATE) {
      this.isPaused = false
      this.isPlaythrough = false
    }
    if(gameStatus === PLAYTHROUGH_PLAY_STATE) {
      this.isPaused = false
      this.isPlaythrough = true
    }
    if(gameStatus === GAME_END_STATE) {
      this.isPaused = true   
    }

    this.gameStatus = gameStatus
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

    const gameRoomInstance = this.getState().gameRoomInstance.gameRoomInstance
    if(gameRoomInstance?.id) {
      store.dispatch(editGameRoom(gameRoomInstance.id, {
        gameResetVersion: gameRoomInstance.gameResetVersion + 1
      }))
    } else {
      setTimeout(() => {
        this.reset()
      })
    }

    setTimeout(() => {
      this.runOnPlaythroughStartEffects()
    })
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

  getStage() {
    const stageId = this.stage.stageId
    const state = store.getState()
    const gameModel = state.gameModel.gameModel
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
      gameRoomInstanceMongoId: this.gameRoomInstance.id,
      userMongoId: store.getState().auth.me.id,
      user: {
        loadedGameMongoId: arcadeGameMongoId
      }
    }))
  }

  /////////
  //// EFFECTS

  getEffectedphysicsSprites = ({physicsSpriteA, physicsSpriteB, sidesA, sidesB, effect}) => {
    const physicsSprites = []
    const alternatephysicsSpriteData = {}
    if(effect.effectTagA) {
      physicsSprites.push(physicsSpriteA)
      alternatephysicsSpriteData.physicsSprite = physicsSpriteB
      alternatephysicsSpriteData.sides = sidesB
    }


    if(effect.effectTagB) {
      physicsSprites.push(physicsSpriteB)
      alternatephysicsSpriteData.physicsSprite = physicsSpriteA
      alternatephysicsSpriteData.sides = sidesA
    }

    let remoteEffectedRelationTagIds = effect.remoteEffectedRelationTagIds?.slice()
    if(effect.remoteEffectedRelationTagIdsExtension) {
      remoteEffectedRelationTagIds.push(...effect.remoteEffectedRelationTagIdsExtension)
    }

    if(remoteEffectedRelationTagIds?.length && effectInterfaceData[effect.effectBehavior].nonRemote) {
      remoteEffectedRelationTagIds?.forEach((relationTagId) => {
        this.entityInstancesByTag[relationTagId]?.forEach((entityInstance) => {
          physicsSprites.push(entityInstance.physicsSprite)
        })
      })
    }

    return [physicsSprites, alternatephysicsSpriteData]
  }

  runTargetlessAccuteEffect({relation, physicsSpriteA, physicsSpriteB}) {
    const effect = relation.effect

    if(effect.effectBehavior === EFFECT_CAMERA_SHAKE) {
      this.callGameInstanceEvent({
        gameRoomInstanceEventType: ANIMATION_CAMERA_SHAKE,
        data: {
          duration: 1000,
          intensity: 1,
        }
      })
    }

    if(effect.effectBehavior === EFFECT_UNPAUSE_GAME) {
      if(this.isPlaythrough) {
        store.dispatch(changeGameStatus(PLAYTHROUGH_PLAY_STATE))
      } else {
        store.dispatch(changeGameStatus(PLAY_STATE))
      }
    } else if(effect.effectBehavior === EFFECT_PAUSE_GAME) {
      store.dispatch(changeGameStatus(PAUSED_STATE))
    } else if(effect.effectBehavior === EFFECT_END_GAME) {
      store.dispatch(changeGameStatus(GAME_END_STATE, effect.text))
      this.sendResetGameEvent()
    } else if(effect.effectBehavior === EFFECT_SWITCH_STAGE) {
      store.dispatch(changeCurrentStage(effect.stageId))
      store.dispatch(clearCutscenes())
    }
    
    // if(effect.effectBehavior === EFFECT_CHANGE_GAME) {
    //   store.dispatch(editGameRoom(this.scene.gameRoomInstance.id, {
    //     arcadeGameMongoId: effect.arcadeGameMongoId
    //   }))
    // }
    
    if(effect.effectBehavior === EFFECT_OPEN_TRANSITION) {
      const state = store.getState()
      store.dispatch(updateLobbyMember({
        lobbyInstanceMongoId: state.lobbyInstance.lobbyInstance?.id,
        userMongoId: state.auth.me?.id, 
        member: {
          inTransitionView: true
        }
      }))
    }

    if(effect.effectBehavior === EFFECT_CLOSE_TRANSITION) {
      const state = store.getState()
      store.dispatch(updateLobbyMember({
        lobbyInstanceMongoId: state.lobbyInstance.lobbyInstance?.id,
        userMongoId: state.auth.me?.id, 
        member: {
          inTransitionView: false
        }
      }))
    }

    // NARRATIVE
    if(effect.effectBehavior === EFFECT_CUTSCENE) {
      if(effect.cutsceneId) store.dispatch(openCutscene(physicsSpriteB?.entityModelId, effect.cutsceneId))
    }

    if(effect.effectBehavior === EFFECT_SPAWN) {
      const spawningEntityId = effect.spawnEntityModelId
      let zone 

      if(effect.spawnZoneSelectorType === SPAWN_ZONE_A_SELECT && physicsSpriteA) {
        if(isZoneEntityId(physicsSpriteA.entityModelId)) {
          zone = physicsSpriteA
        } 
      } else if(effect.spawnZoneSelectorType === SPAWN_ZONE_B_SELECT && physicsSpriteB) {
        if(isZoneEntityId(physicsSpriteB.entityModelId)) {
          zone = physicsSpriteB
        } 
      } else {
          //  if(effect.spawnZoneSelectorType === SPAWN_ZONE_RANDOM_SELECT) {
        zone = this.getRandomInstanceOfEntityId(effect.zoneEntityModelId)
      // } else
      }

      if(!zone) return console.log('no zone exists for that')
      const gameModel = store.getState().gameModel.gameModel
      const entityModel = gameModel.entityModels[spawningEntityId]
      const { x, y } = zone.getInnerCoordinates(entityModel)
      
      const modifiedEntityData = { spawnX: x, spawnY: y, entityModelId: spawningEntityId }
      this.addEntityInstance(SPAWNED_INSTANCE_DID+generateUniqueId(), modifiedEntityData, true)
      // const modifiedEntityData = { spawnX: null, spawnY: null, entityModelId: spawningEntityId }

    }
  }

  runRelation(relation) {
    Object.keys(relation.effects).forEach((effectId) => {
      const effect = relation.effects[effectId]
      if(!effect) return

      this.runAccuteEffect({
        relation: {
          ...relation,
          effect,
          effects: undefined
        },
        physicsSpriteA: this.playerInstance.physicsSprite,
      })
    })
  }

  runAccuteEffect({
    relation,
    physicsSpriteA,
    physicsSpriteB,
    sidesA = [],
    sidesB = []
  }) {
    const effect = relation.effect
    const scene = this

    const effectTypeInterfaceData = effectInterfaceData[effect.effectBehavior]
    if(!this.gameRoomInstance.isHost && !effectTypeInterfaceData.runOnClient) return

    if(this.timeToTriggerAgain[effect.effectId]) {
      if(this.timeToTriggerAgain[effect.effectId] > Date.now()) {
        return
      }
    }

    // order matters here!! 
    // if the only once is triggered before this then the delay counts as one
    if(relation.effect.effectDelay) {
      setTimeout(() => {
        const delayedRelation = _.cloneDeep(relation)
        delayedRelation.effect.effectDelay = null
        this.runAccuteEffect({
          relation: delayedRelation,
          physicsSpriteA,
          physicsSpriteB,
          sidesA,
          sidesB
        })
      }, relation.effect.effectDelay)
      return
    }

    if(relation.event.onlyOnce) {
      this.timeToTriggerAgain[effect.effectId] = Date.now() + 10000000000000
    } else {
      if(relation.effect.effectBehavior === EFFECT_SPAWN) {
        const effectCooldown = relation.effect.effectCooldown || 200
        this.timeToTriggerAgain[effect.effectId] = Date.now() + effectCooldown
      } else if(relation.effect.effectCooldown) {
        this.timeToTriggerAgain[effect.effectId] = Date.now() + relation.effect.effectCooldown
      }
    }

    if(effectTypeInterfaceData.targetableType === NO_RELATION_TAG_EFFECT_IID) {
      return this.runTargetlessAccuteEffect({
        relation,
        physicsSpriteA,
        physicsSpriteB,
      })
    }

    const [physicsSprites] = this.getEffectedphysicsSprites({
      physicsSpriteA,
      physicsSpriteB,
      sidesA,
      sidesB,
      effect
    })

    const runEffect = (physicsSprite) =>  {
      if(effect.effectBehavior === EFFECT_STICK_TO) {
        physicsSprite.body.setVelocityY(0)
        physicsSprite.body.setVelocityX(0)
      }

      if(effect.effectBehavior === EFFECT_TELEPORT) {
        const gameModel = store.getState().gameModel.gameModel
        const entityModel = gameModel.entityModels[physicsSprite.entityModelId]
        const zone = scene.getRandomInstanceOfEntityId(effect.zoneEntityModelId)
        if(!zone) return
        const { x, y } = zone.getInnerCoordinates(entityModel, physicsSprite.entityInstance)
        physicsSprite.setPosition(x, y)
      }
      
      if(effect.effectBehavior === EFFECT_DESTROY) {
        const entityInstance = scene.getEntityInstance(physicsSprite.entityInstanceId)
        entityInstance.destroyAfterUpdate = true
      } else if(effect.effectBehavior === EFFECT_TRANSFORM) {
        const entityInstance = scene.getEntityInstance(physicsSprite.entityInstanceId)
        entityInstance.transformEntityModelId = effect.entityModelId
      }

      if(effect.effectBehavior === EFFECT_TRANSFORM_TEMPORARY_START) {
        const entityInstance = scene.getEntityInstance(physicsSprite.entityInstanceId)
        if(!entityInstance.transformCancelEntityModelId) {
          entityInstance.transformEntityModelId = effect.entityModelId
          entityInstance.transformCancelEntityModelId = entityInstance.entityModelId
        }
      }

      if(effect.effectBehavior === EFFECT_TRANSFORM_TEMPORARY_END) {
        const entityInstance = scene.getEntityInstance(physicsSprite.entityInstanceId)
        if(!entityInstance.transformCancelEntityModelId) return
        entityInstance.transformEntityModelId = entityInstance.transformCancelEntityModelId
        entityInstance.transformCancelEntityModelId = null
      }
    }

    physicsSprites.forEach((physicsSprite) => {
      runEffect(physicsSprite)
    })
  }

  onCutsceneEnd(cutsceneId) {
    this.relationsByEventType[ON_CUTSCENE_END]?.forEach((relation) => {
      if(relation.event.cutsceneId !== cutsceneId) return
      this.runRelation(relation)
    })
  }
}