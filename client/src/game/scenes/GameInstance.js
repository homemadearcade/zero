import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { getTextureMetadata } from '../../utils/utils';
import { BACKGROUND_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, HERO_INSTANCE_ID, HERO_INSTANCE_CANVAS_DEPTH, OBJECT_INSTANCE_CANVAS_DEPTH, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ARCADE_PHYSICS, ZONE_INSTANCE_CANVAS_DEPTH, OBJECT_INSTANCE_CANVAS_ID, HERO_INSTANCE_CANVAS_ID, ZONE_INSTANCE_CANVAS_ID } from '../../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { nodeSize } from '../../defaultData/general';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { World } from '../entities/World';

export class GameInstance extends Phaser.Scene {
  constructor({key}) {
    super({
      key: key,
    });

    this.player = null 
    this.backgroundLayer = null
    this.playgroundLayer = null
    this.foregroundLayer = null
    this.objectInstances = []
    this.objectInstancesById = {}

    this.physicsType = ARCADE_PHYSICS
  }

  getRandomInstanceOfClassId(classId) {
    const instances = [this.player, ...this.objectInstances].filter((instance) => {
      return instance.classId === classId
    })
    const index = Math.floor(Math.random() * instances.length)
    return instances[index]
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
   [this.player, ...this.objectInstances].forEach((object) => {
      if(object.classId === classId) {
        fx(object)
      }
    })
  }

  getObjectInstance(id) {
    if(id === HERO_INSTANCE_ID) {
      return this.player
    }
    
    return this.objectInstancesById[id]
  }

  initializePlayerInstance() {
    const gameModel = store.getState().game.gameModel

    this.player = new PlayerInstance(this, HERO_INSTANCE_ID, {
      classId: gameModel.hero.initialClassId,
      textureId: 'ship2',
      spawnX: gameModel.hero.spawnX,
      spawnY: gameModel.hero.spawnY
    });

    this.cameras.main.startFollow(this.player.sprite)
  }

  addPlayerInstance() {
    this.initializePlayerInstance()
    this.unregisterRelations()
    this.registerRelations()
  }

  removePlayerInstance() {
    // this.player.particles.destroy()
    this.player.destroy()
    this.player = null
  }

  initializeObjectInstance(id, gameObject) {
    const newPhaserObject = new ObjectInstance(this, id, gameObject)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[id] = newPhaserObject
  }

  addObjectInstance(id, gameObject) {
    this.initializeObjectInstance(id, gameObject)
    this.unregisterRelations()
    this.registerRelations()
  }

  removeObjectInstance(id) {
    this.objectInstances = this.objectInstances.filter((object) => {
      return id !== object.id
    })
    this.getObjectInstance(id).destroy()
  }

  updateObjectInstance(objectInstance, {x, y, rotation}) {
    if(x) objectInstance.sprite.x = x;
    if(y) objectInstance.sprite.y = y;
    if(rotation) objectInstance.sprite.rotation = rotation;
  }

  registerRelations() {
    this.player.registerRelations()
    
    this.objectInstances.forEach((instance) => {
      instance.registerRelations()
    })

    this.playgroundLayer.registerRelations()
  }

  unregisterRelations() {
    this.player.unregisterRelations()

    this.objectInstances.forEach((instance) => {
      instance.unregisterRelations()
    })

    this.playgroundLayer.unregisterRelations()
  }

  getSpriteTexture(textureId) {
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    return this.textures.getFrame(spriteSheetName, spriteIndex)
  }

  //Sine.easeInOut
  zoomAndPanTo(camera, zoomLevel, x, y, duration, easing = "Linear") {
    camera.pan(
      x,
      y,
      duration,
      easing,
      true,
      (camera, progress) => {
        // if (spriteToFollow) {
        //   camera.panEffect.destination.x = spriteToFollow.x;
        //   camera.panEffect.destination.y = spriteToFollow.y;
        // } 
        // if (progress === 1 && whenFinished) {
        //   whenFinished();
        // }
      }
    );
    camera.zoomTo(zoomLevel, duration, easing);
  }

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
    const gameModel = store.getState().game.gameModel
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

    this.objectInstanceLayer = this.add.layer();
    this.objectInstanceLayer.setDepth(OBJECT_INSTANCE_CANVAS_DEPTH)
    this.objectInstanceGroup = this.add.group()
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
    this.cameras.main.pan(this.player.sprite.x, this.player.sprite.y, 0)
    const heroClass = gameModel.classes[gameModel.hero.initialClassId]
    this.cameras.main.startFollow(this.player.sprite, true, heroClass.camera.lerpX, heroClass.camera.lerpY);
    this.cameras.main.setZoom(heroClass.camera.zoom);
  }

  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })

    this.player.x = this.player.spawnX
    this.player.y = this.player.spawnY
  }

  reload = () => {
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scene
  }
  
  update(time, delta) {
    super.update(time, delta)

    const gameViewEditor = getCobrowsingState().gameViewEditor
    const layerVisibility = gameViewEditor.layerVisibility

    this.backgroundLayer.setVisible(layerVisibility[BACKGROUND_CANVAS_ID])
    this.playgroundLayer.setVisible(layerVisibility[PLAYGROUND_CANVAS_ID])
    this.foregroundLayer.setVisible(layerVisibility[FOREGROUND_CANVAS_ID])
    this.objectInstanceLayer.setVisible(layerVisibility[OBJECT_INSTANCE_CANVAS_ID])
    this.playerInstanceLayer.setVisible(layerVisibility[HERO_INSTANCE_CANVAS_ID])
    this.zoneInstanceLayer.setVisible(layerVisibility[ZONE_INSTANCE_CANVAS_ID])

    this.objectInstances.forEach((object) => {
      object.update(time, delta);
    })

    this.projectileInstanceGroup.children.entries.forEach((projectile) => {
      if(projectile.destroyTime < time) projectile.destroy()
    })

    if(this.player) this.player.update(time, delta)
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
}