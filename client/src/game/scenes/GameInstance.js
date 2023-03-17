import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { BACKGROUND_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, PLAYER_INSTANCE_ID_PREFIX, PLAYER_INSTANCE_CANVAS_DEPTH, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, ZONE_INSTANCE_CANVAS_DEPTH, BASIC_CLASS, ZONE_INSTANCE_CANVAS_ID, NPC_CLASS, ZONE_CLASS, PLAYER_CLASS, ON_PLAYTHROUGH, START_STATE, PAUSED_STATE, PLAY_STATE, STOPPED_STATE, PLAYTHROUGH_PLAY_STATE, GAME_OVER_STATE, WIN_GAME_STATE, PLAYTHROUGH_PAUSED_STATE, ANIMATION_CAMERA_SHAKE, ANIMATION_CONFETTI, OBJECT_INSTANCE_ID_PREFIX, EVENT_SPAWN_CLASS_IN_CAMERA, EVENT_SPAWN_CLASS_DRAG_FINISH } from '../constants';
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

export class GameInstance extends Phaser.Scene {
  constructor(props) {
    super(props);

    this.playerInstance = null 
    this.backgroundLayer = null
    this.playgroundLayer = null
    this.foregroundLayer = null

    this.objectInstances = []
    this.objectInstancesById = {}
    this.objectInstancesByTag = {}

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

  runGameInstanceEvent({type, data}) {
    switch(type) {
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
        const objectInstance = this.getObjectInstance(data.instanceId)
        objectInstance.sprite.x = data.x;
        objectInstance.sprite.y = data.y;
        return
      default: 
        return
    }
  }

  getAllInstancesOfClassId(classId) {
    let instances = [...this.objectInstances]
    if(classId === this.playerInstance?.instanceId || classId === this.playerInstance?.classId) {
      instances.push(this.playerInstance)
    }
    instances = instances.filter((instance) => {
      return instance.classId === classId
    })
    
    const projectiles= this.temporaryInstances.filter((instance) => {
      return instance.classId === classId
    })

    return instances.concat(projectiles)
  }

  getRandomInstanceOfClassId(classId) {
    const instances = this.getAllInstancesOfClassId(classId)
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
   [this.playerInstance, ...this.objectInstances, ...this.temporaryInstances].forEach((objectInstance) => {
      if(objectInstance.classId === classId) {
        fx(objectInstance)
      } else if(objectInstance.instanceId === classId) {
        //player class
        fx(objectInstance)
      }
    })
  }

  getObjectInstance(instanceId) {
    if(instanceId === PLAYER_INSTANCE_ID_PREFIX) {
      return this.playerInstance
    }
    
    return this.objectInstancesById[instanceId]
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

      const {x, y} = this.getRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.classes[zoneId]))

      let lastPlayerClassId = playerInterface.playerClassId ? playerInterface.playerClassId : directionalPlayerClassId;

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_ID_PREFIX, {
        classId: currentStage.playerClassId ? currentStage.playerClassId : lastPlayerClassId,
        spawnX:x,
        spawnY: y
      });
    } else {

      const {classId, spawnX, spawnY} = classData

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_ID_PREFIX, {
        classId,
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
    this.objectInstancesByTag = {}
    const objectClasses = store.getState().gameModel.gameModel.classes
    const allInstances = this.objectInstances.slice()
    allInstances.push(this.playerInstance)
    allInstances.forEach((objectInstance) => {
      const objectClass = objectClasses[objectInstance.classId]
      Object.keys(objectClass.tags).forEach((tagId) => {
        if(objectClass.tags[tagId]) {
          if(!this.objectInstancesByTag[tagId]) {
            this.objectInstancesByTag[tagId] = [objectInstance]
          } else {
            this.objectInstancesByTag[tagId].push(objectInstance)
          }
        }
      })
    })
  }

  populateAndSortRelations() {
    const relations = store.getState().gameModel.gameModel.relations
    const effects = store.getState().gameModel.gameModel.effects
    const events = store.getState().gameModel.gameModel.events

    this.relationsByEvent = Object.keys(relations).reduce((relationsByEvent, relationId) => {
      const relation = relations[relationId]
      const populatedEvent = events[relation.event]
      const populatedEffects = Object.keys(relation.effects).map((effectId) => {
        const effect = {
          ...relation.effects[effectId],
          ...effects[effectId],
        }
        return effect
      })

      const populatedRelation = {
        event: populatedEvent,
        effects: populatedEffects,
        relationId: relation.relationId
      }

      if(relationsByEvent[populatedEvent.type]) {
        relationsByEvent[populatedEvent.type].push(populatedRelation)
      } else {
        relationsByEvent[populatedEvent.type] = [populatedRelation]
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

  addTemporaryInstance(instanceId, classId) {
    const temporaryInstance = new ProjectileInstance(this, instanceId, { classId })
    this.temporaryInstances.push(temporaryInstance)
    this.temporaryInstancesById[instanceId] = temporaryInstance
    // this.unregisterRelations()
    // this.registerRelations()
    return temporaryInstance
  }

  removeTemporaryInstance(instanceId) {
    this.temporaryInstances = this.temporaryInstances.filter((temporaryInstance) => {
      return instanceId !== temporaryInstance.instanceId
    })
    this.temporaryInstancesById[instanceId].destroy()
    this.temporaryInstancesById[instanceId] = null
  }

  initializeObjectInstance(instanceId, objectInstanceData, effectSpawned) {
    const newPhaserObject = new ObjectInstance(this, instanceId, objectInstanceData, effectSpawned)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[instanceId] = newPhaserObject

    return newPhaserObject
  }
  addObjectInstance(instanceId, objectInstanceData, effectSpawned) {
    const instance = this.initializeObjectInstance(instanceId, objectInstanceData, effectSpawned)
    this.reregisterRelationships()
    return instance
  }
  removeObjectInstance(instanceId) {
    this.objectInstances = this.objectInstances.filter((object) => {
      return instanceId !== object.instanceId
    })
    this.getObjectInstance(instanceId).destroy()
    this.objectInstancesById[instanceId] = null
    this.reregisterRelationships()
  }
  updateObjectInstance(objectInstance, {x, y, rotation, isVisible, destroyAfterUpdate, reclassId}) {
    if(x) objectInstance.sprite.x = x;
    if(y) objectInstance.sprite.y = y;
    if(rotation) objectInstance.sprite.rotation = rotation;
    objectInstance.setVisible(isVisible);
    objectInstance.isVisible = isVisible
    objectInstance.destroyAfterUpdate = destroyAfterUpdate 
    objectInstance.reclassId = reclassId
  }

  registerRelations() {
    /// RELATIONS
    this.playerInstance.registerRelations()

    this.objectInstances.forEach((instance) => {
      instance.registerRelations()
    })

    // this.temporaryInstances.forEach((instance) => {
    //   instance.registerRelations()
    // })

    /// COLLIDERS
    this.playerInstance.registerColliders()

    this.objectInstances.forEach((instance) => {
      instance.registerColliders()
    })

    this.temporaryInstances.forEach((instance) => {
      instance.registerColliders()
    })

    // all sprites on playground layer collide with the player
    const gameModel = store.getState().gameModel.gameModel
    const releventInstances = this.objectInstances.filter((objectInstance) => {
      const objectClass = gameModel.classes[objectInstance.classId]
      return objectClass.graphics.layerId === PLAYGROUND_CANVAS_ID
    }).map(({sprite}) => sprite)

    this.colliderRegistrations.push(
      this.physics.add.collider(this.playerInstance.sprite, releventInstances, (instanceSpriteA, instanceSpriteB) => {
        instanceSpriteA.justCollided = true
        instanceSpriteB.justCollided = true
      })
    )

    this.playgroundLayer.registerColliders()
  }

  unregisterRelations() {
    /// RELATIONS AND COLLIDERS
    this.playerInstance.unregister()

    this.objectInstances.forEach((instance) => {
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

    this.playgroundLayer.unregisterColliders()
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
    
    [...this.temporaryInstances, ...this.objectInstances].forEach((objectInstance) => {
      if(objectInstance.reclassId && objectInstance.reclassId !== objectInstance.classId) {
        objectInstance.reclass(objectInstance.reclassId)
      } else if(objectInstance.destroyAfterUpdate) {
        objectInstance.destroyInGame()
      }
    })

    if(this.playerInstance.reclassId && this.playerInstance.classId !== this.playerInstance.reclassId) {
      this.playerInstance.reclass(this.playerInstance.reclassId)
    }
  }

  // getSpriteTexture(textureId) {
  //   const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
  //   return this.textures.getFrame(spriteSheetName, spriteIndex)
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
  //       // if (spriteToFollow) {
  //       //   camera.panEffect.destination.x = spriteToFollow.x;
  //       //   camera.panEffect.destination.y = spriteToFollow.y;
  //       // } 
  //       // if (progress === 1 && whenFinished) {
  //       //   whenFinished();
  //       // }
  //     }
  //   );
  //   camera.zoomTo(zoomLevel, duration, easing);
  // }

  getLayerById(textureId) {
    if(textureId === this.backgroundLayer.textureId) {
      return this.backgroundLayer
    }
    if(textureId === this.playgroundLayer.textureId) {
      return this.playgroundLayer
    }
    if(textureId === this.foregroundLayer.textureId) {
      return this.foregroundLayer
    }

    console.error('didnt find layer with id', textureId, typeof textureId)
  }
  
  getLayerByCanvasId(canvasId) {
    if(canvasId === BACKGROUND_CANVAS_ID) {
      return this.backgroundLayer
    }
    if(canvasId === PLAYGROUND_CANVAS_ID) {
      return this.playgroundLayer
    }
    if(canvasId === FOREGROUND_CANVAS_ID) {
      return this.foregroundLayer
    }

    console.error('didnt find layer with id', canvasId, typeof canvasId)
  }

  initializeObjectInstances() {
    const state = store.getState()
    const gameModel = store.getState().gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    const currentStage = gameModel.stages[stageId]
    const objects = currentStage.objects
    Object.keys(objects).forEach((objectInstanceId) => {
      const objectInstanceData = objects[objectInstanceId]
      if(!objectInstanceData) {
        // LEGACY
        // if(objectInstanceId === 'oi/playspawnzone' || objectInstanceId === 'oi-playspawnzone') {
        //   console.log('ding this thing?')
        //   this.initializeObjectInstance(objectInstanceId, initialPlayerSpawnZone)
        //   return
        // } else {
          return console.error('Object missing!', objectInstanceId)
        // }
      } 
      if(objectInstanceId === PLAYER_INSTANCE_ID_PREFIX) {
        return console.error('hero got in?!')
      }
      if(!objectInstanceData.classId) {
        return console.error('missing classId!!', objectInstanceData)
      }

      this.initializeObjectInstance(objectInstanceId, objectInstanceData)
    });

    this.objectInstances = this.objectInstances.filter((objectInstance) => {
      return !!objectInstance
    })
  }

  initializeLayers = () => {
    const state = store.getState()
    const gameModel = store.getState().gameModel.gameModel
    const stageId = state.gameModel.currentStageId
    const currentStage = gameModel.stages[stageId]

    this.backgroundLayer = new CodrawingCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost, 
        textureId: gameModel.id+'/' + stageId + '_' + BACKGROUND_CANVAS_ID,
        boundaries: currentStage.boundaries, 
        autoSave: true
      })
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost,
        textureId: gameModel.id+'/' + stageId + '_' + PLAYGROUND_CANVAS_ID,
        boundaries: currentStage.boundaries,
        autoSave: true
      })
    this.playgroundLayer.setDepth(PLAYGROUND_CANVAS_DEPTH)

    this.objectInstanceGroup = this.add.group()
    // this.basicClassGroup = this.add.group()
    // this.npcClassGroup = this.add.group()
    // this.temporaryInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(PLAYER_INSTANCE_CANVAS_DEPTH)
    this.playerInstanceGroup = this.add.group()

    this.zoneInstanceLayer = this.add.layer();
    this.zoneInstanceLayer.setDepth(ZONE_INSTANCE_CANVAS_DEPTH)

    // FOREGROUND layer
    this.foregroundLayer = new CodrawingCanvas(
      this, 
      {
        isCodrawingHost: this.gameRoom.isHost,
        textureId: gameModel.id+'/' + stageId + '_' + FOREGROUND_CANVAS_ID,
        boundaries: currentStage.boundaries,
        autoSave: true
      })
    this.foregroundLayer.setDepth(FOREGROUND_CANVAS_DEPTH)

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
    this.objectInstances = []
    this.objectInstancesById = {}
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
    this.cameras.main.pan(this.playerInstance.sprite.x, this.playerInstance.sprite.y, 0)
    const playerClass = gameModel.classes[this.playerInstance.classId]
    this.cameras.main.setZoom(playerClass.camera.zoom);

    if(this.isPlaythrough && this.firstStage) {
      this.relationsByEvent[ON_PLAYTHROUGH].forEach((relation) => {
        this.runAccuteEffect({
          relation,
        })
      })
    }
    
    setTimeout(() => {
      store.dispatch(updateGameRoomPlayer({
        gameRoomId: this.gameRoom.id,
        userId: store.getState().auth.me.id,
        user: {
          loadedGameId: this.gameRoom.gameId
        }
      }))
      this.hasLoadedOnce = true
    })
  }

  respawn() {
    this.objectInstances.forEach((objectInstance) => {
      objectInstance.x = objectInstance.spawnX
      objectInstance.y = objectInstance.spawnY
    })
    const state = store.getState()
    const gameModel = state.gameModel
    this.stage.ensureSpawnZoneExists()
    const zoneId = gameModel.stages[this.stage.stageId].spawnZoneClassId
    const zone = this.scene.getRandomInstanceOfClassId(zoneId)
    this.playerInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.classes[zoneId]))
  }

  spawnObjectInstanceInsidePlayerCamera({classId}) {
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
    this.addObjectInstance(OBJECT_INSTANCE_ID_PREFIX+generateUniqueId(), { spawnX, spawnY, classId}, true)
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
  }

  destroyInstances() {
    this.objectInstances.forEach((instance) => {
      instance.destroy()
    })
    this.temporaryInstances.forEach((instance) => {
      instance.destroyAfterUpdate = true
      instance.destroy()
    })
    this.temporaryInstances = []
    this.temporaryInstancesById = {}
    this.temporaryInstancesByTag = {}
    this.objectInstances= []
    this.objectInstancesById = {}
    this.objectInstancesByTag = {}
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

    const layerVisibility = gameViewEditor.layerVisibility

    this.backgroundLayer.setVisible(layerVisibility[BACKGROUND_CANVAS_ID])
    this.playgroundLayer.setVisible(layerVisibility[PLAYGROUND_CANVAS_ID])
    this.foregroundLayer.setVisible(layerVisibility[FOREGROUND_CANVAS_ID])

    this.zoneInstanceLayer.setVisible(layerVisibility[ZONE_INSTANCE_CANVAS_ID])

    this.stage.update()

    this.objectInstances.forEach((objectInstance) => {
      objectInstance.update(time, delta);
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
      if(this.playerInstance.classId !== currentPlayerClassId) {
        store.dispatch(changePlayerClass({classId: this.playerInstance.classId}))
      }
    }
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
    this.destroyInstances()
    this.backgroundLayer.destroy()
    this.playgroundLayer.destroy()
    this.foregroundLayer.destroy()
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
      if(this.hasLoadedOnce) this.sendResetGameEvent()
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

  addSpriteToTypeLayer(classId, sprite, modifier) {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[classId]

    if(objectClass.type === BASIC_CLASS || objectClass.type === NPC_CLASS || objectClass.type === PLAYER_CLASS) {
      const layerToDepth = {
        [BACKGROUND_CANVAS_ID]: BACKGROUND_CANVAS_DEPTH + 1,
        [PLAYGROUND_CANVAS_ID]: PLAYGROUND_CANVAS_DEPTH + 1,
        [FOREGROUND_CANVAS_ID]: FOREGROUND_CANVAS_DEPTH + 1
      }

      if(modifier !== undefined) {
        sprite.setDepth(layerToDepth[objectClass.graphics.layerId] + modifier)
      } else {
        sprite.setDepth(layerToDepth[objectClass.graphics.layerId])
      }
    } else if(objectClass.type === ZONE_CLASS) {
      this.zoneInstanceLayer.add(sprite)
    }
  }

  // addSpriteToTypeGroup(classId, sprite) {
  //   const gameModel = store.getState().gameModel.gameModel
  //   const objectClass = gameModel.classes[classId]

  //   if(objectClass.type === BASIC_CLASS) {
  //     this.basicClassGroup.add(sprite)
  //   } else if(objectClass.type === NPC_CLASS) {
  //     this.npcClassGroup.add(sprite)
  //   }
  // }

  // removeSpriteFromTypeGroup(classId, sprite) {
  //   const gameModel = store.getState().gameModel.gameModel
  //   const objectClass = gameModel.classes[classId]

  //   if(objectClass.type === BASIC_CLASS) {
  //     this.basicClassGroup.remove(sprite)
  //   } else if(objectClass.type === NPC_CLASS) {
  //     this.npcClassGroup.remove(sprite)
  //   }
  // }
}