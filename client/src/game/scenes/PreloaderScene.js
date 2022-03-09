import Phaser from 'phaser';

import { GameScene } from './GameScene';
import {
  PRELOADER_SCENE,
  GAME_SCENE,
} from '../../constants';

export class PreloaderScene extends Phaser.Scene {
  constructor({gameModel}) {
    super({
      key: PRELOADER_SCENE,
    });

    this.gameModel = gameModel
  }

  createLoaderGraphic = () => {
    const width = 800;
    const height = 100;
    const x = this.scale.gameSize.width / 2;
    const y = this.scale.gameSize.height / 2;

    console.log(this.game)

    this.preloaderBg = this.add.rectangle(x, y, width, height, 0xff0000);
    this.preloaderBar = this.add.rectangle(x, y, width, height, 0x0000ff);
    this.preloaderBar.setSize(0, this.preloaderBar.displayHeight);
  };

  create() {
    this.createLoaderGraphic();
    this.load.setCORS('anonymous');
    this.load.atlas('atlas', 'https://media.istockphoto.com/photos/cars-on-production-line-in-factory-picture-id1320950393?s=612x612&cache=' + Math.random(), 'images/assets.json');
    this.load.on('progress', this.updateLoaderGraphic);
    this.load.on('complete', this.checkOrientation);
    this.load.start();
  }

  updateLoaderGraphic = (progress) => {
    this.preloaderBar.setSize((progress * this.preloaderBg.displayWidth), this.preloaderBar.displayHeight);
  };

  checkOrientation = () => {
    this.handleLevelLoaded()
  }

  update() {

  }

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
    this.game.scene.add(GAME_SCENE, new GameScene({ gameModel: this.gameModel }), true);
    this.destroy();
  };

  destroy = () => {
    this.preloaderBg.destroy();
    this.preloaderBar.destroy();
  };
}