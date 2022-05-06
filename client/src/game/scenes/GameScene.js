import Phaser from 'phaser';

import { CoreObject } from '../entities/CoreObject'

import {
  GAME_SCENE,
} from '../../constants';
import { PlayerObject } from '../entities/PlayerObject';
import { v4 as uuidv4 } from 'uuid';

export class GameScene extends Phaser.Scene {
  constructor({gameModel, closeContextMenu, openContextMenu, updateGameModel}) {
    super({
      key: GAME_SCENE,
    });

    this.gameModel = gameModel
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
    this.updateGameModel = updateGameModel
  }

  getGameModelObjectById(id) {
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

  create() {
    // this.gameModel.objects = this.gameModel.objects.filter((object) => {
    //   return !!object.id
    // });

    this.objects = this.gameModel.objects.map((object) => {
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

    this.matter.world.setBounds(0, 0, 1000, 1000);

    this.input.on('pointerover', (pointer, gameObjects) => {
      if(this.dragging) return
      gameObjects[0].outline.setVisible(true)
      gameObjects[0].outline2.setVisible(true)
    });

    this.input.on('pointerout', (pointer, gameObjects) => {
      gameObjects[0].outline.setVisible(false)
      gameObjects[0].outline2.setVisible(false)
    });

    this.input.on('pointerdown', (pointer, gameObjects) => {
      if (pointer.rightButtonDown()) {
        function disableContextMenue(e) {
          e.preventDefault()
          return false
        }

        document.body.addEventListener('contextmenu', disableContextMenue)
        setTimeout(() => {
          document.body.removeEventListener('contextmenu', disableContextMenue)
        })

        if(gameObjects.length) {
          this.openContextMenu(gameObjects, pointer)
        }
      }
    }, this);

    this.input.on('pointerupoutside', (pointer, gameObjects) => {
      this.dragging = false
    });

    this.input.on('pointerup', (pointer, gameObjects) => {
      if(pointer.leftButtonReleased() && !this.dragging) {
        const gameModelObject = {
          id: uuidv4(),
          spawnX: pointer.x,
          spawnY: pointer.y
        }
        this.gameModel.objects.push(gameModelObject)

        this.objects.push(new CoreObject(this, gameModelObject))

        this.updateGameModel(this.gameModel)
      }

      this.dragging = false
    });

    //  The pointer has to move 16 pixels before it's considered as a drag
    this.input.dragDistanceThreshold = 16;
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
      this.dragging = true
    });

    this.input.on('dragend', (pointer, gameObject) => {
      gameObject.spawnX = gameObject.x;
      gameObject.spawnY = gameObject.y;
      const gameModelObject = this.getGameModelObjectById(gameObject.id)
      gameModelObject.spawnX = gameObject.x;
      gameModelObject.spawnY = gameObject.y;
      this.updateGameModel(this.gameModel)
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