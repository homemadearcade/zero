import Phaser from 'phaser';

import { GameScene } from './GameScene';
import {
  PRELOADER_SCENE,
  GAME_SCENE,
  GAME_WIDTH,
  GAME_HEIGHT,
  setGameScale,
} from '../constants';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({
      key: PRELOADER_SCENE,
    });
  }

  createLoaderGraphic = () => {
    const width = this.scale.gameSize.width * 0.5;
    const height = this.scale.gameSize.height * 0.2;
    const x = this.scale.gameSize.width / 2 - width / 2;
    const y = this.scale.gameSize.height / 2 - height / 2;

    this.preloaderBg = this.add.graphics();
    this.preloaderBg.fillStyle(0xff0000);
    this.preloaderBg.fillRect(x, y, width, height);

    this.preloaderBar = this.add.graphics();
    this.preloaderBar.fillStyle(0x0000ff);
    this.preloaderBar.fillRect(x, y, width, height);
    this.preloaderBar.scaleX = 0;
  };

  create() {
    this.createLoaderGraphic();
    this.load.setCORS('anonymous');
    this.load.atlas('atlas', 'images/assets.png', 'images/assets.json');
    this.load.on('progress', this.updateLoaderGraphic);
    this.load.on('complete', this.checkOrientation);
    this.load.start();
  }

  updateLoaderGraphic = (progress) => {
    this.preloaderBar.scaleX = progress;
  };

  checkOrientation = () => {
    if (this.game.scale.isLandscape) {
      this.game.scale.removeListener(
        Phaser.Scale.Events.ORIENTATION_CHANGE,
        this.checkOrientation
      );

      if (this.rotateDeviceText) {
        this.resizeGame();
      } else {
        this.setGameScale();
        this.handleLevelLoaded();
      }
    } else {
      this.askUserToRotateDevice();
    }
  };

  resizeGame = () => {
    this.game.scale.resize(window.innerWidth, window.innerHeight * 0.9);
    this.game.scale.addListener(
      Phaser.Scale.Events.RESIZE,
      this.onResizeGameComplete
    );
  };

  setGameScale = () => {
    const { width, height } = this.sys.game.canvas;
    setGameScale(Math.min(width / GAME_WIDTH, height / GAME_HEIGHT));
  };

  onResizeGameComplete = () => {
    this.rotateDeviceText.destroy();
    this.setGameScale();
    this.game.scale.removeListener(
      Phaser.Scale.Events.RESIZE,
      this.onResizeGameComplete
    );
    this.playGame();
  };

  handleLevelLoaded = () => {
    this.tweens.add({
      targets: this.preloaderBg,
      alpha: 0,
      delay: 500,
      duration: 1500,
      onComplete: () => {
        this.playGame();
      },
    });

    this.tweens.add({
      targets: this.preloaderBar,
      alpha: 0,
      delay: 500,
      duration: 1500,
    });
  };

  playGame = () => {
    this.game.scene.add(GAME_SCENE, new GameScene(), true);
    this.destroy();
  };

  destroy = () => {
    this.preloaderBg.destroy();
    this.preloaderBar.destroy();
  };
}