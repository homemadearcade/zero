import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { BACKGROUND_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, PLAYER_INSTANCE_ID_PREFIX, PLAYER_INSTANCE_CANVAS_DEPTH, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, ZONE_INSTANCE_CANVAS_DEPTH, BASIC_INSTANCE_CANVAS_ID, PLAYER_INSTANCE_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID, NPC_INSTANCE_CANVAS_ID, BASIC_CLASS, NPC_CLASS, ZONE_CLASS, PLAYER_CLASS, ON_PLAYTHROUGH, START_STATE, PAUSED_STATE, PLAY_STATE, STOPPED_STATE, PLAYTHROUGH_PLAY_STATE, GAME_OVER_STATE, WIN_GAME_STATE, PLAYTHROUGH_PAUSED_STATE, EFFECT_COLLIDE, OBJECT_CLASS_ID_PREFIX, PLAYER_CLASS_TYPE_PREFIX } from '../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { Stage } from '../entities/Stage';
import { ANIMATION_CAMERA_SHAKE } from '../../store/types';
import { editLobby } from '../../store/actions/lobbyActions';
import { changeCurrentStage, changePlayerState, clearCutscenes  } from '../../store/actions/gameContextActions';
import { ProjectileInstance } from '../entities/ProjectileInstance';

export class GameInstance extends Phaser.Scene {
  constructor(props) {
    super(props);

    this.playerInstance = null 
    this.backgroundLayer = null
    this.playgroundLayer = null
    this.foregroundLayer = null
    this.objectInstances = []
    this.objectInstancesById = {}

    this.gameState = null
    this.relationMap = {}

    this.unregisterColliders = []

    this.physicsType = ARCADE_PHYSICS

    this.sceneInstanceData = props.sceneInstanceData
  }

  init(data) {
    this.firstStage = data.firstStage
  }

  runAnimation({type, data}) {
    switch(type) {
      case ANIMATION_CAMERA_SHAKE: 
        this.cameras.main.shake(data.intensity)
        return
      default: 
        return
    } 
  }

  getAllInstancesOfClassId(classId) {
    let instances = [...this.objectInstances]
    if(classId === this.playerInstance?.id || classId === this.playerInstance?.classId) {
      instances.push(this.playerInstance)
    }
    instances = instances.filter((instance) => {
      return instance.classId === classId
    })
    
    const projectiles= this.projectileInstances.filter((instance) => {
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
   [this.playerInstance, ...this.objectInstances, ...this.projectileInstances].forEach((object) => {
      if(object.classId === classId) {
        fx(object)
      } else if(object.id === classId) {
        //player class
        fx(object)
      }
    })
  }

  getObjectInstance(id) {
    if(id === PLAYER_INSTANCE_ID_PREFIX) {
      return this.playerInstance
    }
    
    return this.objectInstancesById[id]
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
      const gameContext = getCobrowsingState().gameContext
      const stageId = gameContext.currentStageId
      const zoneId = gameModel.stages[stageId].spawnZoneClassId
      const zone = this.getRandomInstanceOfClassId(zoneId)
      const {x, y} = this.getRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.classes[zoneId]))

      this.playerInstance = new PlayerInstance(this, PLAYER_INSTANCE_ID_PREFIX, {
        classId: gameContext.player.classId,
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
    this.unregisterRelations()
    this.registerRelations()
  }

  removePlayerInstance() {
    // this.playerInstance.particles.destroy()
    this.playerInstance.destroy()
    this.playerInstance = null
  }

  initializeObjectInstance(id, gameObject, effectSpawned) {
    const newPhaserObject = new ObjectInstance(this, id, gameObject, effectSpawned)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[id] = newPhaserObject
    return newPhaserObject
  }

  addProjectileInstance(id, classId) {
    const projectile = new ProjectileInstance(this, id, { classId })
    this.projectileInstances.push(projectile)
    this.projectileInstancesById[id] = projectile
    this.unregisterRelations()
    this.registerRelations()
    return projectile
  }

  addObjectInstance(id, gameObject, effectSpawned) {
    const instance = this.initializeObjectInstance(id, gameObject, effectSpawned)
    this.unregisterRelations()
    this.registerRelations()
    return instance
  }

  removeObjectInstance(id) {
    this.objectInstances = this.objectInstances.filter((object) => {
      return id !== object.id
    })
    this.getObjectInstance(id).destroy()
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

  // createRelationsMap() {
  //   this.relationMap = {}
  //   const state = store.getState()
  //   const gameModel = state.gameModel.gameModel
  //   const relations = gameModel.relations 

  //   Object.keys(relations).forEach((relationId) => {
  //     const relation = relations[relationId]
  //     const classIds = [relation.event.classIdA, relation.event.classIdB] 
  //     classIds.sort()
  //     const classString = classIds.join()
  //     if(!this.relationMap[classString]) {
  //       this.relationMap[classString] = {
  //         collideRelation: null,
  //         otherRelations: []
  //       }
  //     }
  //     if(relation.effect.type === EFFECT_COLLIDE) {
  //       this.relationMap[classString].collideRelation = relation
  //     } else {
  //       this.relationMap[classString].otherRelations.push(relation)
  //     }
  //   })
  // }

  // findCollideInitiator(classes, relation) {
  //   if(isPlayerId(classes[0])) {
  //     const objectClass = store.getState().gameModel.gameModel.classes[classes[1]]
  //     if(objectClass.graphics.layerId === PLAYGROUND_CANVAS_ID) {
  //       return classes[0]
  //     }
  //   }
  //   if(isPlayerId(classes[1])) {
  //     const objectClass = store.getState().gameModel.gameModel.classes[classes[0]]
  //     if(objectClass.graphics.layerId === PLAYGROUND_CANVAS_ID) {
  //       return classes[1]
  //     }
  //   }

  //   if(relation) {
  //     return relation.event.classIdA
  //   }

  //   return classes[0]
  // }

  // registerRelationMap() {

  //   // relations
  //   Object.keys(this.relationMap).forEach((classPair) => {
  //     const relationMap = this.relationMap[classPair]
  //     const collideInitiatorClassId = this.findCollideInitiator(classPair.split(','), relationMap.collideRelation)
  //     this.forAllObjectInstancesMatchingClassId(collideInitiatorClassId, (instance) => {
  //       instance.registerRelations(relationMap.otherRelations)
  //     })
  //   })

  //   //collisions
  //   Object.keys(this.relationMap).forEach((classPair) => {
  //     const relationMap = this.relationMap[classPair]
  //     if(!relationMap.collideRelation) return
  //     const collideInitiatorClassId = this.findCollideInitiator(classPair.split(','), relationMap.collideRelation)
  //     this.forAllObjectInstancesMatchingClassId(collideInitiatorClassId, (instance) => {
  //       instance.registerRelations([relationMap.collideRelation])
  //     })
  //   })
    
  // }

  registerRelations() {
    // this.createRelationsMap()

    /// RELATIONS
    this.playerInstance.registerRelations()

    this.objectInstances.forEach((instance) => {
      instance.registerRelations()
    })

    this.projectileInstances.forEach((instance) => {
      instance.registerRelations()
    })


    /// COLLIDERS
    this.playerInstance.registerColliders()

    this.objectInstances.forEach((instance) => {
      instance.registerColliders()
    })

    this.projectileInstances.forEach((instance) => {
      instance.registerColliders()
    })

    // all sprites on playground layer collide with hero
    const gameModel = store.getState().gameModel.gameModel
    const releventInstances = this.objectInstances.filter((objectInstance) => {
      const objectClass = gameModel.classes[objectInstance.classId]
      return objectClass.graphics.layerId === PLAYGROUND_CANVAS_ID
    }).map(({sprite}) => sprite)

    this.unregisterColliders.push(
      this.physics.add.collider(this.playerInstance.sprite, releventInstances, (instanceA, instanceB) => {
        instanceA.justCollided = true
        instanceB.justCollided = true
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

    this.projectileInstances.forEach((instance) => {
      instance.unregister()
    })

    this.unregisterColliders.forEach((fx) =>  {
      this.physics.world.removeCollider(fx)
    })

    this.playgroundLayer.unregisterColliders()
  }

  afterGameInstanceUpdateEffects() {
    if(this.playerInstance.destroyAfterUpdate) {
      this.playerInstance.destroyInGame()
    }
    this.objectInstances.forEach((instance) => {
      if(instance.reclassId) {
        instance.reclass(instance.reclassId)
      } else if(instance.destroyAfterUpdate) {
        instance.destroyInGame()
      }
    })
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
      return this.backgroundLayer
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

  create() {
    const gameModel = store.getState().gameModel.gameModel
    const gameContext = getCobrowsingState().gameContext
    const stageId = gameContext.currentStageId
    const currentStage = gameModel.stages[stageId]
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
    // background layer
    this.backgroundLayer = new CodrawingCanvas(this, {canvasId: BACKGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(this, {canvasId: PLAYGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.playgroundLayer.setDepth(PLAYGROUND_CANVAS_DEPTH)

    this.objectInstanceGroup = this.add.group()
    this.objectClassGroup = this.add.group()
    this.npcClassGroup = this.add.group()
    this.projectileInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(PLAYER_INSTANCE_CANVAS_DEPTH)
    this.playerInstanceGroup = this.add.group()

    this.zoneInstanceLayer = this.add.layer();
    this.zoneInstanceLayer.setDepth(ZONE_INSTANCE_CANVAS_DEPTH)

    // FOREGROUND layer
    this.foregroundLayer = new CodrawingCanvas(this, {canvasId: FOREGROUND_CANVAS_ID, stageId, boundaries: currentStage.boundaries})
    this.foregroundLayer.setDepth(FOREGROUND_CANVAS_DEPTH)

    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_CANVAS_DEPTH)

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // OBJECTS
    ////////////////////////////////////////////////////////////
    this.objectInstances = []
    this.objectInstancesById = {}
    this.projectileInstances = []
    this.projectileInstancesById = {}

    const objects = currentStage.objects
    Object.keys(objects).forEach((gameObjectId) => {
      const objectInstanceData = objects[gameObjectId]
      if(!objectInstanceData) {
        return console.error('Object missing!', gameObjectId)
      } 
      if(gameObjectId === PLAYER_INSTANCE_ID_PREFIX) {
        return console.error('hero got in?!')
      }
      if(!objectInstanceData.classId) {
        return console.log('missing classId!!', objectInstanceData)
      }

      this.initializeObjectInstance(gameObjectId, objectInstanceData)
    });

    this.objectInstances = this.objectInstances.filter((objectInstance) => {
      return !!objectInstance
    })

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // PLAYER
    ////////////////////////////////////////////////////////////
    this.initializePlayerInstance()

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
    const playerClass = gameModel.classes[gameContext.player.classId]
    this.cameras.main.setZoom(playerClass.camera.zoom);

    if(this.isPlaythrough && this.firstStage) {
      Object.keys(gameModel.relations).map((relationId) => {
        return gameModel.relations[relationId]
      }).forEach((relation) => {
        const {event} = relation
        if(event.type === ON_PLAYTHROUGH) {
          this.runAccuteEffect(relation)
        }
      })
    }
    
    setTimeout(() => {this.hasLoadedOnce = true})
  }

  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })
    const state = store.getState()
    const gameModel = state.gameModel
    const zoneId = gameModel.stages[this.stage.id].spawnZoneClassId
    const zone = this.scene.getRandomInstanceOfClassId(zoneId)
    this.playerInstance.setRandomPosition(...zone.getInnerCoordinateBoundaries(gameModel.classes[zoneId]))
  }

  sendReloadGameEvent() {
    // this updates here because all players are watching the current stage right now
    const initialStageId = store.getState().gameModel.gameModel.player.initialStageId
    store.dispatch(changeCurrentStage(initialStageId))
    const classId = store.getState().gameModel.gameModel.stages[initialStageId].playerClassId
    store.dispatch(changePlayerState({classId}))

    if(store.getState().lobby.lobby?.id) {
      store.dispatch(editLobby(store.getState().lobby.lobby.id, {
        gameReloadDate: Date.now()
      }))
    } else {
      this.reload()
    }
  }

  reload = () => {
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scene
    this.unregisterEvents()

    store.dispatch(clearCutscenes())
  }
  
  update(time, delta) {
    // FOR SPECIAL IS PASUED
    // if(this.isPaused) return
    super.update(time, delta)

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerVisibility = gameViewEditor.layerVisibility

    this.backgroundLayer.setVisible(layerVisibility[BACKGROUND_CANVAS_ID])
    this.playgroundLayer.setVisible(layerVisibility[PLAYGROUND_CANVAS_ID])
    this.foregroundLayer.setVisible(layerVisibility[FOREGROUND_CANVAS_ID])
    this.zoneInstanceLayer.setVisible(layerVisibility[ZONE_INSTANCE_CANVAS_ID])

    this.objectInstances.forEach((object) => {
      object.update(time, delta);
    })

    this.projectileInstances.forEach((projectile) => {
      projectile.update(time, delta)
      if(projectile.destroyTime < Date.now()) {
        projectile.destroy()
      }
    })

    if(this.playerInstance) this.playerInstance.update(time, delta)

    const currentStageId = getCobrowsingState().gameContext.currentStageId
    if(this.stage.id !== currentStageId) {
      this.scene.start(currentStageId, this.props)
    }

    const currentPlayerId = getCobrowsingState().gameContext.player.classId
    if(this.playerInstance.classId !== currentPlayerId) {
      this.playerInstance.reclass(currentPlayerId)
    }
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
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
      if(this.hasLoadedOnce) this.sendReloadGameEvent()
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
      this.sendReloadGameEvent()
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
        [BACKGROUND_CANVAS_ID]: BACKGROUND_CANVAS_DEPTH,
        [PLAYGROUND_CANVAS_ID]: PLAYGROUND_CANVAS_DEPTH,
        [FOREGROUND_CANVAS_ID]: FOREGROUND_CANVAS_DEPTH
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

  addSpriteToTypeGroup(classId, sprite) {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[classId]

    if(objectClass.type === BASIC_CLASS) {
      this.objectClassGroup.add(sprite)
    } else if(objectClass.type === NPC_CLASS) {
      this.npcClassGroup.add(sprite)
    }
  }

}