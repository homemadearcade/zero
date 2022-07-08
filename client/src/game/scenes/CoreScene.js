import Phaser from 'phaser';

import { CoreObject } from '../entities/CoreObject'
import { PlayerObject } from '../entities/PlayerObject';
import store from '../../store';
import { spaceshipClass } from '../../defaultData/heros';

export class CoreScene extends Phaser.Scene {
  constructor({key }) {
    super({
      key: key,
    });
  }

  forAllObjectInstancesMatchingClassId(classId, fx) {
    this.objectInstances.forEach((object) => {
      if(object.classId === classId) {
        fx(object)
      }
    })
  }

  getObjectById(id) {
    const gameModel = store.getState().game.gameModel

    if(id === 'player') {
      return gameModel.hero
    }
    return gameModel.objects[id]
  }

  getObjectInstancetById(id) {
    return this.objectInstancesById[id]
  }

  addObjectInstance(object) {
    const newPhaserObject = new CoreObject(this, object)
    this.objectInstances.push(newPhaserObject)
    this.objectInstancesById[object.id] = newPhaserObject
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

  create() {
    const gameModel = store.getState().game.gameModel

    this.objectInstances = Object.keys(gameModel.objects).map((objectId) => {
      if(!gameModel.objects[objectId]) {
        return console.error('Object missing!')
      } 
      return new CoreObject(this, objectId, gameModel.objects[objectId])
    });

    this.objectInstances = this.objectInstances.filter((object) => {
      return !!object
    })

    this.objectInstancesById = this.objectInstances.reduce((prev, next) => {
      prev[next.id] = next 
      return prev
    }, {})

    if(gameModel.hero.initialCassId) {
      this.player = new PlayerObject(this, 'player', {
        classId: gameModel.hero.initialClassId,
        spriteId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    } else {
      this.player = new PlayerObject(this, 'player', {
        classDataOverride: {...spaceshipClass},
        spriteId: 'ship2',
        spawnX: gameModel.hero.spawnX,
        spawnY: gameModel.hero.spawnY
      });
    }
  }

  createLayerZeroCollisions() {
    this.bufferCanvas = document.createElement('canvas');
    this.bufferCanvas.width = 40;
    this.bufferCanvas.height =  40;
    this.bufferCanvasContext = this.bufferCanvas.getContext('2d');
    this.bufferCanvasContext.fillStyle = 'rgba(0,0,0,255)'; //Setup alpha colour for cutting out terrain
    this.bufferCanvasContext.drawImage(this.textures.get('key').getSourceImage(), 0,  0, this.bufferCanvas.width, this.bufferCanvas.height);
    this.terrainData = this.bufferCanvasContext.getImageData(0, 0, this.bufferCanvas.width, this.bufferCanvas.height);

    console.log(this.terrainData.data)
  }

  respawn() {
    this.objectInstances.forEach((object) => {
      object.x = object.spawnX
      object.y = object.spawnY
    })

    this.player.x = this.player.spawnX
    this.player.y = this.player.spawnY
  }

  reloadGameModel = (gameModel) => {
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