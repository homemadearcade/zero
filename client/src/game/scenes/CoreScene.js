import Phaser from 'phaser';

import { CoreObject } from '../entities/CoreObject'
import { PlayerObject } from '../entities/PlayerObject';
import store from '../../store';

export class CoreScene extends Phaser.Scene {
  constructor({key }) {
    super({
      key: key,
    });
  }

  getModelObjectById(id) {
    const gameModel = store.getState().game.gameModel

    if(id === 'player') {
      return gameModel.hero
    }
    return gameModel.objects[id]
  }

  getInstanceObjectById(id) {
    return this.objectsById[id]
  }

  addInstanceObject(object) {
    const newPhaserObject = new CoreObject(this, object)
    this.objects.push(newPhaserObject)
    this.objectsById[object.id] = newPhaserObject
  }

  updateInstanceObject(instanceObject, {spawnX, spawnY, x, y, rotation, bounciness}) {
    if(x) instanceObject.x = x;
    if(y) instanceObject.y = y;
    if(rotation) instanceObject.rotation = rotation;
    if(bounciness) instanceObject.setBounce(bounciness)
  }

  create() {
    const gameModel = store.getState().game.gameModel

    this.objects = Object.keys(gameModel.objects).map((objectId) => {
      // if(!object) {
      //   return console.error('Object missing!')
      // } 
      return new CoreObject(this, gameModel.objects[objectId])
    });

    this.objectsById = {...gameModel.objects}

    this.player = new PlayerObject(this, {
      id: 'player',
      spriteId: 'ship2',
      spawnX: gameModel.hero.spawnX,
      spawnY: gameModel.hero.spawnY
    });
  }

  respawn() {
    this.objects.forEach((object) => {
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
    this.objects.forEach((object) => {
      object.update(time, delta);
    })

    this.player.update(time, delta)
  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}