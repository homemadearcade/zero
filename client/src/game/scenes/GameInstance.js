import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { BACKGROUND_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, HERO_INSTANCE_ID, HERO_INSTANCE_CANVAS_DEPTH, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH, MATTER_PHYSICS, ARCADE_PHYSICS, ZONE_INSTANCE_CANVAS_DEPTH, OBJECT_INSTANCE_CANVAS_ID, HERO_INSTANCE_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID, NPC_INSTANCE_CANVAS_ID, OBJECT_CLASS, NPC_CLASS, ZONE_CLASS, HERO_CLASS, ON_PLAY_CINEMATIC } from '../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { World } from '../entities/World';
import { ANIMATION_CAMERA_SHAKE } from '../../store/types';
import { editLobby } from '../../store/actions/lobbyActions';
import { closeActiveCutscene } from '../../store/actions/gameContextActions';

export class GameInstance extends Phaser.Scene {
  constructor({key}) {
    super({
      key: key,
    });

    this.playerInstance = null 
    this.backgroundLayer = null
    this.playgroundLayer = null
    this.foregroundLayer = null
    this.objectInstances = []
    this.objectInstancesById = {}

    this.physicsType = ARCADE_PHYSICS
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
    return [this.playerInstance, ...this.objectInstances].filter((instance) => {
      return instance.classId === classId
    })
  }

  getRandomInstanceOfClassId(classId) {
    const instances = this.getAllInstancesOfClassId(classId)
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
   [this.playerInstance, ...this.objectInstances].forEach((object) => {
      if(object.classId === classId) {
        fx(object)
      }
    })
  }

  getObjectInstance(id) {
    if(id === HERO_INSTANCE_ID) {
      return this.playerInstance
    }
    
    return this.objectInstancesById[id]
  }

  initializePlayerInstance(classData = {}) {
    const gameModel = store.getState().gameModel.gameModel
    const {classId, spawnX, spawnY} = classData

    this.playerInstance = new PlayerInstance(this, HERO_INSTANCE_ID, {
      classId: classId ? classId : gameModel.hero.initialClassId,
      textureId: 'ship2',
      spawnX: spawnX !== undefined ? spawnX :gameModel.hero.spawnX,
      spawnY: spawnY !== undefined ? spawnY :gameModel.hero.spawnY,
    });

    this.playerInstance.setLerp()
  }

  addPlayerInstance(classData = {}) {
    const {classId, spawnX, spawnY} = classData
    this.initializePlayerInstance({classId, spawnX, spawnY})
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
    objectInstance.destroyAfterUpdate = destroyAfterUpdate 
    objectInstance.reclassId = reclassId
  }

  registerRelations() {
    this.playerInstance.registerRelations()
    
    this.objectInstances.forEach((instance) => {
      instance.registerRelations()
    })

    this.playgroundLayer.registerRelations()
  }

  afterGameInstanceUpdateEffects() {
    if(this.playerInstance.reclassId) {
      this.playerInstance.reclass(this.playerInstance.reclassId)
    } else if(this.playerInstance.destroyAfterUpdate) {
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

  unregisterRelations() {
    this.playerInstance.unregisterRelations()

    this.objectInstances.forEach((instance) => {
      instance.unregisterRelations()
    })

    this.playgroundLayer.unregisterRelations()
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

  getLayerById(canvasId) {
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
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.world = new World(this, gameModel.world)

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // LAYERS
    ////////////////////////////////////////////////////////////
    // background layer
    this.backgroundLayer = new CodrawingCanvas(this, {canvasId: BACKGROUND_CANVAS_ID, boundaries: gameModel.world.boundaries})
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(this, {canvasId: PLAYGROUND_CANVAS_ID, boundaries: gameModel.world.boundaries})
    this.playgroundLayer.setDepth(PLAYGROUND_CANVAS_DEPTH)

    this.objectInstanceGroup = this.add.group()
    this.objectClassGroup = this.add.group()
    this.npcClassGroup = this.add.group()
    this.projectileInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(HERO_INSTANCE_CANVAS_DEPTH)
    this.playerInstanceGroup = this.add.group()

    this.zoneInstanceLayer = this.add.layer();
    this.zoneInstanceLayer.setDepth(ZONE_INSTANCE_CANVAS_DEPTH)

    // FOREGROUND layer
    this.foregroundLayer = new CodrawingCanvas(this, {canvasId: FOREGROUND_CANVAS_ID, boundaries: gameModel.world.boundaries})
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

    Object.keys(gameModel.objects).forEach((gameObjectId) => {
      const objectInstanceData = gameModel.objects[gameObjectId]
      if(!objectInstanceData) {
        return console.error('Object missing!')
      } 
      if(gameObjectId === HERO_INSTANCE_ID) {
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
    // HERO
    ////////////////////////////////////////////////////////////
    this.initializePlayerInstance()


    this.registerRelations()

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CAMERA
    ////////////////////////////////////////////////////////////
    const gameWidth = gameModel.world.boundaries.width
    const gameHeight = gameModel.world.boundaries.height
    const gameX = gameModel.world.boundaries.x
    const gameY = gameModel.world.boundaries.y

    this.cameras.main.setBounds(gameX, gameY, gameWidth, gameHeight);
    this.cameras.main.pan(this.playerInstance.sprite.x, this.playerInstance.sprite.y, 0)
    const heroClass = gameModel.classes[gameModel.hero.initialClassId]
    this.cameras.main.setZoom(heroClass.camera.zoom);

    if(this.isCinematicPlay) {
      Object.keys(gameModel.relations).map((relationId) => {
        return gameModel.relations[relationId]
      }).forEach((relation) => {
        const {event, effect} = relation
        if(event.type === ON_PLAY_CINEMATIC) {
          this.runAccuteEffect(relation)
        }
      })
    }
  }

  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })

    this.playerInstance.x = this.playerInstance.spawnX
    this.playerInstance.y = this.playerInstance.spawnY
  }

  sendReloadGameEvent() {
    if(store.getState().lobby.lobby?.id) {
      store.dispatch(editLobby(store.getState().lobby.lobby.id, {
        gameResetDate: Date.now()
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

    store.dispatch(closeActiveCutscene())
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
    this.objectClassGroup.setVisible(layerVisibility[OBJECT_INSTANCE_CANVAS_ID])
    this.npcClassGroup.setVisible(layerVisibility[NPC_INSTANCE_CANVAS_ID])
    if(!this.playerInstance.destroyed && this.playerInstance.isVisible) this.playerInstance.setVisible(layerVisibility[HERO_INSTANCE_CANVAS_ID])
    this.zoneInstanceLayer.setVisible(layerVisibility[ZONE_INSTANCE_CANVAS_ID])

    this.objectInstances.forEach((object) => {
      object.update(time, delta);
    })

    this.projectileInstanceGroup.children.entries.forEach((projectile) => {
      if(projectile.destroyTime < time) projectile.destroy()
    })

    if(this.playerInstance) this.playerInstance.update(time, delta)
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

  addSpriteToTypeLayer(classId, sprite, modifier) {
    const gameModel = store.getState().gameModel.gameModel
    const objectClass = gameModel.classes[classId]

    if(objectClass.type === OBJECT_CLASS || objectClass.type === NPC_CLASS || objectClass.type === HERO_CLASS) {
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

    if(objectClass.type === OBJECT_CLASS) {
      this.objectClassGroup.add(sprite)
    } else if(objectClass.type === NPC_CLASS) {
      this.npcClassGroup.add(sprite)
    }
  }

}