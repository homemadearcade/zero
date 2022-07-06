import Phaser from 'phaser';

import { CoreObject } from '../entities/CoreObject'
import { PlayerObject } from '../entities/PlayerObject';
import { v4 as uuidv4 } from 'uuid';

export class CoreScene extends Phaser.Scene {
  constructor({key, lobbyId, gameModel, closeContextMenu, openContextMenu, editGameModel}) {
    super({
      key: key,
    });

    this.gameModel = gameModel
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
    this.editGameModel = editGameModel
    this.lobbyId = lobbyId
  }

  getModelObjectById(id) {
    if(id === 'player') {
      return this.gameModel.hero
    }

    for(let i = 0; i < this.gameModel.objects.length; i++) {
      const gameModelObject = this.gameModel.objects[i]
      if(gameModelObject.id === id) {
        return gameModelObject
      }
    }
  }

  getInstanceObjectById(id) {
    return this.objectsById[id]
  }

  addInstanceObject(object) {
    this.gameModel.objects.push(object)
    const newPhaserObject = new CoreObject(this, object)
    this.objects.push(newPhaserObject)
    this.objectsById[object.id] = newPhaserObject
  }

  updateInstanceObject(instanceObject, {spawnX, spawnY, x, y, rotation}) {
    if(x) instanceObject.x = x;
    if(y) instanceObject.y = y;
    if(rotation) instanceObject.rotation = rotation;
  }
  
  onDragStart (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
    this.draggingObjectId = gameObject.id
  }

  create() {
    this.gameModel.objects = this.gameModel.objects.filter((object) => {
      return !!object
    });

    this.gameModel.objects = this.gameModel.objects.filter((object) => {
      return !!object.classId
    });

    this.objects = this.gameModel.objects.map((object) => {
      if(!object) {
        return console.error('Object missing!')
      } 
      return new CoreObject(this, object)
    });

    this.objectsById = this.objects.reduce((prev, next) => {
      prev[next.id] = next 
      return prev
    }, {})

    this.player = new PlayerObject(this, {
      id: 'player',
      spriteId: 'ship2',
      spawnX: this.gameModel.hero.spawnX,
      spawnY: this.gameModel.hero.spawnY
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