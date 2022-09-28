import Phaser from 'phaser';

import { GameClientScene } from './GameClientScene';
import { GameHostScene } from './GameHostScene';
import { GameLocalScene } from './GameLocalScene';
import store from '../../store';

import {
  PRELOADER_SCENE,
  GAME_SCENE,
  DEFAULT_TEXTURE_ID,
  DEFAULT_CLEAR_TEXTURE_ID,
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

    this.load.image('bullet','/assets/images/bullet.png');
    this.load.image('ship', "/assets/images/ship.png");
    this.load.image('ship2', '/assets/images/x2kship.png');
    this.load.image('blue', '/assets/images/blue.png');
    this.load.image('brush', '/assets/images/brush.png')
    this.load.image(DEFAULT_TEXTURE_ID, '/assets/images/square10x10.png')
    this.load.image(DEFAULT_CLEAR_TEXTURE_ID, '/assets/images/eraser10x10.png')

    const gameModel = store.getState().game.gameModel
    Object.keys(gameModel.awsImages).forEach((awsImageId) => {
      console.log('downloading', awsImageId)
      const awsImageData = gameModel.awsImages[awsImageId]
      this.load.image(awsImageId, window.awsUrl + awsImageData.url)
    })

    Object.keys(window.spriteSheets).forEach((spriteSheetId) => {
      const spriteSheet = window.spriteSheets[spriteSheetId]
      if(spriteSheet.serverImageUrl) {
        this.load.image(spriteSheet.id, window.location.origin + '/' +  spriteSheet.serverImageUrl)
      }
    })

    // this.load.image('kenny_platformer_64x64', 'https://labs.phaser.io/assets/tilemaps/tiles/kenny_platformer_64x64.png')

    this.load.plugin('rexglowfilterpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilterpipelineplugin.min.js', true);

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
    Object.keys(window.spriteSheets).forEach((spriteSheetId) => {
      const ss = window.spriteSheets[spriteSheetId]
      if(!ss.serverImageUrl) return
      
      ss.sprites.forEach((tile) => {
        const tileNamePrefix = 'sprite'
        this.textures.get(ss.id).add(tile.id.slice(tileNamePrefix.length), 0, tile.x, tile.y, tile.width, tile.height)
      })
    })

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

  unload = () => {
    this.destroy()
  }
}