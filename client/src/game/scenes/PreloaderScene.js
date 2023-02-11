import Phaser from 'phaser';
import store from '../../store';

import {
  PRELOADER_SCENE,
  DEFAULT_TEXTURE_ID,
  DEFAULT_CLEAR_TEXTURE_ID,
} from '../constants';
import { createGameSceneInstance } from '../../utils/gameUtils';

export class PreloaderScene extends Phaser.Scene {
  constructor({ isNetworked, isEdit, hostUserId, gameInstanceId, id}) {
    super({
      key: PRELOADER_SCENE,
    });

    this.gameSession = {
      isHost: isNetworked ? hostUserId === store.getState().auth.me?.id : true,
      isNetworked,
      isEdit,
      gameInstanceId,
      id: id
    }

    if(store.getState().webPage.gameInstanceId) {
      console.error('a new game has been loaded for some reason with id', this.gameSession.gameInstanceId, 'should be', store.getState().webPage.gameInstanceId)
    }
  }

  create() {
    // this.createLoaderGraphic();
    this.load.setCORS('anonymous');

    this.load.image('bullet','/assets/images/bullet.png');
    this.load.image('ship', "/assets/images/ship.png");
    this.load.image('ship2', '/assets/images/x2kship.png');
    this.load.image('blue', '/assets/images/blue.png');
    this.load.image('brush', '/assets/images/brush.png')
    this.load.image(DEFAULT_TEXTURE_ID, '/assets/images/square10x10.png')
    this.load.image(DEFAULT_CLEAR_TEXTURE_ID, '/assets/images/eraser10x10.png')

    const gameModel = store.getState().gameModel.gameModel
    Object.keys(gameModel.awsImages).forEach((awsImageId) => {
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

    this.load.start();
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading..').setOrigin(0.5);
    
    this.load.plugin('rexglowfilterpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexglowfilterpipelineplugin.min.js', true);

    this.load.on('progress', this.updateLoaderGraphic);
    this.load.on('complete', this.checkOrientation);
    
    this.load.start();
  }

  updateLoaderGraphic = (progress) => {
    if(this.loadingText) this.loadingText.destroy()
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    const formattedProgress = (100 * progress).toFixed(0)
    this.loadingText = this.add.text(screenCenterX, screenCenterY, 'Loading ' + formattedProgress + '%').setOrigin(0.5);
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

    this.updateLoaderGraphic(1)
    this.playGame()
  };

  addGameScene(key) {
    this.scene.add(key, createGameSceneInstance(key, this.gameSession));
  }

  playGame = () => {
    const gameModel = store.getState().gameModel.gameModel
    Object.keys(gameModel.stages).forEach((stageId) => {
      this.addGameScene(stageId)
    })
    
    this.scene.start(gameModel.player.startingStageId, { firstStage: true })

    this.game.scene.remove(PRELOADER_SCENE);
    this.destroy();
  };

  destroy = () => {
    this.loadingText.destroy()
  };

  unload = () => {
    this.destroy()
  }
}