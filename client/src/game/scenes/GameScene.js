import Phaser from 'phaser';

import { CoreObject } from '../objects/CoreObject'

import {
  GAME_SCENE,
} from '../../constants';
import { PlayerObject } from '../objects/PlayerObject';

export class GameScene extends Phaser.Scene {
  constructor({model, closeContextMenu, openContextMenu}) {
    super({
      key: GAME_SCENE,
    });

    this.model = model
    this.closeContextMenu = closeContextMenu
    this.openContextMenu = openContextMenu
  }

  create() {

    const objects = this.model.objects.map((object) => {
      return new CoreObject(this, 'ship', object.spawnX, object.spawnY)
    });

    const player = new PlayerObject(this, 'ship2', 300, 300)

    this.matter.world.setBounds(0, 0, 1000, 1000);

    this.input.on('pointerover', (pointer, gameObjects) => {
      gameObjects[0].outline.setVisible(true)
      gameObjects[0].outline.setPosition(gameObjects[0].x, gameObjects[0].y)
      gameObjects[0].outline.setRotation(gameObjects[0].rotation)
    });

    this.input.on('pointerout', (pointer, gameObjects) => {
      gameObjects[0].outline.setVisible(false)
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
  }

  reloadModel = (model) => {
    console.log('reloading game based on model change', model)
  }
  
  update() {

  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}