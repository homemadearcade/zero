import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../entities/CollisionCanvas';
import { getTextureMetadata } from '../../utils/utils';
import { Canvas } from '../entities/Canvas';
import { BACKGROUND_LAYER_DEPTH, BACKGROUND_LAYER_ID, HERO_INSTANCE_ID, HERO_INSTANCE_LAYER_DEPTH, OBJECT_INSTANCE_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_DEPTH, PLAYGROUND_LAYER_ID, UI_LAYER_DEPTH } from '../../constants';
import { getCobrowsingState } from '../../utils/cobrowsing';
import store from '../../store';
import { nodeSize } from '../../defaultData/general';
import tinycolor from 'tinycolor2';

export class GameInstance extends Phaser.Scene {
  constructor({key }) {
    super({
      key: key,
    });

    this.player = null 
    this.backgroundLayer = null
    this.playgroundLayer = null
    this.overheadLayer = null
    this.objectInstances = []
    this.objectInstancesById = {}
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
    this.objectInstances.forEach((object) => {
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
    if(x) objectInstance.x = x;
    if(y) objectInstance.y = y;
    if(rotation) objectInstance.rotation = rotation;
  }

  getSpriteTexture(textureId) {
    const { spriteSheetName, spriteIndex } = getTextureMetadata(textureId)
    return this.textures.getFrame(spriteSheetName, spriteIndex)
  }

  getLayerById(layerId) {
    if(layerId === BACKGROUND_LAYER_ID) {
      return this.backgroundLayer
    }
    if(layerId === PLAYGROUND_LAYER_ID) {
      return this.playgroundLayer
    }
    if(layerId === OVERHEAD_LAYER_ID) {
      return this.overheadLayer
    }

    console.error('didnt find layer with id', layerId, typeof layerId)
  }

  create() {
    const gameModel = store.getState().game.gameModel
    const gameWidth = gameModel.world.boundaries.width
    const gameHeight = gameModel.world.boundaries.height

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.matter.world.setGravity(gameModel.world.gravity.x, gameModel.world.gravity.y)
    this.matter.world.setBounds(0, 0, gameWidth, gameHeight);

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // LAYERS
    ////////////////////////////////////////////////////////////
    // background layer
    this.backgroundLayer = new Canvas(this, {layerId: BACKGROUND_LAYER_ID})
    this.backgroundLayer.setDepth(BACKGROUND_LAYER_DEPTH)
    // layer zero
    this.playgroundLayer = new CollisionCanvas(this, {layerId: PLAYGROUND_LAYER_ID})
    this.playgroundLayer.setDepth(PLAYGROUND_LAYER_DEPTH)

    this.objectInstanceLayer = this.add.layer();
    this.objectInstanceLayer.setDepth(OBJECT_INSTANCE_LAYER_DEPTH)
    this.objectInstanceGroup = this.add.group()

    this.playerInstanceLayer = this.add.layer();
    this.playerInstanceLayer.setDepth(HERO_INSTANCE_LAYER_DEPTH)
    this.playerInstanceGroup = this.add.group()

    // overhead layer
    this.overheadLayer = new Canvas(this, {layerId: OVERHEAD_LAYER_ID})
    this.overheadLayer.setDepth(OVERHEAD_LAYER_DEPTH)

    this.uiLayer = this.add.layer();
    this.uiLayer.setDepth(UI_LAYER_DEPTH)

    this.grid = this.add.grid(0, 0, gameWidth * 4, gameHeight * 4, nodeSize, nodeSize, null, null, 0x222222, 0.2)
    this.grid2 = this.add.grid(0, 0, gameWidth * 4, gameHeight * 4, nodeSize * 3, nodeSize * 3, null, null, 0x222222, 0.5)

    this.grid.setDepth(UI_LAYER_DEPTH)
    this.grid2.setDepth(UI_LAYER_DEPTH)
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
    this.player = new PlayerInstance(this, HERO_INSTANCE_ID, {
      classId: gameModel.hero.initialClassId,
      textureId: 'ship2',
      spawnX: gameModel.hero.spawnX,
      spawnY: gameModel.hero.spawnY
    });



    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // CAMERA
    ////////////////////////////////////////////////////////////
    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight);
    const heroClass = gameModel.classes[gameModel.hero.initialClassId]
    this.cameras.main.startFollow(this.player, true, heroClass.camera.lerpX, heroClass.camera.lerpY);
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

    const editorInstance = getCobrowsingState().editorInstance
    const layerVisibility = editorInstance.layerVisibility

    this.backgroundLayer.setVisible(layerVisibility[BACKGROUND_LAYER_ID])
    this.playgroundLayer.setVisible(layerVisibility[PLAYGROUND_LAYER_ID])
    this.overheadLayer.setVisible(layerVisibility[OVERHEAD_LAYER_ID])

    this.objectInstances.forEach((object) => {
      object.update(time, delta);
    })

    this.player.update(time, delta)
  }

  unload() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}