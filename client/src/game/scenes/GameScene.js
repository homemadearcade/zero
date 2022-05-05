import Phaser from 'phaser';

import { CoreObject } from '../objects/CoreObject'

import {
  GAME_SCENE,
} from '../../constants';
import { PlayerObject } from '../objects/PlayerObject';

export class GameScene extends Phaser.Scene {
  constructor(props) {
    super({
      key: GAME_SCENE,
    });
  }

  create() {
    const ship = new CoreObject(this, 'ship', 100, 100)

    const player = new PlayerObject(this, 'ship2', 300, 300)

    this.matter.world.setBounds(0, 0, 800, 600);

    this.input.on('pointerover', (pointer, gameObjects) => {
      gameObjects[0].outline.setVisible(true)
      gameObjects[0].outline.setPosition(gameObjects[0].x, gameObjects[0].y)
      gameObjects[0].outline.setRotation(gameObjects[0].rotation)
    });

    this.input.on('pointerout', (pointer, gameObjects) => {
      gameObjects[0].outline.setVisible(false)
    });
  }
  
  update() {

  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}