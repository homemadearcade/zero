import Phaser from 'phaser';

import { GameClientScene } from './GameClientScene';
import { GameHostScene } from './GameHostScene';
import { GameLocalScene } from './GameLocalScene';

import {
  PRELOADER_SCENE,
  GAME_SCENE,
} from '../../constants';


export class PreloaderScene extends Phaser.Scene {
  constructor(props) {
    super({
      key: PRELOADER_SCENE,
    });

    this.props = props

    this.isHost = props.isHost 
    this.isNetworked = props.isNetworked
  }

  createLoaderGraphic = () => {
    const width = 800;
    const height = 100;
    const x = this.scale.gameSize.width / 2;
    const y = this.scale.gameSize.height / 2;

    this.preloaderBg = this.add.rectangle(x, y, width, height, 0xff0000);
    this.preloaderBar = this.add.rectangle(x, y, width, height, 0x0000ff);
    this.preloaderBar.setSize(0, this.preloaderBar.displayHeight);
  };

  create() {
    this.createLoaderGraphic();
    this.load.setCORS('anonymous');

    this.load.script('WeaponPlugin', '/assets/js/WeaponPlugin.js');
    this.load.image('bullet','/assets/images/bullet.png');
    this.load.image('ship', "/assets/images/ship.png");
    this.load.image('ship2', '/assets/images/x2kship.png');
    this.load.image('blue', '/assets/images/blue.png');
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
      delay: 100,
      duration: 200,
      onComplete: () => {
        this.playGame();
      },
    });

    this.tweens.add({
      targets: this.preloaderBar,
      alpha: 0,
      delay: 100,
      duration: 200,
    });
  };

  playGame = () => {
    let gameScene;

    if(this.isNetworked) {
      if(this.isHost) {
        gameScene = new GameHostScene(this.props)
      } else {
        gameScene = new GameClientScene(this.props)
      }
    } else {
      gameScene = new GameLocalScene(this.props)
    }

    this.game.scene.add(GAME_SCENE, 
      gameScene
    , true);
    this.game.scene.remove(PRELOADER_SCENE);
    this.destroy();
  };

  destroy = () => {
    this.preloaderBg.destroy();
    this.preloaderBar.destroy();
  };
}