import Phaser from 'phaser';

import { ObjectInstance } from '../entities/ObjectInstance'
import { PlayerInstance } from '../entities/PlayerInstance';
import store from '../../store';
import { spaceshipClass } from '../../defaultData/heros';
import { LayerZero } from '../entities/LayerZero';
import { getTextureMetadata } from '../../utils/utils';
import { LayerCanvas } from '../entities/LayerCanvas';
import { BACKGROUND_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, PLAYAREA_LAYER_DEPTH } from '../../constants';

export class GameInstance extends Phaser.Scene {
  constructor({key }) {
    super({
      key: key,
    });

    this.player = null 
    this.layer_1 = null
    this.layerZero = null
    this.layer1 = null
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

  addObjectInstance(id, gameObject) {
    const newPhaserObject = new ObjectInstance(this, id, gameObject)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[id] = newPhaserObject
  }

  removeObjectInstance(id) {
    this.objectInstances = this.objectInstances.filter((object) => {
      return id !== object.id
    })
    this.objectInstancesById[id].destroy()
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

  create() {
    const gameModel = store.getState().game.gameModel

    // background layer
    this.layer_1 = new LayerCanvas(this, {layerId: 'layer-1'})
    this.layer_1.setDepth(BACKGROUND_LAYER_DEPTH)
    // layer zero
    this.layerZero = new LayerZero(this)
    this.layerZero.setDepth(PLAYAREA_LAYER_DEPTH)
    // overhead layer
    this.layer1 = new LayerCanvas(this, {layerId: 'layer1'})
    this.layer1.setDepth(OVERHEAD_LAYER_DEPTH)

    // objects
    this.objectInstances = Object.keys(gameModel.objects).map((gameObjectId) => {
      if(!gameModel.objects[gameObjectId]) {
        return console.error('Object missing!')
      } 
      if(gameObjectId === 'player') {
        return console.error('Player got in?!')
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

    // hero 
    if(gameModel.hero.initialCassId) {
      this.player = new PlayerInstance(this, 'player', {
        classId: gameModel.hero.initialClassId,
        textureId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    } else {
      this.player = new PlayerInstance(this, 'player', {
        classDataOverride: {...spaceshipClass},
        textureId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    }

    //world
    this.matter.world.setGravity(gameModel.world.gravity.x, gameModel.world.gravity.y)
    this.matter.world.setBounds(0, 0, gameModel.world.boundaries.width, gameModel.world.boundaries.height);

  }

  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })

    this.player.x = this.player.spawnX
    this.player.y = this.player.spawnY
  }

  reloadGameInstanceWithNewModel = (gameModel) => {
    console.log('reloading game based on model change', gameModel)
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.scene.restart(); // restart current scene
  }
  
  update(time, delta) {
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