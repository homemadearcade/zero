import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Phaser from 'phaser';
import { PreloaderScene } from '../scenes/PreloaderScene';

import './GameView.scss';
import { PRELOADER_SCENE } from '../../constants';

import WaterBodyPlugin from 'phaser-plugin-water-body';
import { gameSize } from '../../defaultData/general';
import { setGameInstance } from '../../store/actions/gameActions';
import { getCurrentGameScene } from '../../utils/editorUtils';

import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";

const config= {
  type: Phaser.WEBGL,
  pixelArt: true,
  parent: 'game',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    parent: 'PhaserGame',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameSize,
    height: gameSize
  },
  physics: {
    default: 'arcade',
    // matter: {
    //   debug: {
    //     showBody: true,
    //     showStaticBody: true
    //   },
    //   plugins: {
    //     wrap: true
    //   },
    // },
    arcade: {
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
  }
  },
  plugins: {
    // global: [
    //   {
    //     key: 'WaterBodyPlugin',
    //     plugin: WaterBodyPlugin,
    //     start: true,
    //   }
    // ],
    // scene: [
    //   {
    //     plugin: PhaserMatterCollisionPlugin, // The plugin class
    //     key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
    //     mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
    //   }
    // ]
  }
}

const GameView = ({isHost, isNetworked, setGameInstance}) => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    game.scene.add(PRELOADER_SCENE, new PreloaderScene({ isHost, isNetworked}), true);
    setGameInstance(game)

    return () => {
      getCurrentGameScene(game).unload()
      game.destroy()
    }
  }, []);

  return (
    <div className="GameView">
      <div id="PhaserGame"/>
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { setGameInstance })(GameView);