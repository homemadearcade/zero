import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import { CollisionCanvas } from '../entities/CollisionCanvas';
import { getTextureMetadata } from '../../utils/utils';
import { Canvas } from '../entities/Canvas';
import { BACKGROUND_LAYER_DEPTH, BACKGROUND_LAYER_ID, HERO_INSTANCE_ID, OVERHEAD_LAYER_DEPTH, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_DEPTH, PLAYGROUND_LAYER_ID } from '../../constants';
import { getCobrowsingState } from '../../utils/cobrowsing';
import store from '../../store';

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
    this.resetGameId = null
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

    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // WORLD
    ////////////////////////////////////////////////////////////
    this.matter.world.setGravity(gameModel.world.gravity.x, gameModel.world.gravity.y)
    this.matter.world.setBounds(0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height);


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
    // overhead layer
    this.overheadLayer = new Canvas(this, {layerId: OVERHEAD_LAYER_ID})
    this.overheadLayer.setDepth(OVERHEAD_LAYER_DEPTH)


    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // OBJECTS
    ////////////////////////////////////////////////////////////
    this.objectInstances = Object.keys(gameModel.objects).map((gameObjectId) => {
      if(!gameModel.objects[gameObjectId]) {
        return console.error('Object missing!')
      } 
      if(gameObjectId === HERO_INSTANCE_ID) {
        return console.error('hero got in?!')
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
    // EDITOR INSTANCE STATE
    ////////////////////////////////////////////////////////////
    const editorInstanceState = getCobrowsingState().editorInstanceState
    this.resetGameId =  editorInstanceState.resetGameId
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
    const editorInstanceState = getCobrowsingState().editorInstanceState
    const layerVisibility = editorInstanceState.layerVisibility

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