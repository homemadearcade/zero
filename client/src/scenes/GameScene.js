import Phaser from 'phaser';

import {
  GAME_SCENE,
  PRELOADER_SCENE,
} from '../constants';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: GAME_SCENE,
    });
  }

  create() {
    this.game.scene.remove(PRELOADER_SCENE);
  }

  destroy() {
    // We want to keep the assets in the cache and leave the renderer for reuse.
    this.game.destroy(true);
  }
}