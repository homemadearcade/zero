import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../drawing/CollisionCanvas';
import { getTextureMetadata } from '../../utils/utils';
import { BACKGROUND_CANVAS_DEPTH, BACKGROUND_CANVAS_ID, HERO_INSTANCE_ID, HERO_INSTANCE_CANVAS_DEPTH, OBJECT_INSTANCE_CANVAS_DEPTH, FOREGROUND_CANVAS_DEPTH, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_DEPTH, PLAYGROUND_CANVAS_ID, UI_CANVAS_DEPTH, DEFAULT_TEXTURE_ID, MATTER_PHYSICS, ARCADE_PHYSICS } from '../../constants';
import { getCobrowsingState } from '../../utils/cobrowsingUtils';
import store from '../../store';
import { nodeSize } from '../../defaultData/general';
import { CodrawingCanvas } from '../drawing/CodrawingCanvas';
import { World } from '../entities/World';

export class GameInstance extends Phaser.Scene {
  constructor({key }) {
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

  addPlayerInstance() {
    const gameModel = store.getState().game.gameModel

    this.player = new PlayerInstance(this, HERO_INSTANCE_ID, {
      classId: gameModel.hero.initialClassId,
      textureId: 'ship2',
      spawnX: gameModel.hero.spawnX,
      spawnY: gameModel.hero.spawnY
    });

    this.cameras.main.startFollow(this.player.sprite)
  }

  removePlayerInstance() {
    this.player.particles.destroy()
    this.player.destroy()
    this.player = null
  }

  addObjectInstance(id, gameObject) {
    const newPhaserObject = new ObjectInstance(this, id, gameObject)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[id] = newPhaserObject
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

  createGrids() {
    // const gameModel = store.getState().game.gameModel
    // const gameMaxWidth = gameModel.world.boundaries.maxWidth
    // const gameMaxHeight = gameModel.world.boundaries.maxHeight
    // this.grid = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    // this.grid2 = this.add.grid(0, 0, gameMaxWidth * 4, gameMaxHeight * 4, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    // this.grid.setDepth(UI_CANVAS_DEPTH)
    // this.grid2.setDepth(UI_CANVAS_DEPTH)

    if(this.grid) this.grid.destroy()
    if(this.grid2) this.grid2.destroy()

    const boundaries = store.getState().game.gameModel.world.boundaries

    const gameWidth = boundaries.width
    const gameHeight = boundaries.height
    const gameX = boundaries.x
    const gameY = boundaries.y
    this.grid = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(gameX + gameWidth/2, gameY + gameHeight/2, gameWidth, gameHeight, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_CANVAS_DEPTH)
    this.grid2.setDepth(UI_CANVAS_DEPTH)
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
    this.backgroundLayer = new CodrawingCanvas(this, {canvasId: BACKGROUND_CANVAS_ID})
    this.backgroundLayer.setDepth(BACKGROUND_CANVAS_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(this, {canvasId: PLAYGROUND_CANVAS_ID})
    this.playgroundLayer.setDepth(PLAYGROUND_CANVAS_DEPTH)

    this.objectInstanceLayer = this.add.layer();
    this.objectInstanceLayer.setDepth(OBJECT_INSTANCE_CANVAS_DEPTH)
    this.objectInstanceGroup = this.add.group()
    this.projectileInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(HERO_INSTANCE_CANVAS_DEPTH)
    this.playerInstanceGroup = this.add.group()

    // FOREGROUND layer
    this.foregroundLayer = new CodrawingCanvas(this, {canvasId: FOREGROUND_CANVAS_ID})
    this.foregroundLayer.setDepth(FOREGROUND_CANVAS_DEPTH)

    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_CANVAS_DEPTH)

    this.createGrids()
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // OBJECTS
    ////////////////////////////////////////////////////////////
    this.objectInstances = Object.keys(gameModel.objects).map((gameObjectId) => {
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

      return new ObjectInstance(this, gameObjectId, gameModel.objects[gameObjectId])
    });

    this.objectInstances = this.objectInstances.filter((objectInstance) => {
      return !!objectInstance
    })

    this.objectInstancesById = this.objectInstances.reduce((prev, next) => {
      prev[next.id] = next 
      return prev
    }, {})


    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // HERO
    ////////////////////////////////////////////////////////////
    this.addPlayerInstance()

    this.physics.add.collider(this.objectInstances[0].sprite, this.player.sprite, () => {
      console.log('occurs importantly...')
    })

    this.physics.add.collider(this.objectInstances.map(({sprite}) => {
      return sprite
    }), this.player.sprite, () => {
      console.log('occurs')
    })

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
    const heroClass = gameModel.classes[gameModel.hero.initialClassId]
    this.cameras.main.startFollow(this.player.sprite, true, heroClass.camera.lerpX, heroClass.camera.lerpY);
    this.cameras.main.setZoom(heroClass.camera.zoom);

    this.events.on('postupdate', function(time, delta){
      this.objectInstances.forEach((object) => {
        object.deltaX = object.prevX - object.x
        object.deltaY = object.prevY - object.y

        object.prevX = object.x 
        object.prevY = object.y
      })
      
      this.player.prevX = this.player.x
      this.player.prevY = this.player.y

      this.player.deltaX = this.player.prevX - this.player.x
      this.player.deltaY = this.player.prevY - this.player.y
    }, this);

    
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

    const editorInstance = getCobrowsingState().editorInstance
    const layerVisibility = editorInstance.layerVisibility

    this.backgroundLayer.setVisible(layerVisibility[BACKGROUND_CANVAS_ID])
    this.playgroundLayer.setVisible(layerVisibility[PLAYGROUND_CANVAS_ID])
    this.foregroundLayer.setVisible(layerVisibility[FOREGROUND_CANVAS_ID])

    this.objectInstances.forEach((object) => {
      object.update(time, delta);
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